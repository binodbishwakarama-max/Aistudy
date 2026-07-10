const supabase = require('../utils/db');
const { logger } = require('../utils/logger');

/**
 * Middleware to verify Supabase JWT token
 * Validates the token and attaches the user to req.user
 */
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        // Verify the token using Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            logger.error('Auth token verification failed', { reason: error?.message });
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        logger.error('Auth middleware error', { reason: error.message });
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
};

module.exports = authMiddleware;

