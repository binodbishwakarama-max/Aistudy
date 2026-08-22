const Redis = require('ioredis');
const { logger } = require('./logger');

const redisUrl = process.env.REDIS_URL?.trim();

let connection = null;
let redisAvailable = false;

function isFatalRedisError(error) {
  const code = error?.code || '';
  const message = String(error?.message || '');

  return (
    code === 'ENOTFOUND' ||
    code === 'ECONNREFUSED' ||
    code === 'EAI_AGAIN' ||
    /getaddrinfo ENOTFOUND/i.test(message) ||
    /ECONNREFUSED/i.test(message)
  );
}

function disableRedis(reason, error) {
  if (!connection) {
    redisAvailable = false;
    return;
  }

  redisAvailable = false;
  const client = connection;
  connection = null;

  try {
    client.removeAllListeners();
    client.disconnect();
  } catch {
    // Ignore disconnect errors during teardown.
  }

  logger.warn('Redis disabled — falling back to synchronous AI processing.', {
    reason,
    error: error?.message,
  });
}

function isRedisAvailable() {
  return redisAvailable && connection !== null;
}

function onRedisReady(callback) {
  if (!connection) {
    return;
  }

  if (isRedisAvailable()) {
    callback();
    return;
  }

  connection.once('ready', () => {
    if (isRedisAvailable()) {
      callback();
    }
  });
}

function initRedis() {
  if (!redisUrl) {
    logger.warn('REDIS_URL is not set. Background queue disabled; using synchronous AI processing.');
    return;
  }

  try {
    connection = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      connectTimeout: 10_000,
      retryStrategy: (times) => {
        if (times > 3) {
          disableRedis('max connection retries exceeded');
          return null;
        }

        return Math.min(times * 500, 2000);
      },
    });

    connection.on('ready', () => {
      redisAvailable = true;
      logger.info('Connected to Redis successfully.');
    });

    connection.on('error', (error) => {
      logger.error('Redis connection error', { error: error.message });

      if (isFatalRedisError(error)) {
        disableRedis('fatal redis error', error);
      }
    });

    connection.on('end', () => {
      redisAvailable = false;
      logger.warn('Redis connection ended.');
    });
  } catch (error) {
    disableRedis('invalid REDIS_URL', error);
  }
}

initRedis();

function getConnection() {
  return connection;
}

module.exports = {
  getConnection,
  connection, // Keep for backwards compat with BullMQ constructors that read it once
  isRedisAvailable,
  isFatalRedisError,
  disableRedis,
  onRedisReady,
};
