const express = require('express');
const supabase = require('../utils/db');
const authMiddleware = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

router.use(authMiddleware);

// GET /api/stats — Fetch the current user's gamification stats
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', req.user.id)
            .single();

        if (error && error.code === 'PGRST116') {
            // No row found — return defaults (row will be created on first PATCH)
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

// PATCH /api/stats — Upsert the current user's gamification stats
router.patch('/', async (req, res) => {
    try {
        const { xp, level, streak, lastStudyDate, achievements } = req.body;

        const isNonNegativeInteger = (value) => Number.isInteger(value) && value >= 0;
        if (
            !isNonNegativeInteger(xp)
            || !isNonNegativeInteger(level)
            || !isNonNegativeInteger(streak)
            || (achievements !== undefined && (
                !Array.isArray(achievements)
                || achievements.length > 100
                || achievements.some((achievement) => typeof achievement !== 'string' || achievement.length > 100)
            ))
        ) {
            return res.status(400).json({ error: 'Invalid stats payload.' });
        }

        if (lastStudyDate !== null && lastStudyDate !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(lastStudyDate)) {
            return res.status(400).json({ error: 'lastStudyDate must use YYYY-MM-DD format.' });
        }

        const payload = {
            user_id: req.user.id,
            xp,
            level,
            streak,
            last_active: lastStudyDate || null,
            updated_at: new Date().toISOString()
        };

        if (achievements !== undefined) payload.achievements = achievements;

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
        res.status(500).json({ error: 'Failed to update stats.' });
    }
});

module.exports = router;
