const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { serverConfig } = require('./config');
const { logger } = require('./utils/logger');
const { getAIStatus, probePrimaryProvider } = require('./services/aiService');
const { initializeWorker } = require('./queue/worker');

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

// --- Rate Limiters ---
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests from this IP. Please try again after 15 minutes.' }
});

const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'AI request limit reached. Please wait 15 minutes before generating more content.' }
});

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(globalLimiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/generate', aiLimiter, require('./routes/generate'));
app.use('/api/study', require('./routes/study'));
app.use('/api/chat', aiLimiter, require('./routes/chat'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/jobs', require('./routes/jobs'));

app.get('/api/health', (_req, res) => {
    res.json({
        ok: true,
        ai: getAIStatus()
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
