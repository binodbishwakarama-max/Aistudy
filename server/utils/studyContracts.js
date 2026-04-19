const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const coerceInteger = (value) => {
    if (Number.isInteger(value)) return value;

    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) ? parsed : null;
};

const normalizeTopics = (topics) => {
    if (!Array.isArray(topics)) return [];
    return topics.map((t) => normalizeText(t)).filter(Boolean);
};

const normalizeFlashcardForStorage = (card = {}) => ({
    front: normalizeText(card.front) || normalizeText(card.question),
    back: normalizeText(card.back) || normalizeText(card.answer),
    explanation: normalizeText(card.explanation),
    topics: normalizeTopics(card.topics)
});

const normalizeFlashcardForClient = (card = {}) => ({
    id: card.id,
    question: normalizeText(card.question) || normalizeText(card.front),
    answer: normalizeText(card.answer) || normalizeText(card.back),
    explanation: normalizeText(card.explanation),
    topics: normalizeTopics(card.topics),
    next_review_at: card.next_review_at || null,
    srs_interval: card.srs_interval ?? 0,
    srs_ease_factor: card.srs_ease_factor ?? 2.5,
    srs_repetitions: card.srs_repetitions ?? 0
});

const normalizeQuizQuestion = (question = {}) => ({
    question: normalizeText(question.question),
    options: Array.isArray(question.options)
        ? question.options.map((option) => normalizeText(option)).filter(Boolean)
        : [],
    correctIndex: coerceInteger(question.correctIndex),
    explanation: normalizeText(question.explanation)
});

const normalizeQuizQuestionForStorage = (question = {}) => {
    const normalized = normalizeQuizQuestion(question);

    return {
        prompt: normalized.question,
        options: normalized.options,
        correct_index: normalized.correctIndex,
        explanation: normalized.explanation
    };
};

const validateFlashcards = (cards, { allowEmpty = false } = {}) => {
    if (!Array.isArray(cards)) {
        throw new Error('Flashcards must be an array.');
    }

    const normalizedCards = cards.map(normalizeFlashcardForClient);
    const invalidCard = normalizedCards.find((card) => !card.question || !card.answer);

    if (invalidCard) {
        throw new Error('Each flashcard must include a question and answer.');
    }

    if (!allowEmpty && normalizedCards.length === 0) {
        throw new Error('At least one flashcard is required.');
    }

    return normalizedCards;
};

const validateQuizQuestions = (questions, { allowEmpty = false } = {}) => {
    if (!Array.isArray(questions)) {
        throw new Error('Quiz questions must be an array.');
    }

    const normalizedQuestions = questions.map(normalizeQuizQuestion);
    const invalidQuestion = normalizedQuestions.find((question) => (
        !question.question
        || question.options.length !== 4
        || question.correctIndex === null
        || question.correctIndex < 0
        || question.correctIndex >= question.options.length
    ));

    if (invalidQuestion) {
        throw new Error(
            'Each quiz question must include a prompt, exactly 4 options, and a valid correctIndex.'
        );
    }

    if (!allowEmpty && normalizedQuestions.length === 0) {
        throw new Error('At least one quiz question is required.');
    }

    return normalizedQuestions;
};

const prepareStudySetForSave = ({ flashcards = [], quiz = [] } = {}) => {
    const normalizedFlashcards = Array.isArray(flashcards)
        ? flashcards.map(normalizeFlashcardForStorage)
        : null;
    const normalizedQuiz = Array.isArray(quiz)
        ? validateQuizQuestions(quiz, { allowEmpty: true })
        : null;

    if (!normalizedFlashcards) {
        throw new Error('Flashcards must be an array.');
    }

    const invalidFlashcard = normalizedFlashcards.find((card) => !card.front || !card.back);
    if (invalidFlashcard) {
        throw new Error('Each flashcard must include a question/front and answer/back.');
    }

    if (normalizedFlashcards.length === 0 && (!normalizedQuiz || normalizedQuiz.length === 0)) {
        throw new Error('Saving requires at least one flashcard or quiz question.');
    }

    return {
        flashcards: normalizedFlashcards,
        quiz: (normalizedQuiz || []).map(normalizeQuizQuestionForStorage)
    };
};

const normalizeDeckResponse = ({ deck = {}, flashcards = [], quiz = [] } = {}) => ({
    ...deck,
    flashcards: validateFlashcards(flashcards, { allowEmpty: true }),
    quiz: validateQuizQuestions(quiz, { allowEmpty: true }),
    question_count: deck.question_count ?? quiz.length
});

module.exports = {
    normalizeFlashcardForClient,
    normalizeFlashcardForStorage,
    normalizeQuizQuestion,
    normalizeQuizQuestionForStorage,
    normalizeDeckResponse,
    prepareStudySetForSave,
    validateFlashcards,
    validateQuizQuestions
};
