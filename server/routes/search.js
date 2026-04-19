const express = require('express');
const supabase = require('../utils/db');
const authMiddleware = require('../middleware/auth');
const { embedText } = require('../services/aiService');
const { logger } = require('../utils/logger');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const query = req.query.q;
        
        if (!query || typeof query !== 'string' || !query.trim()) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // 1. Generate semantic embedding for the user's search query
        let queryEmbedding;
        try {
            queryEmbedding = await embedText(query.trim());
        } catch (error) {
            // If the AI provider is down, we can't perform semantic search
            return res.status(503).json({ error: 'Semantic search is currently unavailable.' });
        }

        // 2. Invoke the Supabase pgvector RPC function
        // Convert the raw array of floats to the Postgres vector string format
        const vectorString = `[${queryEmbedding.join(',')}]`;

        const { data, error } = await supabase.rpc('match_flashcards', {
            query_embedding: vectorString,
            match_threshold: 0.5, // Return cards with >50% similarity
            match_count: 10,       // Let's cap at top 10 most relevant
            query_user_id: req.user.id
        });

        if (error) {
            logger.error('Postgres RPC match_flashcards failed', { reason: error.message, code: error.code });
            throw error;
        }

        // 3. Return results
        res.json({
            results: data || [],
            query: query.trim()
        });

    } catch (error) {
        logger.error('Search endpoint failed', { reason: error.message });
        res.status(500).json({ error: 'Failed to perform semantic search' });
    }
});

module.exports = router;
