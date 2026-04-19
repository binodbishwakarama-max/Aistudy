const {
    validateFlashcards,
    validateQuizQuestions
} = require('./studyContracts');

const stripCodeFence = (text) => text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

const parseJsonCandidate = (candidate) => {
    if (!candidate) return null;

    try {
        return JSON.parse(candidate);
    } catch (error) {
        return null;
    }
};

/**
 * Unwrap common AI wrapper shapes into a plain array.
 * AI models frequently return {flashcards: [...]} or {cards: [...]} instead of bare [...].
 */
const unwrapArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
        const keys = ['flashcards', 'cards', 'questions', 'quiz', 'data', 'results', 'items'];
        for (const key of keys) {
            if (Array.isArray(data[key])) return data[key];
        }
        const objKeys = Object.keys(data);
        if (objKeys.length === 1 && Array.isArray(data[objKeys[0]])) {
            return data[objKeys[0]];
        }
    }
    return data; // Return as-is, let validators handle the error
};

const extractStructuredJson = (rawText) => {
    const text = typeof rawText === 'string' ? rawText.trim() : '';

    if (!text) {
        throw new Error('AI returned an empty response.');
    }

    const cleaned = stripCodeFence(text);
    const direct = parseJsonCandidate(cleaned);
    if (direct !== null) return direct;

    const candidates = [];
    const arrayStart = cleaned.indexOf('[');
    const arrayEnd = cleaned.lastIndexOf(']');
    if (arrayStart !== -1 && arrayEnd > arrayStart) {
        candidates.push(cleaned.slice(arrayStart, arrayEnd + 1));
    }

    const objectStart = cleaned.indexOf('{');
    const objectEnd = cleaned.lastIndexOf('}');
    if (objectStart !== -1 && objectEnd > objectStart) {
        candidates.push(cleaned.slice(objectStart, objectEnd + 1));
    }

    for (const candidate of candidates) {
        const parsed = parseJsonCandidate(candidate);
        if (parsed !== null) return parsed;
    }

    throw new Error('AI returned malformed JSON.');
};

const parseStructuredGeneration = ({ rawText, contentType }) => {
    const parsed = extractStructuredJson(rawText);
    const unwrapped = unwrapArray(parsed);

    if (contentType === 'flashcards') {
        return validateFlashcards(unwrapped);
    }

    if (contentType === 'quiz') {
        return validateQuizQuestions(unwrapped);
    }

    return null;
};

module.exports = {
    extractStructuredJson,
    parseStructuredGeneration,
    unwrapArray
};
