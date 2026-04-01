const test = require('node:test');
const assert = require('node:assert/strict');
const { sanitizeHistory } = require('../services/aiService');

test('sanitizeHistory removes a duplicate trailing user message', () => {
    const history = sanitizeHistory([
        { role: 'assistant', content: 'Hello there' },
        { role: 'user', content: 'Explain mitosis' }
    ], 'Explain mitosis');

    assert.deepEqual(history, [
        { role: 'assistant', content: 'Hello there' }
    ]);
});

test('sanitizeHistory keeps earlier distinct messages and trims content', () => {
    const history = sanitizeHistory([
        { role: 'assistant', content: '  Hi  ' },
        { role: 'user', content: '  First question  ' },
        { role: 'user', content: 'Second question' }
    ], 'Third question');

    assert.deepEqual(history, [
        { role: 'assistant', content: 'Hi' },
        { role: 'user', content: 'First question' },
        { role: 'user', content: 'Second question' }
    ]);
});
