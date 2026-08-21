const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { serverConfig } = require('./config');
const { logger } = require('./utils/logger');
const { getAIStatus, probePrimaryProvider } = require('./services/aiService');
const { initializeWorker } = require('./queue/worker');
const { isRedisAvailable } = require('./utils/redis');
const { globalLimiter, aiLimiter } = require('./middleware/rateLimiter');
const app = express();

// Start Background Worker
initializeWorker();

process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { reason: error.message });
});

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', {
        reason: reason instanceof Error ? reason.message : String(reason)
    });
});

app.set('trust proxy', 1);
app.use(helmet());

const ALLOWED_ORIGINS = [
    'https://www.mindflowlearn.co.in',
    'https://mindflowlearn.co.in',
];

// Allow localhost in development
if (process.env.NODE_ENV !== 'production') {
    ALLOWED_ORIGINS.push('http://localhost:5173', 'http://localhost:3000');
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(globalLimiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/generate', aiLimiter, require('./routes/generate'));
app.use('/api/study', require('./routes/study'));
app.use('/api/chat', aiLimiter, require('./routes/chat'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/search', aiLimiter, require('./routes/search'));
app.use('/api/adaptive', aiLimiter, require('./routes/adaptive'));

app.get('/api/health', (_req, res) => {
    const redisConfigured = Boolean(process.env.REDIS_URL?.trim());

    res.json({
        ok: true,
        ai: getAIStatus(),
        redis: !redisConfigured
            ? 'disabled'
            : isRedisAvailable()
                ? 'connected'
                : 'unavailable',
    });
});

app.use((error, _req, res, _next) => {
    logger.error('Unhandled express error', { reason: error.message });
    res.status(500).json({ error: 'Internal server error.' });
});

app.listen(serverConfig.port, () => {
    logger.info(`Server running on http://localhost:${serverConfig.port}`);
    probePrimaryProvider().catch((error) => {
        logger.warn('AI provider probe failed during startup', { reason: error.message });
    });
});
