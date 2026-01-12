const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

router.post('/save', auth, async (req, res) => {
    try {
        const { title, originalText, flashcards, quiz } = req.body;
        const studySet = await db.studySets.insert({
            userId: req.user.id,
            title: title || 'Untitled Session',
            originalText,
            flashcards,
            quiz
        });
        res.json(studySet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/history', auth, async (req, res) => {
    try {
        const history = await db.studySets.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
