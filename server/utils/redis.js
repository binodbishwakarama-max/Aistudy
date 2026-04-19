const Redis = require('ioredis');
const { logger } = require('./logger');

const redisUrl = process.env.REDIS_URL;

let connection;

if (!redisUrl) {
    logger.warn('REDIS_URL is not defined in .env! Background workers will fail to start.');
} else {
    // Upstash (and other cloud Redis providers) require maxRetriesPerRequest to be null for BullMQ compatibility
    connection = new Redis(redisUrl, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    });

    connection.on('error', (err) => {
        logger.error('Redis Connection Error:', { error: err.message });
    });

    connection.on('ready', () => {
        logger.info('Connected to Redis successfully.');
    });
}

module.exports = { connection };
