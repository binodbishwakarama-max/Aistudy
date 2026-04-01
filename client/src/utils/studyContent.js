const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const stripCodeFence = (text) => text
  .replace(/^```(?:json)?\s*/i, '')
  .replace(/\s*```$/i, '')
  .trim();

const parseJsonCandidate = (candidate) => {
  if (!candidate) return null;

  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
};

const extractStructuredJson = (rawText) => {
  const text = normalizeText(rawText);
  if (!text) return null;

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

  return null;
};

export const normalizeFlashcards = (cards) => {
  if (!Array.isArray(cards)) return [];

  return cards
    .map((card) => ({
      id: card?.id,
      question: normalizeText(card?.question) || normalizeText(card?.front),
      answer: normalizeText(card?.answer) || normalizeText(card?.back),
      explanation: normalizeText(card?.explanation),
    }))
    .filter((card) => card.question && card.answer);
};

export const normalizeQuizQuestions = (questions) => {
  if (!Array.isArray(questions)) return [];

  return questions
    .map((question) => ({
      question: normalizeText(question?.question),
      options: Array.isArray(question?.options)
        ? question.options.map((option) => normalizeText(option)).filter(Boolean)
        : [],
      correctIndex: Number.isInteger(question?.correctIndex)
        ? question.correctIndex
        : Number.parseInt(question?.correctIndex, 10),
      explanation: normalizeText(question?.explanation),
    }))
    .filter((question) => (
      question.question
      && question.options.length === 4
      && Number.isInteger(question.correctIndex)
      && question.correctIndex >= 0
      && question.correctIndex < question.options.length
    ));
};

export const getStructuredDataFromGeneration = (response, contentType) => {
  if (contentType === 'flashcards') {
    const directData = normalizeFlashcards(response?.data);
    if (directData.length > 0) return directData;
    return normalizeFlashcards(extractStructuredJson(response?.content?.[0]?.text));
  }

  if (contentType === 'quiz') {
    const directData = normalizeQuizQuestions(response?.data);
    if (directData.length > 0) return directData;
    return normalizeQuizQuestions(extractStructuredJson(response?.content?.[0]?.text));
  }

  return response?.data ?? null;
};
