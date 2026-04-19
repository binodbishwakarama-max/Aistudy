const { Queue } = require('bullmq');
const { connection } = require('../utils/redis');
const { logger } = require('../utils/logger');

const QUEUE_NAME = 'ai-generation';

let generationQueue;

if (connection) {
    generationQueue = new Queue(QUEUE_NAME, {
        connection,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000
            },
            removeOnComplete: {
                age: 300,   // Keep completed jobs for 5 minutes so the client can poll for the result
                count: 200  // Also cap at 200 completed jobs max to prevent unbounded memory growth
            },
            removeOnFail: false
        }
    });

    logger.info(`BullMQ Queue [${QUEUE_NAME}] initialized.`);
}

/**
 * Adds a document generation job to the queue.
 */
const addGenerationJob = async (userId, prompt, system, contentType) => {
    if (!generationQueue) {
        throw new Error('Redis is not configured. Queue is unavailable.');
    }

    const job = await generationQueue.add('generate-content', {
        userId,
        prompt,
        system,
        contentType
    });

    return job.id;
};

module.exports = {
    QUEUE_NAME,
    generationQueue,
    addGenerationJob
};
