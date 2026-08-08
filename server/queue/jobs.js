const { Queue } = require('bullmq');
const { connection, isRedisAvailable } = require('../utils/redis');
const { logger } = require('../utils/logger');

const QUEUE_NAME = 'ai-generation';

let generationQueue = null;

function getGenerationQueue() {
  if (!isRedisAvailable() || !connection) {
    return null;
  }

  if (!generationQueue) {
    generationQueue = new Queue(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: {
          age: 300,
          count: 200,
        },
        removeOnFail: false,
      },
    });

    logger.info(`BullMQ Queue [${QUEUE_NAME}] initialized.`);
  }

  return generationQueue;
}

function resetGenerationQueue() {
  generationQueue = null;
}

/**
 * Adds a document generation job to the queue.
 */
const addGenerationJob = async (userId, prompt, system, contentType) => {
  const queue = getGenerationQueue();

  if (!queue) {
    throw new Error('Redis is not configured. Queue is unavailable.');
  }

  const job = await queue.add('generate-content', {
    userId,
    prompt,
    system,
    contentType,
  });

  return job.id;
};

module.exports = {
  QUEUE_NAME,
  get generationQueue() {
    return getGenerationQueue();
  },
  getGenerationQueue,
  resetGenerationQueue,
  addGenerationJob,
};
