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
    if (contentType === 'flashcards') {
        return validateFlashcards(extractStructuredJson(rawText));
    }

    if (contentType === 'quiz') {
        return validateQuizQuestions(extractStructuredJson(rawText));
    }

    return null;
};

module.exports = {
    extractStructuredJson,
    parseStructuredGeneration
};
