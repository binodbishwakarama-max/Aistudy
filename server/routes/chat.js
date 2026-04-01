const express = require('express');
const { generateChatReply } = require('../services/aiService');
const { logger } = require('../utils/logger');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { message, context, history } = req.body;

        if (typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ error: 'Message is required.' });
        }

        const systemPrompt = `You are a helpful and encouraging AI Study Tutor called "MindFlow AI".

CONTEXT:
The user is studying the following text:
"""${typeof context === 'string' && context.trim()
            ? context.substring(0, 5000)
            : 'No specific context provided.'}"""

INSTRUCTIONS:
- Answer the user's question based on the context provided above.
- If the answer is not in the context, use your general knowledge but mention that it's outside the provided notes.
- Be concise, friendly, and use emojis occasionally.
- If the user asks for a quiz or flashcard, politely direct them to use the "Generate" buttons instead.
`;

        const reply = await generateChatReply({
            message: message.trim(),
            history,
            systemInstruction: systemPrompt
        });

        res.json({
            role: 'assistant',
            content: reply.text,
            provider: reply.provider
        });
    } catch (error) {
        logger.error('Chat route failed', { reason: error.message });
        res.status(500).json({ error: 'Failed to generate response.' });
    }
});

module.exports = router;
