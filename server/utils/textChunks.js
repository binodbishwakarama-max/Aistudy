const CHUNK_SIZE = 1800;
const CHUNK_OVERLAP = 200;

const normalizeWhitespace = (text) => (typeof text === 'string' ? text.replace(/\s+/g, ' ').trim() : '');

const splitIntoChunks = (text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) => {
    const normalized = normalizeWhitespace(text);
    if (!normalized) return [];

    const chunks = [];
    let start = 0;

    while (start < normalized.length) {
        const end = Math.min(start + chunkSize, normalized.length);
        chunks.push({
            index: chunks.length,
            text: normalized.slice(start, end),
            start,
            end,
        });
        if (end >= normalized.length) break;
        start = Math.max(0, end - overlap);
    }

    return chunks;
};

const scoreChunkRelevance = (chunkText, query) => {
    const terms = query.toLowerCase().split(/\s+/).filter((term) => term.length > 2);
    if (terms.length === 0) return 0;

    const haystack = chunkText.toLowerCase();
    return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
};

const findRelevantChunks = (text, query, limit = 3) => {
    const chunks = splitIntoChunks(text);
    if (chunks.length === 0) return [];

    return chunks
        .map((chunk) => ({ ...chunk, score: scoreChunkRelevance(chunk.text, query) }))
        .filter((chunk) => chunk.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
};

module.exports = {
    splitIntoChunks,
    findRelevantChunks,
    normalizeWhitespace,
};
