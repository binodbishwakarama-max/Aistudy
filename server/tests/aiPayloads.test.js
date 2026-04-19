const assert = require('node:assert/strict');
const {
    extractStructuredJson,
    parseStructuredGeneration
} = require('../utils/aiPayloads');

test('extractStructuredJson parses fenced json', () => {
    const parsed = extractStructuredJson('```json\n[{"question":"Q","answer":"A"}]\n```');
    assert.deepEqual(parsed, [{ question: 'Q', answer: 'A' }]);
});

test('extractStructuredJson parses json embedded in prose', () => {
    const parsed = extractStructuredJson('Here is the result:\n[{"question":"Q","answer":"A"}]');
    assert.deepEqual(parsed, [{ question: 'Q', answer: 'A' }]);
});

test('parseStructuredGeneration validates flashcards', () => {
    const parsed = parseStructuredGeneration({
        rawText: '[{"question":"Q","answer":"A","explanation":"Because"}]',
        contentType: 'flashcards'
    });

    assert.deepEqual(parsed, [{
        id: undefined,
        question: 'Q',
        answer: 'A',
        explanation: 'Because',
        topics: [],
        next_review_at: null,
        srs_interval: 0,
        srs_ease_factor: 2.5,
        srs_repetitions: 0
    }]);
});

test('parseStructuredGeneration validates quiz output', () => {
    const parsed = parseStructuredGeneration({
        rawText: JSON.stringify([
            {
                question: 'What is 2+2?',
                options: ['1', '2', '3', '4'],
                correctIndex: 3,
                explanation: '2+2 equals 4.'
            }
        ]),
        contentType: 'quiz'
    });

    assert.equal(parsed[0].correctIndex, 3);
    assert.equal(parsed[0].options[3], '4');
});

test('parseStructuredGeneration returns null for plain text responses', () => {
    const parsed = parseStructuredGeneration({
        rawText: 'Hello world',
        contentType: 'text'
    });

    assert.equal(parsed, null);
});
