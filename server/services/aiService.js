const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
const { serverConfig } = require('../config');
const { logger } = require('../utils/logger');

const geminiClient = serverConfig.ai.geminiApiKey
    ? new GoogleGenerativeAI(serverConfig.ai.geminiApiKey)
    : null;
const groqClient = serverConfig.ai.groqApiKey
    ? new Groq({ apiKey: serverConfig.ai.groqApiKey })
    : null;

const providerState = {
    gemini: {
        configured: Boolean(geminiClient),
        available: Boolean(geminiClient),
        lastError: null
    },
    groq: {
        configured: Boolean(groqClient),
        available: Boolean(groqClient),
        lastError: null
    }
};

const getErrorMessage = (error) => error?.message || 'Unknown AI provider error.';

const shouldDisableProvider = (error) => {
    const message = getErrorMessage(error).toLowerCase();
    return (
        message.includes('429')
        || message.includes('quota')
        || message.includes('not found')
        || message.includes('invalid')
        || message.includes('permission')
        || message.includes('unsupported')
        || message.includes('api key')
    );
};

const recordFailure = (provider, error) => {
    const message = getErrorMessage(error);
    providerState[provider].lastError = message;

    if (shouldDisableProvider(error)) {
        providerState[provider].available = false;
        logger.warn(`${provider} disabled after provider error`, { reason: message });
    }
};

const sanitizeHistory = (history, latestUserMessage) => {
    if (!Array.isArray(history)) return [];

    const sanitized = history
        .filter((entry) => (
            entry
            && typeof entry.content === 'string'
            && entry.content.trim()
            && (entry.role === 'user' || entry.role === 'assistant')
        ))
        .slice(-10)
        .map((entry) => ({
            role: entry.role,
            content: entry.content.trim()
        }));

    const normalizedLatestMessage = typeof latestUserMessage === 'string'
        ? latestUserMessage.trim()
        : '';

    if (normalizedLatestMessage) {
        const lastEntry = sanitized[sanitized.length - 1];
        if (lastEntry?.role === 'user' && lastEntry.content === normalizedLatestMessage) {
            sanitized.pop();
        }
    }

    return sanitized;
};

const tryGeminiText = async ({ prompt, systemInstruction }) => {
    const model = geminiClient.getGenerativeModel({
        model: serverConfig.ai.geminiModel,
        systemInstruction
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};

const tryGroqText = async ({ prompt, systemInstruction }) => {
    const completion = await groqClient.chat.completions.create({
        messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt }
        ],
        model: serverConfig.ai.groqModel,
        temperature: 0.4,
        max_tokens: 4096
    });

    return completion.choices[0]?.message?.content || '';
};

const tryGeminiChat = async ({ message, history, systemInstruction }) => {
    const model = geminiClient.getGenerativeModel({
        model: serverConfig.ai.geminiModel,
        systemInstruction
    });

    const sanitizedHistory = sanitizeHistory(history, message);
    const chat = model.startChat({
        history: sanitizedHistory.map((entry) => ({
            role: entry.role === 'user' ? 'user' : 'model',
            parts: [{ text: entry.content }]
        }))
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
};

const tryGroqChat = async ({ message, history, systemInstruction }) => {
    const sanitizedHistory = sanitizeHistory(history, message);
    const completion = await groqClient.chat.completions.create({
        messages: [
            { role: 'system', content: systemInstruction },
            ...sanitizedHistory.map((entry) => ({
                role: entry.role,
                content: entry.content
            })),
            { role: 'user', content: message }
        ],
        model: serverConfig.ai.groqModel,
        temperature: 0.4,
        max_tokens: 2048
    });

    return completion.choices[0]?.message?.content || '';
};

const buildProviderFailure = (failures) => {
    if (failures.length === 0) {
        return new Error('No AI providers are configured.');
    }

    return new Error(`All AI providers failed. ${failures.join(' | ')}`);
};

const generateText = async ({ prompt, systemInstruction }) => {
    const failures = [];

    if (providerState.gemini.available && geminiClient) {
        try {
            const text = await tryGeminiText({ prompt, systemInstruction });
            return { text, provider: 'Gemini' };
        } catch (error) {
            recordFailure('gemini', error);
            failures.push(`Gemini: ${getErrorMessage(error)}`);
        }
    }

    if (providerState.groq.available && groqClient) {
        try {
            const text = await tryGroqText({ prompt, systemInstruction });
            return { text, provider: 'Groq' };
        } catch (error) {
            recordFailure('groq', error);
            failures.push(`Groq: ${getErrorMessage(error)}`);
        }
    }

    throw buildProviderFailure(failures);
};

const generateChatReply = async ({ message, history, systemInstruction }) => {
    const failures = [];

    if (providerState.gemini.available && geminiClient) {
        try {
            const text = await tryGeminiChat({ message, history, systemInstruction });
            return { text, provider: 'Gemini' };
        } catch (error) {
            recordFailure('gemini', error);
            failures.push(`Gemini: ${getErrorMessage(error)}`);
        }
    }

    if (providerState.groq.available && groqClient) {
        try {
            const text = await tryGroqChat({ message, history, systemInstruction });
            return { text, provider: 'Groq' };
        } catch (error) {
            recordFailure('groq', error);
            failures.push(`Groq: ${getErrorMessage(error)}`);
        }
    }

    throw buildProviderFailure(failures);
};

const probePrimaryProvider = async () => {
    if (!geminiClient) {
        logger.warn('Gemini is not configured. Groq will be used when available.');
        return;
    }

    try {
        await tryGeminiText({
            prompt: 'Reply with OK.',
            systemInstruction: 'You are a health check.'
        });

        providerState.gemini.available = true;
        providerState.gemini.lastError = null;
        logger.info('Gemini probe succeeded.');
    } catch (error) {
        recordFailure('gemini', error);
        logger.warn('Gemini probe failed. Requests will fall back to Groq when possible.', {
            reason: getErrorMessage(error)
        });
    }
};

const getAIStatus = () => ({
    gemini: { ...providerState.gemini },
    groq: { ...providerState.groq }
});

const embedText = async (text) => {
    if (!geminiClient) {
        throw new Error('Gemini client not configured. Cannot generate embeddings.');
    }
    try {
        const model = geminiClient.getGenerativeModel({ model: 'text-embedding-004' });
        const result = await model.embedContent(text);
        return result.embedding.values; // Returns an array of 768 floats
    } catch (error) {
        logger.error('Failed to generate embedding', { reason: getErrorMessage(error) });
        throw error;
    }
};

module.exports = {
    generateChatReply,
    generateText,
    getAIStatus,
    probePrimaryProvider,
    sanitizeHistory,
    embedText
};
