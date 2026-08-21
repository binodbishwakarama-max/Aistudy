const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Up to 1000 requests per 15 minutes per unique IP
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS' || req.path === '/api/health',
    message: { error: 'Too many requests from this IP. Please try again after 15 minutes.' }
});

const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 40, // Up to 40 AI requests per 15 minutes per unique IP
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
    message: { error: 'AI request limit reached. Please wait 15 minutes before generating more content.' }
});

module.exports = {
    globalLimiter,
    aiLimiter
};
