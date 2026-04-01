const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { serverConfig } = require('../config');
const supabase = require('../utils/db');
const authMiddleware = require('../middleware/auth');
const {
    normalizeDeckResponse,
    prepareStudySetForSave
} = require('../utils/studyContracts');
const { logger } = require('../utils/logger');

const router = express.Router();

router.use(authMiddleware);

const isMissingQuizPersistenceError = (error) => {
    const details = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`.toLowerCase();
    return (
        error?.code === '42P01'
        || details.includes('quiz_questions')
        || details.includes('question_count')
    );
};

const createAuthedSupabaseClient = (token) => createClient(
    serverConfig.supabase.url,
    serverConfig.supabase.serviceRoleKey,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
);

const insertDeckRecord = async (userSupabase, deckPayload) => {
    let warning = null;
    let response = await userSupabase
        .from('decks')
        .insert(deckPayload)
        .select()
        .single();

    if (response.error && isMissingQuizPersistenceError(response.error)) {
        warning = 'Quiz persistence migration is not fully applied yet. Quiz counts may not appear in history until you run the latest SQL.';
        const fallbackPayload = { ...deckPayload };
        delete fallbackPayload.question_count;

        response = await userSupabase
            .from('decks')
            .insert(fallbackPayload)
            .select()
            .single();
    }

    return {
        deck: response.data,
        error: response.error,
        warning
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

    if (error && isMissingQuizPersistenceError(error)) {
        logger.warn('Quiz persistence schema not available while loading deck', {
            deckId,
            reason: error.message
        });
        return [];
    }

    if (error) throw error;
    return data || [];
};

router.post('/save', async (req, res) => {
    let userSupabase;
    let createdDeckId = null;

    try {
        const { title, originalText, flashcards = [], quiz = [] } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        const preparedStudySet = prepareStudySetForSave({ flashcards, quiz });
        userSupabase = createAuthedSupabaseClient(token);

        const { deck, error: deckError, warning } = await insertDeckRecord(userSupabase, {
                user_id: req.user.id,
                title: typeof title === 'string' && title.trim() ? title.trim() : 'Untitled Study Set',
                description: typeof originalText === 'string' && originalText.trim()
                    ? `${originalText.trim().substring(0, 100)}...`
                    : '',
                card_count: preparedStudySet.flashcards.length,
                question_count: preparedStudySet.quiz.length
            });

        if (deckError) throw deckError;
        createdDeckId = deck.id;

        const cardsToInsert = preparedStudySet.flashcards.map((card) => ({
            deck_id: deck.id,
            front: card.front,
            back: card.back,
            explanation: card.explanation
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

            if (quizError) {
                if (isMissingQuizPersistenceError(quizError)) {
                    throw new Error(
                        'Quiz persistence schema is missing. Run the latest SQL migration before saving quizzes.'
                    );
                }
                throw quizError;
            }
        }

        res.json({
            success: true,
            deckId: deck.id,
            message: 'Saved to Cloud!',
            warnings: warning ? [warning] : []
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
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
