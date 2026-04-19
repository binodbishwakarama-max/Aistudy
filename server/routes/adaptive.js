const express = require('express');
const supabase = require('../utils/db');
const authMiddleware = require('../middleware/auth');
const { generateText } = require('../services/aiService');
const { logger } = require('../utils/logger');

const router = express.Router();

router.use(authMiddleware);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DIFFICULTY_THRESHOLDS = {
    weak: 0.4,
    strong: 0.7
};

/**
 * Partition topics into weak / neutral / strong buckets.
 */
const partitionTopics = (topicScores) => {
    const weak = [];
    const neutral = [];
    const strong = [];

    for (const row of topicScores) {
        if (row.score < DIFFICULTY_THRESHOLDS.weak) {
            weak.push(row.topic);
        } else if (row.score >= DIFFICULTY_THRESHOLDS.strong) {
            strong.push(row.topic);
        } else {
            neutral.push(row.topic);
        }
    }

    return { weak, neutral, strong };
};

/**
 * Build the system & user prompts that steer the AI towards the right
 * difficulty for each topic bucket.
 */
const buildAdaptivePrompt = ({ weak, neutral, strong, flashcardContext, questionCount = 10 }) => {
    const topicGuidance = [];

    if (weak.length > 0) {
        topicGuidance.push(
            `The student is WEAK in these topics: [${weak.join(', ')}]. ` +
            `Generate foundational, definition-based questions for these topics. Keep them simple and direct.`
        );
    }

    if (strong.length > 0) {
        topicGuidance.push(
            `The student is STRONG in these topics: [${strong.join(', ')}]. ` +
            `Generate application-level and synthesis/scenario-based questions for these topics. Make them challenging.`
        );
    }

    if (neutral.length > 0) {
        topicGuidance.push(
            `The student has MODERATE knowledge of: [${neutral.join(', ')}]. ` +
            `Generate a balanced mix of recall and application questions for these topics.`
        );
    }

    if (topicGuidance.length === 0) {
        topicGuidance.push(
            'The student is new. Generate a balanced mix of easy and moderate questions across all topics present in the flashcards.'
        );
    }

    const systemInstruction =
        'You are an adaptive quiz engine for a study platform. ' +
        'You generate multiple-choice questions calibrated to the student\'s mastery level. ' +
        'Output strict JSON only — no markdown, no commentary.';

    const userPrompt = `Based on the following flashcard content, generate exactly ${questionCount} multiple-choice questions.

${topicGuidance.join('\n\n')}

**Flashcard content for context:**
${flashcardContext}

Return the result as a strictly formatted JSON array of objects. Each object must have:
- "question": string (the question text)
- "options": array of exactly 4 strings
- "correctIndex": number (0-3, index of the correct option)
- "explanation": string (brief explanation of the correct answer)
- "topic": string (the single most relevant topic this question tests)
- "difficulty": string (one of "foundational", "balanced", "advanced")

Output ONLY the JSON array. No markdown fences, no extra text.`;

    return { systemInstruction, prompt: userPrompt };
};

/**
 * Exponential moving average for topic score updates.
 * Biases towards recent performance (30% weight for new result).
 */
const calculateNewScore = (oldScore, isCorrect) => {
    const newDataPoint = isCorrect ? 1.0 : 0.0;
    return oldScore * 0.7 + newDataPoint * 0.3;
};

// ---------------------------------------------------------------------------
// POST /api/adaptive/generate
// Generates an adaptive quiz from ALL of the user's flashcards.
// ---------------------------------------------------------------------------

router.post('/generate', async (req, res) => {
    try {
        const userId = req.user.id;
        const { questionCount = 10 } = req.body;

        // 1. Fetch all flashcards across all user decks
        const { data: flashcards, error: fcError } = await supabase
            .from('flashcards')
            .select('front, back, explanation, topics, deck_id')
            .in('deck_id',
                supabase
                    .from('decks')
                    .select('id')
                    .eq('user_id', userId)
            );

        // Fallback: If the subquery approach fails, use a two-step fetch
        let cards = flashcards;
        if (fcError || !cards) {
            const { data: decks, error: deckError } = await supabase
                .from('decks')
                .select('id')
                .eq('user_id', userId);

            if (deckError) throw deckError;

            if (!decks || decks.length === 0) {
                return res.status(400).json({
                    error: 'No study decks found. Upload and generate flashcards first.'
                });
            }

            const deckIds = decks.map((d) => d.id);
            const { data: fallbackCards, error: fallbackError } = await supabase
                .from('flashcards')
                .select('front, back, explanation, topics, deck_id')
                .in('deck_id', deckIds);

            if (fallbackError) throw fallbackError;
            cards = fallbackCards || [];
        }

        if (cards.length === 0) {
            return res.status(400).json({
                error: 'No flashcards found across your decks. Generate some content first.'
            });
        }

        // 2. Fetch topic mastery scores
        const { data: topicScores, error: tsError } = await supabase
            .from('topic_scores')
            .select('topic, score, attempts, correct')
            .eq('user_id', userId);

        if (tsError && tsError.code !== 'PGRST116' && tsError.code !== '42P01') {
            throw tsError;
        }

        const scores = topicScores || [];

        // 3. Partition topics
        const { weak, neutral, strong } = partitionTopics(scores);

        // 4. Build flashcard context (truncated to ~15,000 chars to fit LLM context)
        const flashcardContext = cards
            .map((c) => `Q: ${c.front}\nA: ${c.back}${c.explanation ? `\nExplanation: ${c.explanation}` : ''}`)
            .join('\n---\n')
            .substring(0, 15000);

        // 5. Generate adaptive quiz via AI
        const { systemInstruction, prompt } = buildAdaptivePrompt({
            weak,
            neutral,
            strong,
            flashcardContext,
            questionCount: Math.min(questionCount, 20)
        });

        const generation = await generateText({ prompt, systemInstruction });

        // 6. Parse the response using the shared robust parser
        const { extractStructuredJson, unwrapArray } = require('../utils/aiPayloads');
        let questions;
        try {
            const parsed = extractStructuredJson(generation.text);
            questions = unwrapArray(parsed);
        } catch (parseError) {
            throw new Error('AI returned malformed quiz data: ' + parseError.message);
        }

        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error('AI returned an empty or invalid quiz.');
        }

        // 7. Normalize and validate
        const validatedQuestions = questions
            .filter((q) =>
                q.question &&
                Array.isArray(q.options) &&
                q.options.length === 4 &&
                typeof q.correctIndex === 'number' &&
                q.correctIndex >= 0 &&
                q.correctIndex <= 3
            )
            .map((q) => ({
                question: q.question,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation || '',
                topic: q.topic || 'General',
                difficulty: ['foundational', 'balanced', 'advanced'].includes(q.difficulty)
                    ? q.difficulty
                    : 'balanced'
            }));

        if (validatedQuestions.length === 0) {
            throw new Error('AI quiz generation produced no valid questions.');
        }

        res.json({
            questions: validatedQuestions,
            provider: generation.provider,
            topicBreakdown: { weak, neutral, strong },
            totalFlashcardsUsed: cards.length
        });

    } catch (error) {
        logger.error('Adaptive quiz generation failed', { reason: error.message });
        res.status(500).json({ error: error.message || 'Failed to generate adaptive quiz.' });
    }
});

// ---------------------------------------------------------------------------
// POST /api/adaptive/submit
// Accepts quiz results and updates topic mastery scores.
// ---------------------------------------------------------------------------

router.post('/submit', async (req, res) => {
    try {
        const userId = req.user.id;
        const { results } = req.body;

        if (!Array.isArray(results) || results.length === 0) {
            return res.status(400).json({ error: 'Results array is required.' });
        }

        // Group results by topic
        const topicAggregates = {};
        for (const r of results) {
            const topic = (r.topic || 'General').trim();
            if (!topicAggregates[topic]) {
                topicAggregates[topic] = { attempts: 0, correct: 0 };
            }
            topicAggregates[topic].attempts += 1;
            if (r.correct) {
                topicAggregates[topic].correct += 1;
            }
        }

        // Fetch existing scores for the user
        const topics = Object.keys(topicAggregates);
        const { data: existingScores, error: fetchError } = await supabase
            .from('topic_scores')
            .select('*')
            .eq('user_id', userId)
            .in('topic', topics);

        if (fetchError && fetchError.code !== '42P01') throw fetchError;

        const existingMap = {};
        for (const row of (existingScores || [])) {
            existingMap[row.topic] = row;
        }

        // Upsert each topic score
        const upsertPayloads = topics.map((topic) => {
            const agg = topicAggregates[topic];
            const existing = existingMap[topic];

            const oldScore = existing ? existing.score : 0.5;
            const oldAttempts = existing ? existing.attempts : 0;
            const oldCorrect = existing ? existing.correct : 0;

            // Apply EMA for each correct/incorrect answer
            let newScore = oldScore;
            for (let i = 0; i < agg.attempts; i++) {
                const isCorrect = i < agg.correct;
                newScore = calculateNewScore(newScore, isCorrect);
            }

            return {
                user_id: userId,
                topic,
                score: Math.round(newScore * 1000) / 1000, // 3 decimal precision
                attempts: oldAttempts + agg.attempts,
                correct: oldCorrect + agg.correct,
                updated_at: new Date().toISOString()
            };
        });

        const { data: upserted, error: upsertError } = await supabase
            .from('topic_scores')
            .upsert(upsertPayloads, { onConflict: 'user_id,topic' })
            .select();

        if (upsertError) throw upsertError;

        // Calculate summary
        const totalCorrect = results.filter((r) => r.correct).length;
        const totalAttempts = results.length;
        const accuracy = Math.round((totalCorrect / totalAttempts) * 100);

        // XP reward: base 50 + bonus for high accuracy
        let xpEarned = 50;
        if (accuracy >= 90) xpEarned += 150;
        else if (accuracy >= 70) xpEarned += 100;
        else if (accuracy >= 50) xpEarned += 50;

        res.json({
            success: true,
            accuracy,
            xpEarned,
            topicScores: (upserted || []).map((s) => ({
                topic: s.topic,
                score: s.score,
                attempts: s.attempts,
                correct: s.correct
            })),
            summary: {
                totalQuestions: totalAttempts,
                correctAnswers: totalCorrect,
                topicsUpdated: topics.length
            }
        });

    } catch (error) {
        logger.error('Adaptive quiz submission failed', { reason: error.message });
        res.status(500).json({ error: error.message || 'Failed to submit adaptive quiz results.' });
    }
});

// ---------------------------------------------------------------------------
// GET /api/adaptive/topics
// Returns the user's current topic mastery overview.
// ---------------------------------------------------------------------------

router.get('/topics', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('topic_scores')
            .select('topic, score, attempts, correct, updated_at')
            .eq('user_id', req.user.id)
            .order('score', { ascending: true });

        if (error && error.code !== '42P01') throw error;

        res.json({ topics: data || [] });
    } catch (error) {
        logger.error('Fetch topic scores failed', { reason: error.message });
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

// Export helpers for testing
module.exports._testExports = {
    partitionTopics,
    buildAdaptivePrompt,
    calculateNewScore
};
