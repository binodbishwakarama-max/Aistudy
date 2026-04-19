const { Worker } = require('bullmq');
const { connection } = require('../utils/redis');
const { QUEUE_NAME } = require('./jobs');
const { generateText } = require('../services/aiService');
const { parseStructuredGeneration } = require('../utils/aiPayloads');
const { logger } = require('../utils/logger');

let worker;

const initializeWorker = () => {
    if (!connection) {
        logger.warn('Skipping worker initialization: No Redis connection.');
        return;
    }

    worker = new Worker(QUEUE_NAME, async (job) => {
        const { prompt, system, contentType, userId } = job.data;
        logger.info(`[Worker] Started job ${job.id} for user ${userId}`);

        // Update progress metadata
        await job.updateProgress(10); // 10%: Job started

        try {
            await job.updateProgress(30); // 30%: Calling LLM
            
            const generation = await generateText({
                prompt: prompt.trim(),
                systemInstruction: system
            });

            await job.updateProgress(70); // 70%: LLM finished, parsing output

            const data = parseStructuredGeneration({
                rawText: generation.text,
                contentType
            });

            await job.updateProgress(100); // 100%: Finished

            logger.info(`[Worker] Completed job ${job.id} using provider: ${generation.provider}`);

            // Return the necessary payload to be retrieved by the client
            return {
                content: [{ text: generation.text }],
                provider: generation.provider,
                contentType,
                data
            };
        } catch (error) {
            logger.error(`[Worker] Job ${job.id} failed`, { error: error.message });
            throw error; // Let BullMQ handle retries
        }
    }, { 
        connection,
        concurrency: 5 // Process up to 5 AI requests simultaneously across this node
    });

    worker.on('failed', (job, err) => {
        logger.error(`Job [${job?.id}] failed after attempts. Error: ${err.message}`);
    });

    logger.info('BullMQ Background Worker is running.');
};

module.exports = { initializeWorker };
