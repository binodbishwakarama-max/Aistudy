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
    // Only temporarily backoff for quota exhaustion or bad keys
    return (
        message.includes('429')
        || message.includes('quota')
        || message.includes('api key')
    );
};

const recordFailure = (provider, error) => {
    const message = getErrorMessage(error);
    providerState[provider].lastError = message;

    if (shouldDisableProvider(error)) {
        providerState[provider].available = false;
        logger.warn(`${provider} backed off after error. Will attempt auto-recovery in 15 seconds.`, { reason: message });
        
        // Fast auto-recovery (15 seconds)
        setTimeout(() => {
            if (providerState[provider].configured) {
                providerState[provider].available = true;
                logger.info(`Auto-recovery: ${provider} re-enabled.`);
            }
        }, 15 * 1000);
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

const withTimeout = (promise, ms = 25000, label = 'AI Operation') => {
    let timer;
    const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => {
            reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`));
        }, ms);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => {
        if (timer) clearTimeout(timer);
    });
};

const GEMINI_FALLBACK_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-1.5-pro'];
const GROQ_FALLBACK_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768'];

const tryGeminiText = async ({ prompt, systemInstruction }) => {
    const configuredModel = serverConfig.ai.geminiModel === 'gemini-1.5-flash-8b' ? 'gemini-2.0-flash' : serverConfig.ai.geminiModel;
    const modelsToTry = Array.from(new Set([configuredModel, ...GEMINI_FALLBACK_MODELS]));
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            const model = geminiClient.getGenerativeModel({
                model: modelName,
                systemInstruction
            });

            return await withTimeout(
                model.generateContent(prompt).then(async (result) => {
                    const response = await result.response;
                    return response.text();
                }),
                25000,
                `Gemini (${modelName}) text generation`
            );
        } catch (err) {
            lastError = err;
            logger.warn(`Gemini model ${modelName} failed (${err.message}), trying backup model...`);
        }
    }

    throw lastError || new Error('All Gemini models failed.');
};

const tryGroqText = async ({ prompt, systemInstruction }) => {
    const modelsToTry = Array.from(new Set([serverConfig.ai.groqModel, ...GROQ_FALLBACK_MODELS]));
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            return await withTimeout(
                groqClient.chat.completions.create({
                    messages: [
                        { role: 'system', content: systemInstruction },
                        { role: 'user', content: prompt }
                    ],
                    model: modelName,
                    temperature: 0.4,
                    max_tokens: 4096
                }).then((completion) => completion.choices[0]?.message?.content || ''),
                25000,
                `Groq (${modelName}) text generation`
            );
        } catch (err) {
            lastError = err;
            logger.warn(`Groq model ${modelName} failed (${err.message}), trying backup model...`);
        }
    }

    throw lastError || new Error('All Groq models failed.');
};

const tryGeminiChat = async ({ message, history, systemInstruction }) => {
    const configuredModel = serverConfig.ai.geminiModel === 'gemini-1.5-flash-8b' ? 'gemini-2.0-flash' : serverConfig.ai.geminiModel;
    const modelsToTry = Array.from(new Set([configuredModel, ...GEMINI_FALLBACK_MODELS]));
    const sanitizedHistory = sanitizeHistory(history, message);
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            const model = geminiClient.getGenerativeModel({
                model: modelName,
                systemInstruction
            });

            const chat = model.startChat({
                history: sanitizedHistory.map((entry) => ({
                    role: entry.role === 'user' ? 'user' : 'model',
                    parts: [{ text: entry.content }]
                }))
            });

            return await withTimeout(
                chat.sendMessage(message).then(async (result) => {
                    const response = await result.response;
                    return response.text();
                }),
                25000,
                `Gemini (${modelName}) chat reply`
            );
        } catch (err) {
            lastError = err;
            logger.warn(`Gemini model ${modelName} chat failed (${err.message}), trying backup model...`);
        }
    }

    throw lastError || new Error('All Gemini models failed.');
};

const tryGroqChat = async ({ message, history, systemInstruction }) => {
    const modelsToTry = Array.from(new Set([serverConfig.ai.groqModel, ...GROQ_FALLBACK_MODELS]));
    const sanitizedHistory = sanitizeHistory(history, message);
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            return await withTimeout(
                groqClient.chat.completions.create({
                    messages: [
                        { role: 'system', content: systemInstruction },
                        ...sanitizedHistory.map((entry) => ({
                            role: entry.role,
                            content: entry.content
                        })),
                        { role: 'user', content: message }
                    ],
                    model: modelName,
                    temperature: 0.4,
                    max_tokens: 2048
                }).then((completion) => completion.choices[0]?.message?.content || ''),
                25000,
                `Groq (${modelName}) chat reply`
            );
        } catch (err) {
            lastError = err;
            logger.warn(`Groq model ${modelName} chat failed (${err.message}), trying backup model...`);
        }
    }

    throw lastError || new Error('All Groq models failed.');
};

const buildProviderFailure = (failures) => {
    if (failures.length === 0) {
        return new Error('No AI providers are configured.');
    }

    return new Error(`All AI providers failed. ${failures.join(' | ')}`);
};

const generateText = async ({ prompt, systemInstruction }) => {
    const failures = [];

    if (geminiClient && (providerState.gemini.available || !groqClient)) {
        try {
            const text = await tryGeminiText({ prompt, systemInstruction });
            providerState.gemini.available = true;
            providerState.gemini.lastError = null;
            return { text, provider: 'Gemini' };
        } catch (error) {
            recordFailure('gemini', error);
            failures.push(`Gemini: ${getErrorMessage(error)}`);
        }
    }

    if (groqClient && (providerState.groq.available || !geminiClient)) {
        try {
            const text = await tryGroqText({ prompt, systemInstruction });
            providerState.groq.available = true;
            providerState.groq.lastError = null;
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

    if (geminiClient && (providerState.gemini.available || !groqClient)) {
        try {
            const text = await tryGeminiChat({ message, history, systemInstruction });
            providerState.gemini.available = true;
            providerState.gemini.lastError = null;
            return { text, provider: 'Gemini' };
        } catch (error) {
            recordFailure('gemini', error);
            failures.push(`Gemini: ${getErrorMessage(error)}`);
        }
    }

    if (groqClient && (providerState.groq.available || !geminiClient)) {
        try {
            const text = await tryGroqChat({ message, history, systemInstruction });
            providerState.groq.available = true;
            providerState.groq.lastError = null;
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
        const result = await withTimeout(
            model.embedContent(text),
            15000,
            'Gemini embedding'
        );
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
