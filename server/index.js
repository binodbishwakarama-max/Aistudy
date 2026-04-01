const express = require('express');
const cors = require('cors');
const { serverConfig } = require('./config');
const { logger } = require('./utils/logger');
const { getAIStatus, probePrimaryProvider } = require('./services/aiService');

const app = express();

process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { reason: error.message });
});

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', {
        reason: reason instanceof Error ? reason.message : String(reason)
    });
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/generate', require('./routes/generate'));
app.use('/api/study', require('./routes/study'));
app.use('/api/chat', require('./routes/chat'));

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
