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

/**
 * Unwrap common AI wrapper shapes into a plain array.
 * Handles: [...], {flashcards:[...]}, {cards:[...]}, {questions:[...]}, {data:[...]}, {quiz:[...]}, {results:[...]}
 */
const unwrapArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    // Try common wrapper keys
    const keys = ['flashcards', 'cards', 'questions', 'quiz', 'data', 'results', 'items'];
    for (const key of keys) {
      if (Array.isArray(data[key])) return data[key];
    }
    // Last resort: if the object has exactly one key and it's an array, use it
    const objKeys = Object.keys(data);
    if (objKeys.length === 1 && Array.isArray(data[objKeys[0]])) {
      return data[objKeys[0]];
    }
  }
  return [];
};

export const normalizeFlashcards = (cards) => {
  const arr = unwrapArray(cards);
  if (!Array.isArray(arr)) return [];

  return arr
    .map((card) => ({
      id: card?.id,
      question: normalizeText(card?.question) || normalizeText(card?.front) || normalizeText(card?.q),
      answer: normalizeText(card?.answer) || normalizeText(card?.back) || normalizeText(card?.a),
      explanation: normalizeText(card?.explanation) || normalizeText(card?.hint),
    }))
    .filter((card) => card.question && card.answer);
};

export const normalizeQuizQuestions = (questions) => {
  const arr = unwrapArray(questions);
  if (!Array.isArray(arr)) return [];

  return arr
    .map((question) => ({
      question: normalizeText(question?.question) || normalizeText(question?.prompt),
      options: Array.isArray(question?.options)
        ? question.options.map((option) => normalizeText(option)).filter(Boolean)
        : [],
      correctIndex: Number.isInteger(question?.correctIndex)
        ? question.correctIndex
        : Number.isInteger(question?.correct_index)
          ? question.correct_index
          : Number.parseInt(question?.correctIndex ?? question?.correct_index, 10),
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
  if (!response) {
    console.warn('[StudyContent] getStructuredDataFromGeneration received null/undefined response');
    return contentType === 'flashcards' ? [] : contentType === 'quiz' ? [] : null;
  }

  // Debug: log the shape so we can diagnose issues
  console.log('[StudyContent] Response shape:', {
    hasData: !!response?.data,
    dataType: typeof response?.data,
    dataIsArray: Array.isArray(response?.data),
    dataLength: Array.isArray(response?.data) ? response.data.length : 'N/A',
    hasContent: !!response?.content,
    contentType
  });

  if (contentType === 'flashcards') {
    // Strategy 1: Pre-validated data from server
    const directData = normalizeFlashcards(response?.data);
    if (directData.length > 0) return directData;

    // Strategy 2: Parse raw AI text from content field
    const rawText = response?.content?.[0]?.text;
    if (rawText) {
      const parsed = extractStructuredJson(rawText);
      const fromRaw = normalizeFlashcards(parsed);
      if (fromRaw.length > 0) return fromRaw;
    }

    // Strategy 3: Maybe the response itself IS the array (edge case)
    const fromRoot = normalizeFlashcards(response);
    if (fromRoot.length > 0) return fromRoot;

    console.warn('[StudyContent] All flashcard parsing strategies failed. Response:', JSON.stringify(response).slice(0, 500));
    return [];
  }

  if (contentType === 'quiz') {
    const directData = normalizeQuizQuestions(response?.data);
    if (directData.length > 0) return directData;

    const rawText = response?.content?.[0]?.text;
    if (rawText) {
      const parsed = extractStructuredJson(rawText);
      const fromRaw = normalizeQuizQuestions(parsed);
      if (fromRaw.length > 0) return fromRaw;
    }

    const fromRoot = normalizeQuizQuestions(response);
    if (fromRoot.length > 0) return fromRoot;

    console.warn('[StudyContent] All quiz parsing strategies failed. Response:', JSON.stringify(response).slice(0, 500));
    return [];
  }

  return response?.data ?? null;
};

