const express = require('express');
const supabase = require('../utils/db');
const { generateChatReply, embedText } = require('../services/aiService');
const authMiddleware = require('../middleware/auth');
const { findRelevantChunks } = require('../utils/textChunks');
const { logger } = require('../utils/logger');

const router = express.Router();

router.use(authMiddleware);

const buildSources = (chunks = [], cards = []) => {
    const sources = [];

    chunks.forEach((chunk) => {
        sources.push({
            type: 'chunk',
            label: `Passage ${chunk.index + 1}`,
            excerpt: chunk.text.slice(0, 180),
        });
    });

    cards.forEach((card) => {
        if (card.source_excerpt || card.explanation) {
            sources.push({
                type: 'card',
                label: card.source_section || 'Related card',
                excerpt: card.source_excerpt || card.front,
            });
        }
    });

    return sources.slice(0, 5);
};

router.post('/', async (req, res) => {
    try {
        const { message, context, history, deckId } = req.body;

        if (typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ error: 'Message is required.' });
        }

        let sourceText = typeof context === 'string' ? context : '';
        const retrievedCards = [];
        const retrievedChunks = [];

        if (deckId) {
            const { data: deck, error: deckError } = await supabase
                .from('decks')
                .select('id, title, source_text, user_id')
                .eq('id', deckId)
                .single();

            if (!deckError && deck?.user_id === req.user.id) {
                if (deck.source_text) {
                    sourceText = deck.source_text;
                    retrievedChunks.push(...findRelevantChunks(deck.source_text, message.trim(), 3));
                }

                try {
                    const queryEmbedding = await embedText(message.trim());
                    const vectorString = `[${queryEmbedding.join(',')}]`;
                    const { data: matches } = await supabase.rpc('match_flashcards', {
                        query_embedding: vectorString,
                        match_threshold: 0.45,
                        match_count: 4,
                        query_user_id: req.user.id,
                    });

                    (matches || []).forEach((match) => {
                        if (match.deck_id === deckId) {
                            retrievedCards.push(match);
                        }
                    });
                } catch (searchError) {
                    logger.warn('Chat semantic retrieval failed, falling back to chunks only', {
                        reason: searchError.message,
                    });
                }
            }
        }

        const chunkContext = retrievedChunks
            .map((chunk, index) => `[Passage ${index + 1}] ${chunk.text}`)
            .join('\n\n');

        const cardContext = retrievedCards
            .map((card, index) => (
                `[Card ${index + 1}] Q: ${card.front}\nA: ${card.back}${card.explanation ? `\nNote: ${card.explanation}` : ''}${card.source_excerpt ? `\nSource: "${card.source_excerpt}"` : ''}`
            ))
            .join('\n\n');

        const fallbackContext = sourceText.trim()
            ? sourceText.substring(0, 5000)
            : 'No specific context provided.';

        const contextBlock = [chunkContext, cardContext, fallbackContext]
            .filter(Boolean)
            .join('\n\n---\n\n')
            .substring(0, 8000);

        const systemPrompt = `You are a helpful and encouraging AI Study Tutor called "MindFlow AI".

RETRIEVED CONTEXT (use this to answer — cite passages when possible):
"""${contextBlock}"""

INSTRUCTIONS:
- Answer based on the retrieved context above.
- When you use information from a passage or card, mention it briefly (e.g. "According to your notes…").
- If the answer is not in the context, say so clearly and offer general guidance.
- Be concise, friendly, and accurate.
- If the user asks for a quiz or flashcard, direct them to the Study tab.`;

        const reply = await generateChatReply({
            message: message.trim(),
            history,
            systemInstruction: systemPrompt
        });

        const sources = buildSources(
            retrievedChunks,
            retrievedCards.map((card) => ({
                front: card.front,
                source_excerpt: card.source_excerpt,
                source_section: card.source_section,
                explanation: card.explanation,
            }))
        );

        res.json({
            role: 'assistant',
            content: reply.text,
            provider: reply.provider,
            sources,
        });
    } catch (error) {
        logger.error('Chat route failed', { reason: error.message });
        res.status(500).json({ error: 'Failed to generate response.' });
    }
});

module.exports = router;
