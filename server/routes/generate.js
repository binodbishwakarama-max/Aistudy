const express = require('express');
const { addGenerationJob, getGenerationQueue } = require('../queue/jobs');
const { generateText } = require('../services/aiService');
const { parseStructuredGeneration } = require('../utils/aiPayloads');
const { isFatalRedisError } = require('../utils/redis');
const authMiddleware = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

router.use(authMiddleware);

async function runSyncGeneration({ prompt, system, contentType }) {
  const generation = await generateText({
    prompt: prompt.trim(),
    systemInstruction: system,
  });

  const data = parseStructuredGeneration({
    rawText: generation.text,
    contentType,
  });

  return {
    content: [{ text: generation.text }],
    provider: generation.provider,
    contentType,
    data,
  };
}

router.post('/', async (req, res) => {
  try {
    const {
      prompt,
      system = 'You are a helpful study assistant.',
      contentType = 'text',
    } = req.body;

    if (typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const queue = getGenerationQueue();

    if (!queue) {
      logger.warn('Synchronous fallback used for generation (Redis unavailable)');
      const payload = await runSyncGeneration({ prompt, system, contentType });
      return res.json(payload);
    }

    const userId = req.user.id;

    try {
      const jobId = await addGenerationJob(
        userId,
        prompt.trim(),
        system,
        contentType,
      );

      return res.status(202).json({
        jobId,
        status: 'queued',
        message: 'Content generation job has been enqueued.',
      });
    } catch (error) {
      if (isFatalRedisError(error) || /queue is unavailable/i.test(error.message)) {
        logger.warn('Queue failed during enqueue; using synchronous fallback', {
          reason: error.message,
        });
        const payload = await runSyncGeneration({ prompt, system, contentType });
        return res.json(payload);
      }

      throw error;
    }
  } catch (error) {
    logger.error('Generation route failed', { reason: error.message });
    const isAiBusy = /high demand|503|timeout|all ai providers failed|overloaded/i.test(error.message);
    const friendlyError = isAiBusy
      ? 'The AI study engine is currently busy. Please wait a moment and try again.'
      : (error.message && error.message.length < 80 && !error.message.includes('[') && !error.message.includes('{'))
        ? error.message
        : 'Failed to generate study materials. Please try again in a moment.';
    res.status(isAiBusy ? 503 : 500).json({ error: friendlyError });
  }
});

module.exports = router;
