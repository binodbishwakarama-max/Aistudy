const express = require('express');
const supabase = require('../utils/db');
const authMiddleware = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

router.use(authMiddleware);

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const buildWeeklyActivity = (sessions) => {
    const today = new Date();
    const buckets = [];

    for (let offset = 6; offset >= 0; offset -= 1) {
        const date = new Date(today);
        date.setDate(today.getDate() - offset);
        const key = date.toISOString().split('T')[0];
        buckets.push({
            day: DAY_LABELS[date.getDay()],
            key,
            cards: 0,
            quizzes: 0,
        });
    }

    sessions.forEach((session) => {
        const key = new Date(session.started_at).toISOString().split('T')[0];
        const bucket = buckets.find((item) => item.key === key);
        if (!bucket) return;

        if (session.mode === 'quiz' || session.mode === 'adaptive') {
            bucket.quizzes += session.cards_reviewed || session.correct_count || 1;
        } else {
            bucket.cards += session.cards_reviewed || 1;
        }
    });

    return buckets.map(({ day, cards, quizzes }) => ({ day, cards, quizzes }));
};

const buildHeatmap = (sessions) => {
    const counts = {};
    sessions.forEach((session) => {
        const key = new Date(session.started_at).toISOString().split('T')[0];
        counts[key] = (counts[key] || 0) + 1;
    });

    const data = [];
    const today = new Date();
    for (let index = 83; index >= 0; index -= 1) {
        const date = new Date(today);
        date.setDate(today.getDate() - index);
        const key = date.toISOString().split('T')[0];
        data.push({ key, count: counts[key] || 0 });
    }

    return data;
};

router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', req.user.id)
            .single();

        if (error && error.code === 'PGRST116') {
            return res.json({
                xp: 0,
                level: 1,
                streak: 0,
                lastStudyDate: null,
                achievements: []
            });
        }

        if (error) throw error;

        res.json({
            xp: data.xp ?? 0,
            level: data.level ?? 1,
            streak: data.streak ?? 0,
            lastStudyDate: data.last_active || null,
            achievements: data.achievements || []
        });
    } catch (error) {
        logger.error('Fetch stats failed', { reason: error.message });
        res.status(500).json({ error: error.message });
    }
});

router.get('/analytics', async (req, res) => {
    try {
        let deckIds = [];
        try {
            const { data: decks, error: decksError } = await supabase
                .from('decks')
                .select('id')
                .eq('user_id', req.user.id);

            if (!decksError && decks) {
                deckIds = decks.map((deck) => deck.id);
            }
        } catch (err) {
            logger.warn('Query decks failed during analytics fetch', { reason: err.message });
        }

        let cards = [];
        if (deckIds.length > 0) {
            try {
                const { data: cardRows, error: cardsError } = await supabase
                    .from('flashcards')
                    .select('id, deck_id, srs_interval, srs_repetitions, next_review_at')
                    .in('deck_id', deckIds);

                if (!cardsError && cardRows) {
                    cards = cardRows;
                }
            } catch (err) {
                logger.warn('Query flashcards failed during analytics fetch', { reason: err.message });
            }
        }

        const now = new Date();
        const reviewedCards = cards.filter((card) => (card.srs_repetitions || 0) > 0);
        const dueCards = cards.filter((card) => !card.next_review_at || new Date(card.next_review_at) <= now);
        const easy = cards.filter((card) => (card.srs_interval || 0) > 7).length;
        const medium = cards.filter((card) => (card.srs_interval || 0) > 1 && (card.srs_interval || 0) <= 7).length;
        const hard = cards.filter((card) => (card.srs_interval || 0) === 1 && (card.srs_repetitions || 0) > 0).length;

        const since = new Date();
        since.setDate(since.getDate() - 84);

        let sessionRows = [];
        try {
            const { data: sessions, error: sessionsError } = await supabase
                .from('study_sessions')
                .select('*')
                .eq('user_id', req.user.id)
                .gte('started_at', since.toISOString())
                .order('started_at', { ascending: false });

            if (!sessionsError && sessions) {
                sessionRows = sessions;
            }
        } catch (err) {
            logger.warn('Query study_sessions failed during analytics fetch', { reason: err.message });
        }

        const quizSessions = sessionRows.filter((session) => session.mode === 'quiz' || session.mode === 'adaptive');
        const totalQuestions = quizSessions.reduce((sum, session) => sum + (session.cards_reviewed || 0), 0);
        const correctAnswers = quizSessions.reduce((sum, session) => sum + (session.correct_count || 0), 0);
        const totalTimeSpent = sessionRows.reduce((sum, session) => sum + (session.duration_seconds || 0), 0);

        res.json({
            cardsReviewed: reviewedCards.length,
            dueCount: dueCards.length,
            totalQuestions,
            correctAnswers,
            totalTimeSpent,
            difficulty: { easy, medium, hard },
            weeklyActivity: buildWeeklyActivity(sessionRows),
            heatmap: buildHeatmap(sessionRows),
            hasSessionData: sessionRows.length > 0,
        });
    } catch (error) {
        logger.error('Fetch analytics failed', { reason: error.message });
        res.status(500).json({ error: error.message });
    }
});

router.patch('/', async (req, res) => {
    try {
        const { xp, level, streak, lastStudyDate, achievements } = req.body;

        const payload = {
            user_id: req.user.id,
            xp: typeof xp === 'number' ? xp : 0,
            level: typeof level === 'number' ? level : 1,
            streak: typeof streak === 'number' ? streak : 0,
            last_active: lastStudyDate || null,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('user_stats')
            .upsert(payload, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            stats: {
                xp: data.xp,
                level: data.level,
                streak: data.streak,
                lastStudyDate: data.last_active,
                achievements: data.achievements || []
            }
        });
    } catch (error) {
        logger.error('Update stats failed', { reason: error.message });
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
