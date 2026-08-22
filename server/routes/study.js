const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { serverConfig } = require('../config');
const supabase = require('../utils/db');
const authMiddleware = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const {
    normalizeDeckResponse,
    normalizeFlashcardForClient,
    prepareStudySetForSave
} = require('../utils/studyContracts');
const { logger } = require('../utils/logger');
const { embedText, generateText } = require('../services/aiService');
const { extractStructuredJson } = require('../utils/aiPayloads');

const router = express.Router();

router.use(authMiddleware);

const createAuthedSupabaseClient = (token) => createClient(
    serverConfig.supabase.url,
    serverConfig.supabase.serviceRoleKey,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
);

const insertDeckRecord = async (userSupabase, deckPayload) => {
    const response = await userSupabase
        .from('decks')
        .insert(deckPayload)
        .select()
        .single();

    return {
        deck: response.data,
        error: response.error
    };
};

const normalizeQuizRowsForClient = (rows = []) => rows.map((row) => ({
    question: row.prompt,
    options: row.options,
    correctIndex: row.correct_index,
    explanation: row.explanation
}));

const fetchQuizRowsForDeck = async (deckId) => {
    const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('deck_id', deckId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
};

router.post('/save', aiLimiter, async (req, res) => {
    let userSupabase;
    let createdDeckId = null;

    try {
        const { title, originalText, flashcards = [], quiz = [] } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        const preparedStudySet = prepareStudySetForSave({ flashcards, quiz });
        userSupabase = createAuthedSupabaseClient(token);

        const { deck, error: deckError } = await insertDeckRecord(userSupabase, {
                user_id: req.user.id,
                title: typeof title === 'string' && title.trim() ? title.trim() : 'Untitled Study Set',
                description: typeof originalText === 'string' && originalText.trim()
                    ? `${originalText.trim().substring(0, 100)}...`
                    : '',
                source_text: typeof originalText === 'string' && originalText.trim()
                    ? originalText.trim().substring(0, 50000)
                    : null,
                card_count: preparedStudySet.flashcards.length,
                question_count: preparedStudySet.quiz.length
            });

        if (deckError) throw deckError;
        createdDeckId = deck.id;

        const cardsToInsert = await Promise.all(preparedStudySet.flashcards.map(async (card) => {
            let embedding = null;
            try {
                // Combine text for a rich semantic representation
                const contentText = `${card.front || ''} ${card.back || ''} ${card.explanation || ''}`.trim();
                if (contentText) {
                    // embedText returns a 768-dimensional array, which Supabase/pgvector natively accepts
                    embedding = `[${(await embedText(contentText)).join(',')}]`;
                }
            } catch (err) {
                logger.warn('Failed to generate embedding for flashcard, skipping vector injection', { reason: err.message });
                // We proceed without embedding so the flashcard itself doesn't fail to save
            }

            return {
                deck_id: deck.id,
                front: card.front,
                back: card.back,
                explanation: card.explanation,
                topics: card.topics || [],
                source_excerpt: card.source_excerpt || null,
                source_section: card.source_section || null,
                embedding 
            };
        }));

        if (cardsToInsert.length > 0) {
            const { error: cardsError } = await userSupabase
                .from('flashcards')
                .insert(cardsToInsert);

            if (cardsError) throw cardsError;
        }

        const quizToInsert = preparedStudySet.quiz.map((question) => ({
            deck_id: deck.id,
            prompt: question.prompt,
            options: question.options,
            correct_index: question.correct_index,
            explanation: question.explanation
        }));

        if (quizToInsert.length > 0) {
            const { error: quizError } = await userSupabase
                .from('quiz_questions')
                .insert(quizToInsert);

            if (quizError) throw quizError;
        }

        res.json({
            success: true,
            deckId: deck.id,
            message: 'Saved to Cloud!'
        });
    } catch (error) {
        if (createdDeckId && userSupabase) {
            const { error: rollbackError } = await userSupabase
                .from('decks')
                .delete()
                .eq('id', createdDeckId);

            if (rollbackError) {
                logger.error('Rollback after failed save also failed', {
                    deckId: createdDeckId,
                    reason: rollbackError.message
                });
            }
        }

        logger.error('Save study set failed', {
            code: error.code,
            details: error.details,
            reason: error.message
        });

        const statusCode = /required|must include|must be an array|not supported|missing/i.test(error.message)
            ? 400
            : 500;

        res.status(statusCode).json({
            error: error.message,
            details: error.details || 'Check server logs'
        });
    }
});

router.get('/history', async (req, res) => {
    try {
        const { data: decks, error } = await supabase
            .from('decks')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(decks);
    } catch (error) {
        logger.error('Fetch history failed', { reason: error.message });
        res.status(500).json({ error: 'Failed to load study history.' });
    }
});

router.get('/deck/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data: deck, error: deckError } = await supabase
            .from('decks')
            .select('*')
            .eq('id', id)
            .single();

        if (deckError) throw deckError;

        if (deck.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { data: flashcards, error: cardsError } = await supabase
            .from('flashcards')
            .select('*')
            .eq('deck_id', id);

        if (cardsError) throw cardsError;
        const quizRows = await fetchQuizRowsForDeck(id);

        res.json(normalizeDeckResponse({
            deck,
            flashcards,
            quiz: normalizeQuizRowsForClient(quizRows)
        }));
    } catch (error) {
        logger.error('Load deck failed', { reason: error.message });
        res.status(500).json({ error: 'Failed to load study set.' });
    }
});

router.post('/review', async (req, res) => {
    try {
        const { cardId, rating } = req.body;

        const { data: card, error: fetchError } = await supabase
            .from('flashcards')
            .select('*')
            .eq('id', cardId)
            .single();

        if (fetchError) throw fetchError;

        const { data: deck, error: deckError } = await supabase
            .from('decks')
            .select('user_id')
            .eq('id', card.deck_id)
            .single();

        if (deckError) throw deckError;

        if (deck.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        let interval = card.srs_interval || 0;
        let easeFactor = card.srs_ease_factor || 2.5;
        let repetitions = card.srs_repetitions || 0;

        if (rating === 1) {
            repetitions = 0;
            interval = 1;
        } else {
            if (repetitions === 0) {
                interval = 1;
            } else if (repetitions === 1) {
                interval = 6;
            } else {
                interval = Math.round(interval * easeFactor);
            }
            repetitions += 1;
        }

        const q = rating + 1;
        easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        if (easeFactor < 1.3) easeFactor = 1.3;

        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + interval);

        const { error: updateError } = await supabase
            .from('flashcards')
            .update({
                srs_interval: interval,
                srs_ease_factor: easeFactor,
                srs_repetitions: repetitions,
                next_review_at: nextReviewDate.toISOString()
            })
            .eq('id', cardId);

        if (updateError) throw updateError;

        res.json({ success: true, nextReview: nextReviewDate, interval });
    } catch (error) {
        logger.error('Review flashcard failed', { reason: error.message });
        res.status(500).json({ error: 'Failed to record review.' });
    }
});

const getUserDeckIds = async (userId) => {
    const { data, error } = await supabase
        .from('decks')
        .select('id')
        .eq('user_id', userId);

    if (error) throw error;
    return (data || []).map((deck) => deck.id);
};

const assertCardOwnership = async (cardId, userId) => {
    const { data: card, error: cardError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('id', cardId)
        .single();

    if (cardError) throw cardError;

    const { data: deck, error: deckError } = await supabase
        .from('decks')
        .select('id, user_id, source_text, title')
        .eq('id', card.deck_id)
        .single();

    if (deckError) throw deckError;
    if (deck.user_id !== userId) {
        const authError = new Error('Unauthorized');
        authError.statusCode = 403;
        throw authError;
    }

    return { card, deck };
};

const buildCardEmbedding = async (front, back, explanation) => {
    const contentText = `${front || ''} ${back || ''} ${explanation || ''}`.trim();
    if (!contentText) return null;

    try {
        return `[${(await embedText(contentText)).join(',')}]`;
    } catch (err) {
        logger.warn('Failed to generate embedding for flashcard update', { reason: err.message });
        return null;
    }
};

const regenerateCardContent = async ({ card, deck, feedback = '' }) => {
    const sourceText = deck.source_text || '';
    const contextSnippet = sourceText
        ? sourceText.substring(0, 12000)
        : `${card.front}\n${card.back}\n${card.explanation || ''}`;

    const prompt = `Regenerate ONE improved flashcard based on the study material below.
The previous card may have been inaccurate or too hard.

Previous card:
Question: ${card.front}
Answer: ${card.back}
${feedback ? `User feedback: ${feedback}` : 'User marked this card as difficult.'}

Return a single JSON object (not an array) with:
- "question": string
- "answer": string
- "explanation": string
- "topics": array of 1-3 short topic tags
- "sourceExcerpt": verbatim quote from the material (max 120 chars)
- "sourceSection": optional location like "page 4" or "section 2.1"

Study material:
${contextSnippet}`;

    const generation = await generateText({
        prompt,
        systemInstruction: 'You output strict JSON only. No markdown fences.',
    });

    const parsed = extractStructuredJson(generation.text);
    const cardData = Array.isArray(parsed) ? parsed[0] : parsed;
    if (!cardData?.question && !cardData?.front) {
        throw new Error('AI returned invalid regenerated card.');
    }

    return {
        front: (cardData.question || cardData.front || '').trim(),
        back: (cardData.answer || cardData.back || '').trim(),
        explanation: (cardData.explanation || '').trim(),
        topics: Array.isArray(cardData.topics) ? cardData.topics : [],
        source_excerpt: (cardData.sourceExcerpt || cardData.source_excerpt || '').trim(),
        source_section: (cardData.sourceSection || cardData.source_section || '').trim(),
    };
};

router.get('/due', async (req, res) => {
    try {
        const deckIds = await getUserDeckIds(req.user.id);
        if (deckIds.length === 0) {
            return res.json({ dueCount: 0, dueTomorrow: 0, dueByDeck: [] });
        }

        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);

        const { data: cards, error } = await supabase
            .from('flashcards')
            .select('id, deck_id, next_review_at')
            .in('deck_id', deckIds);

        if (error) throw error;

        const dueCards = (cards || []).filter((card) => {
            if (!card.next_review_at) return true;
            return new Date(card.next_review_at) <= now;
        });

        const dueTomorrowCards = (cards || []).filter((card) => {
            if (!card.next_review_at) return false;
            const reviewAt = new Date(card.next_review_at);
            return reviewAt > now && reviewAt <= tomorrow;
        });

        const countsByDeck = dueCards.reduce((acc, card) => {
            acc[card.deck_id] = (acc[card.deck_id] || 0) + 1;
            return acc;
        }, {});

        const deckIdList = Object.keys(countsByDeck);
        if (deckIdList.length === 0) {
            return res.json({
                dueCount: dueCards.length,
                dueTomorrow: dueTomorrowCards.length,
                dueByDeck: [],
            });
        }

        const { data: decks, error: decksError } = await supabase
            .from('decks')
            .select('id, title')
            .in('id', deckIdList);

        if (decksError) throw decksError;

        const dueByDeck = (decks || [])
            .map((deck) => ({
                deckId: deck.id,
                title: deck.title,
                count: countsByDeck[deck.id] || 0,
            }))
            .filter((item) => item.count > 0)
            .sort((a, b) => b.count - a.count);

        res.json({
            dueCount: dueCards.length,
            dueTomorrow: dueTomorrowCards.length,
            dueByDeck,
        });
    } catch (error) {
        logger.error('Fetch due cards failed', { reason: error.message });
        res.status(500).json({ error: 'Failed to fetch due cards.' });
    }
});

router.post('/session', async (req, res) => {
    try {
        const {
            deckId = null,
            mode,
            durationSeconds = 0,
            cardsReviewed = 0,
            correctCount = 0,
            xpEarned = 0,
        } = req.body;

        if (!['flashcard', 'quiz', 'srs', 'adaptive'].includes(mode)) {
            return res.status(400).json({ error: 'Invalid session mode.' });
        }

        if (deckId) {
            const { data: deck, error: deckError } = await supabase
                .from('decks')
                .select('user_id')
                .eq('id', deckId)
                .single();

            if (deckError) throw deckError;
            if (deck.user_id !== req.user.id) {
                return res.status(403).json({ error: 'Unauthorized' });
            }
        }

        const { data, error } = await supabase
            .from('study_sessions')
            .insert({
                user_id: req.user.id,
                deck_id: deckId,
                mode,
                duration_seconds: Math.max(0, Number(durationSeconds) || 0),
                cards_reviewed: Math.max(0, Number(cardsReviewed) || 0),
                correct_count: Math.max(0, Number(correctCount) || 0),
                xp_earned: Math.max(0, Number(xpEarned) || 0),
            })
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, session: data });
    } catch (error) {
        logger.error('Record study session failed', { reason: error.message });
        res.status(500).json({ error: 'Failed to record study session.' });
    }
});

router.patch('/card/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { front, back, explanation, sourceExcerpt, sourceSection } = req.body;

        const { card, deck } = await assertCardOwnership(id, req.user.id);

        const updates = {};
        if (typeof front === 'string' && front.trim()) updates.front = front.trim();
        if (typeof back === 'string' && back.trim()) updates.back = back.trim();
        if (typeof explanation === 'string') updates.explanation = explanation.trim();
        if (typeof sourceExcerpt === 'string') updates.source_excerpt = sourceExcerpt.trim();
        if (typeof sourceSection === 'string') updates.source_section = sourceSection.trim();

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update.' });
        }

        const nextFront = updates.front || card.front;
        const nextBack = updates.back || card.back;
        const nextExplanation = updates.explanation ?? card.explanation;
        const embedding = await buildCardEmbedding(nextFront, nextBack, nextExplanation);
        if (embedding) updates.embedding = embedding;

        const { data, error } = await supabase
            .from('flashcards')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, card: normalizeFlashcardForClient(data), deckId: deck.id });
    } catch (error) {
        const status = error.statusCode || 500;
        logger.error('Update flashcard failed', { reason: error.message });
        res.status(status).json({ error: error.message });
    }
});

router.post('/card/:id/regenerate', aiLimiter, async (req, res) => {
    try {
        const { id } = req.params;
        const { feedback = '' } = req.body;

        const { card, deck } = await assertCardOwnership(id, req.user.id);
        const regenerated = await regenerateCardContent({ card, deck, feedback });
        const embedding = await buildCardEmbedding(regenerated.front, regenerated.back, regenerated.explanation);

        const updates = {
            ...regenerated,
            ...(embedding ? { embedding } : {}),
        };

        const { data, error } = await supabase
            .from('flashcards')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, card: normalizeFlashcardForClient(data), deckId: deck.id });
    } catch (error) {
        const status = error.statusCode || 500;
        logger.error('Regenerate flashcard failed', { reason: error.message });
        res.status(status).json({ error: error.message });
    }
});

router.post('/regenerate-weak', aiLimiter, async (req, res) => {
    try {
        const { deckId, cardIds = [], limit = 3 } = req.body;

        if (!deckId) {
            return res.status(400).json({ error: 'deckId is required.' });
        }

        const { data: deck, error: deckError } = await supabase
            .from('decks')
            .select('id, user_id, source_text, title')
            .eq('id', deckId)
            .single();

        if (deckError) throw deckError;
        if (deck.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        let query = supabase
            .from('flashcards')
            .select('*')
            .eq('deck_id', deckId);

        if (Array.isArray(cardIds) && cardIds.length > 0) {
            query = query.in('id', cardIds);
        } else {
            query = query.or('srs_interval.eq.1,srs_repetitions.eq.0').limit(Math.min(limit, 5));
        }

        const { data: cards, error: cardsError } = await query;
        if (cardsError) throw cardsError;

        const targets = (cards || []).slice(0, Math.min(limit, 5));
        if (targets.length === 0) {
            return res.json({ success: true, cards: [], message: 'No weak cards found to regenerate.' });
        }

        const regeneratedCards = [];
        for (const card of targets) {
            const regenerated = await regenerateCardContent({
                card,
                deck,
                feedback: 'This card felt off during review. Make it clearer and more accurate.',
            });
            const embedding = await buildCardEmbedding(regenerated.front, regenerated.back, regenerated.explanation);

            const { data, error } = await supabase
                .from('flashcards')
                .update({
                    ...regenerated,
                    ...(embedding ? { embedding } : {}),
                })
                .eq('id', card.id)
                .select()
                .single();

            if (error) throw error;
            regeneratedCards.push(normalizeFlashcardForClient(data));
        }

        res.json({ success: true, cards: regeneratedCards });
    } catch (error) {
        logger.error('Regenerate weak cards failed', { reason: error.message });
        res.status(500).json({ error: error.message });
    }
});

router.delete('/deck/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data: deck, error: deckError } = await supabase
            .from('decks')
            .select('user_id')
            .eq('id', id)
            .single();

        if (deckError) throw deckError;

        if (deck.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { error } = await supabase
            .from('decks')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true });
    } catch (error) {
        logger.error('Delete deck failed', { reason: error.message });
        res.status(500).json({ error: 'Failed to delete study set.' });
    }
});

module.exports = router;
