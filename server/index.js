const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { serverConfig } = require('./config');
const { logger } = require('./utils/logger');
const { getAIStatus, probePrimaryProvider } = require('./services/aiService');
const { initializeWorker } = require('./queue/worker');

const app = express();

app.set('trust proxy', 1);

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
    // Keep the API usable for the current deployment while allowing a
    // comma-separated allow-list in production via CLIENT_ORIGINS.
    origin: (origin, callback) => {
        const configuredOrigins = (process.env.CLIENT_ORIGINS || '')
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean);

        if (!origin || configuredOrigins.length === 0 || configuredOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Origin is not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(globalLimiter);
app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/generate', aiLimiter, require('./routes/generate'));
app.use('/api/study', require('./routes/study'));
app.use('/api/chat', aiLimiter, require('./routes/chat'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/search', aiLimiter, require('./routes/search'));
app.use('/api/adaptive', aiLimiter, require('./routes/adaptive'));

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

const startServer = () => {
    initializeWorker();
    return app.listen(serverConfig.port, () => {
        logger.info(`Server running on http://localhost:${serverConfig.port}`);
        probePrimaryProvider().catch((error) => {
            logger.warn('AI provider probe failed during startup', { reason: error.message });
        });
    });
};

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };
