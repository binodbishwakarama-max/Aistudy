const { Worker } = require('bullmq');
const { getConnection, isRedisAvailable, onRedisReady } = require('../utils/redis');
const { QUEUE_NAME } = require('./jobs');
const { generateText } = require('../services/aiService');
const { parseStructuredGeneration } = require('../utils/aiPayloads');
const { logger } = require('../utils/logger');

let worker;

const startWorker = () => {
  const connection = getConnection();
  if (worker || !isRedisAvailable() || !connection) {
    return;
  }

  worker = new Worker(QUEUE_NAME, async (job) => {
    const { prompt, system, contentType, userId } = job.data;
    logger.info(`[Worker] Started job ${job.id} for user ${userId}`);

    await job.updateProgress(10);

    try {
      await job.updateProgress(30);

      const generation = await generateText({
        prompt: prompt.trim(),
        systemInstruction: system,
      });

      await job.updateProgress(70);

      const data = parseStructuredGeneration({
        rawText: generation.text,
        contentType,
      });

      await job.updateProgress(100);

      logger.info(`[Worker] Completed job ${job.id} using provider: ${generation.provider}`);

      return {
        content: [{ text: generation.text }],
        provider: generation.provider,
        contentType,
        data,
      };
    } catch (error) {
      logger.error(`[Worker] Job ${job.id} failed`, { error: error.message });
      throw error;
    }
  }, {
    connection,
    concurrency: 5,
  });

  worker.on('failed', (job, err) => {
    logger.error(`Job [${job?.id}] failed after attempts. Error: ${err.message}`);
  });

  logger.info('BullMQ background worker is running.');
};

const initializeWorker = () => {
  if (!getConnection()) {
    logger.warn('Skipping worker initialization: No Redis connection configured.');
    return;
  }

  onRedisReady(startWorker);
};

module.exports = { initializeWorker };
