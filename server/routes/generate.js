const express = require('express');
const { generateText } = require('../services/aiService');
const { parseStructuredGeneration } = require('../utils/aiPayloads');
const authMiddleware = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
    try {
        const {
            prompt,
            system = 'You are a helpful study assistant.',
            contentType = 'text'
        } = req.body;

        if (typeof prompt !== 'string' || !prompt.trim()) {
            return res.status(400).json({ error: 'Prompt is required.' });
        }

        const generation = await generateText({
            prompt: prompt.trim(),
            systemInstruction: system
        });

        const data = parseStructuredGeneration({
            rawText: generation.text,
            contentType
        });

        res.json({
            content: [{ text: generation.text }],
            provider: generation.provider,
            contentType,
            data
        });
    } catch (error) {
        logger.error('Generation route failed', { reason: error.message });
        res.status(500).json({ error: error.message || 'Failed to generate content.' });
    }
});

module.exports = router;
