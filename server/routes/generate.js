const express = require('express');
const { addGenerationJob, generationQueue } = require('../queue/jobs');
const { generateText } = require('../services/aiService'); // Keep for sync fallback
const { parseStructuredGeneration } = require('../utils/aiPayloads'); // Keep for sync fallback
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

        // If Redis isn't configured, fallback gracefully to the original synchronous logic
        if (!generationQueue) {
            logger.warn('Synchronous fallback used for generation (No Redis configured)');
            const generation = await generateText({
                prompt: prompt.trim(),
                systemInstruction: system
            });

            const data = parseStructuredGeneration({
                rawText: generation.text,
                contentType
            });

            return res.json({
                content: [{ text: generation.text }],
                provider: generation.provider,
                contentType,
                data
            });
        }

        // --- ASYNC QUEUE STRATEGY ---
        // We know the user id since authMiddleware sets req.user
        const userId = req.user.id;

        const jobId = await addGenerationJob(
            userId,
            prompt.trim(),
            system,
            contentType
        );

        // Standard HTTP 202 indicating the request has been accepted for processing
        res.status(202).json({
            jobId,
            status: 'queued',
            message: 'Content generation job has been enqueued.'
        });

    } catch (error) {
        logger.error('Generation route failed', { reason: error.message });
        res.status(500).json({ error: error.message || 'Failed to enqueue content generation.' });
    }
});

module.exports = router;
