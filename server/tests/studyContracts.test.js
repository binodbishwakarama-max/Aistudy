const assert = require('node:assert/strict');
const {
    normalizeDeckResponse,
    prepareStudySetForSave,
    validateFlashcards,
    validateQuizQuestions
} = require('../utils/studyContracts');

test('prepareStudySetForSave accepts question/answer flashcards', () => {
    const result = prepareStudySetForSave({
        flashcards: [
            { question: 'What is photosynthesis?', answer: 'A process plants use to convert light into energy.' }
        ]
    });

    assert.deepEqual(result.flashcards, [
        {
            front: 'What is photosynthesis?',
            back: 'A process plants use to convert light into energy.',
            explanation: '',
            topics: []
        }
    ]);
    assert.deepEqual(result.quiz, []);
});

test('prepareStudySetForSave normalizes quiz data for storage', () => {
    const result = prepareStudySetForSave({
        flashcards: [
            { front: 'Q1', back: 'A1' }
        ],
        quiz: [
            {
                question: 'Pick the right answer',
                options: ['A', 'B', 'C', 'D'],
                correctIndex: 2,
                explanation: 'C is correct.'
            }
        ]
    });

    assert.deepEqual(result.quiz, [
        {
            prompt: 'Pick the right answer',
            options: ['A', 'B', 'C', 'D'],
            correct_index: 2,
            explanation: 'C is correct.'
        }
    ]);
});

test('prepareStudySetForSave accepts quiz-only saves', () => {
    const result = prepareStudySetForSave({
        flashcards: [],
        quiz: [
            {
                question: 'Question',
                options: ['A', 'B', 'C', 'D'],
                correctIndex: 0
            }
        ]
    });

    assert.equal(result.flashcards.length, 0);
    assert.equal(result.quiz.length, 1);
});

test('prepareStudySetForSave rejects fully empty saves', () => {
    assert.throws(() => prepareStudySetForSave({
        flashcards: [],
        quiz: []
    }), /at least one flashcard or quiz question/i);
});

test('validateFlashcards normalizes stored cards for the client', () => {
    const cards = validateFlashcards([
        {
            id: 'card-1',
            front: 'Question',
            back: 'Answer',
            explanation: 'Why it matters'
        }
    ]);

    assert.deepEqual(cards[0], {
        id: 'card-1',
        question: 'Question',
        answer: 'Answer',
        explanation: 'Why it matters',
        topics: [],
        next_review_at: null,
        srs_interval: 0,
        srs_ease_factor: 2.5,
        srs_repetitions: 0
    });
});

test('validateQuizQuestions enforces four options and a valid answer index', () => {
    const questions = validateQuizQuestions([
        {
            question: 'Question',
            options: ['A', 'B', 'C', 'D'],
            correctIndex: 3,
            explanation: 'D is right.'
        }
    ]);

    assert.equal(questions[0].options.length, 4);
    assert.equal(questions[0].correctIndex, 3);
});

test('normalizeDeckResponse returns a client-safe payload', () => {
    const response = normalizeDeckResponse({
        deck: { id: 'deck-1', title: 'Biology', question_count: 3 },
        flashcards: [{ id: 'card-1', front: 'Q', back: 'A' }],
        quiz: [
            {
                question: 'What is ATP?',
                options: ['A', 'B', 'C', 'D'],
                correctIndex: 0,
                explanation: 'ATP stores energy.'
            }
        ]
    });

    assert.equal(response.id, 'deck-1');
    assert.equal(response.flashcards[0].question, 'Q');
    assert.equal(response.quiz[0].question, 'What is ATP?');
    assert.equal(response.question_count, 3);
});
