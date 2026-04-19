const Redis = require('ioredis');
const { logger } = require('./logger');

const redisUrl = process.env.REDIS_URL;

let connection;

if (!redisUrl) {
    logger.warn('REDIS_URL is not defined in .env! Background workers will fail to start.');
} else {
    connection = new Redis(redisUrl, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        retryStrategy: (times) => {
            if (times > 5) {
                logger.error('Redis connection failed permanently. Entering sync fallback mode.');
                return null; // Stop retrying
            }
            return Math.min(times * 1000, 5000); // Backoff up to 5s
        }
    });

    connection.on('error', (err) => {
        logger.error('Redis Connection Error:', { error: err.message });
    });

    connection.on('ready', () => {
        logger.info('Connected to Redis successfully.');
    });

    // If Redis gives up connecting, nullify the connection object
    // so the rest of the app gracefully falls back to sync execution
    connection.on('end', () => {
        logger.warn('Redis connection ended. BullMQ jobs will fail until it recovers.');
    });
}

module.exports = { connection };
