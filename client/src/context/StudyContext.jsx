import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { generateContent, saveStudySet, loadDeck as fetchDeck, updateFlashcard as patchFlashcard, regenerateFlashcard as regenerateFlashcardApi } from '../services/api';
import {
    getStructuredDataFromGeneration,
    normalizeFlashcards,
    normalizeQuizQuestions
} from '../utils/studyContent';

const StudyContext = createContext();

const getErrorMessage = (error, fallback) => (
    error?.response?.data?.error
    || error?.message
    || fallback
);

// eslint-disable-next-line react-refresh/only-export-components
export const useStudy = () => useContext(StudyContext);

export const StudyProvider = ({ children }) => {
    const [text, setText] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [quiz, setQuiz] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadStage, setUploadStage] = useState('idle'); // idle | parsing | generating | ready | error
    const [lastDeckId, setLastDeckId] = useState(null);
    const [error, setError] = useState(null);
    const [refreshLibrary, setRefreshLibrary] = useState(0);
    const [stats, setStats] = useState({
        cardsReviewed: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        streak: 0
    });

    const parseUploadedFile = async (file) => {
        const MAX_FILE_SIZE = 20 * 1024 * 1024;
        const ALLOWED_TYPES = ['application/pdf', 'text/plain', 'text/markdown'];

        if (!file) {
            throw new Error('No file selected.');
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 20MB.`);
        }

        if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
            throw new Error('Unsupported file type. Please upload a PDF or text file.');
        }

        const extractedText = file.type === 'application/pdf'
            ? await (async () => {
                const { extractTextFromPDF } = await import('../services/pdfProcessor');
                return extractTextFromPDF(file);
            })()
            : await file.text();

        if (!extractedText || !extractedText.trim()) {
            throw new Error('No readable text found in the file. The PDF may be image-based or empty.');
        }

        return extractedText;
    };

    const handleFileUpload = async (file) => {
        setLoading(true);
        setUploadStage('parsing');
        setError(null);

        try {
            const extractedText = await parseUploadedFile(file);
            setText(extractedText);
            setFlashcards([]);
            setQuiz([]);
            setUploadStage('ready');
            return { ok: true, text: extractedText };
        } catch (err) {
            const message = `Failed to process file: ${getErrorMessage(err, 'Unknown error.')}`;
            setError(message);
            setUploadStage('error');
            return { ok: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const saveSession = async (title, currentFlashcards = flashcards, currentQuiz = quiz) => {
        if (!currentFlashcards.length && !currentQuiz.length) {
            return { ok: false, error: 'Nothing to save yet.' };
        }

        try {
            const response = await saveStudySet({
                title,
                originalText: text,
                flashcards: currentFlashcards,
                quiz: currentQuiz
            });

            setRefreshLibrary((prev) => prev + 1);
            if (response?.deckId) {
                setLastDeckId(response.deckId);
            }

            return {
                ok: true,
                deckId: response?.deckId || null,
                warnings: response?.warnings || []
            };
        } catch (err) {
            return {
                ok: false,
                error: getErrorMessage(err, 'Save failed.')
            };
        }
    };

    const generateFlashcards = async ({ sourceText = text, title, silent = false } = {}) => {
        const material = sourceText || text;
        if (!material) {
            return { ok: false, error: 'No source text to generate from.' };
        }

        setLoading(true);
        setUploadStage('generating');
        setError(null);

        try {
            const safeText = material.substring(0, 25000);
            const prompt = `Generate 15 flashcards based on the following text. 
Return the result as a strictly formatted JSON array of objects. 
Each object must have:
- "question": string
- "answer": string
- "explanation": string
- "topics": array of 1-3 short topic tags
- "sourceExcerpt": a short verbatim quote from the text that supports this card (max 120 characters)
- "sourceSection": optional location like "page 4" or "section 2.1" if identifiable
Do not output any markdown formatting (like \`\`\`json), just the raw JSON.

Text Content:
${safeText}`;

            const response = await generateContent(
                prompt,
                'You are a helpful study assistant that outputs strict JSON.',
                'flashcards'
            );

            const parsedFlashcards = getStructuredDataFromGeneration(response, 'flashcards');
            if (parsedFlashcards.length === 0) {
                throw new Error('AI returned invalid flashcard data.');
            }

            setText(material);
            setFlashcards(parsedFlashcards);

            const saveResult = await saveSession(
                title || `Study Set ${new Date().toLocaleDateString()}`,
                parsedFlashcards,
                quiz
            );

            if (saveResult.ok) {
                if (!silent) {
                    toast.success(`${parsedFlashcards.length} flashcards ready.`);
                    saveResult.warnings.forEach((warning) => toast(warning));
                }
                setUploadStage('ready');
                return {
                    ok: true,
                    cardCount: parsedFlashcards.length,
                    deckId: saveResult.deckId,
                    provider: response?.provider,
                };
            }

            const saveError = saveResult.error || 'Generated, but auto-save failed.';
            if (!silent) toast.error(saveError);
            setUploadStage('error');
            return { ok: false, error: saveError, cardCount: parsedFlashcards.length };
        } catch (err) {
            const message = getErrorMessage(err, 'Failed to generate flashcards.');
            setError(message);
            setUploadStage('error');
            if (!silent) toast.error(message);
            return { ok: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const handleFileUploadAndGenerate = async (file) => {
        setUploadStage('parsing');
        setError(null);

        try {
            const extractedText = await parseUploadedFile(file);
            setText(extractedText);
            setFlashcards([]);
            setQuiz([]);

            const result = await generateFlashcards({
                sourceText: extractedText,
                title: file.name.replace(/\.[^.]+$/, '') || 'Study Set',
                silent: true,
            });

            if (!result.ok) {
                return result;
            }

            toast.success(`${result.cardCount} flashcards ready. Let's study.`);
            return result;
        } catch (err) {
            const message = getErrorMessage(err, 'Upload failed.');
            setError(message);
            setUploadStage('error');
            toast.error(message);
            return { ok: false, error: message };
        }
    };

    const generateQuiz = async () => {
        if (!text) return { ok: false, error: 'No source text.' };

        setLoading(true);
        setError(null);

        try {
            const safeText = text.substring(0, 25000);
            const prompt = `Generate 15 multiple-choice questions based on the following text.
Return the result as a strictly formatted JSON array of objects.
Each object must have:
- "question": string
- "options": array of 4 strings
- "correctIndex": number (0-3)
- "explanation": string (brief explanation of why the answer is correct)

Do not output any markdown formatting, just the raw JSON.

Text Content:
${safeText}`;

            const response = await generateContent(
                prompt,
                'You are a helpful study assistant that outputs strict JSON.',
                'quiz'
            );

            const parsedQuiz = getStructuredDataFromGeneration(response, 'quiz');
            if (parsedQuiz.length === 0) {
                throw new Error('AI returned invalid quiz data.');
            }

            setQuiz(parsedQuiz);

            const saveResult = await saveSession(
                `Quiz ${new Date().toLocaleDateString()}`,
                flashcards,
                parsedQuiz
            );

            if (saveResult.ok) {
                toast.success(`Quiz generated with ${response?.provider || 'AI'}.`);
                saveResult.warnings.forEach((warning) => toast(warning));
                return { ok: true, questionCount: parsedQuiz.length, deckId: saveResult.deckId };
            }

            toast.error(saveResult.error || 'Generated quiz, but auto-save failed.');
            return { ok: false, error: saveResult.error };
        } catch (err) {
            const message = getErrorMessage(err, 'Failed to generate quiz.');
            setError(message);
            toast.error(message);
            return { ok: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const updateStats = (newStats) => {
        setStats((prev) => ({ ...prev, ...newStats }));
    };

    const loadDeck = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchDeck(id);
            setText(data.sourceText || data.description || '');
            setFlashcards(normalizeFlashcards(data.flashcards));
            setQuiz(normalizeQuizQuestions(data.quiz));
            setLastDeckId(id);
            setUploadStage('ready');
            toast.success('Session loaded!');
        } catch (err) {
            setError(`Failed to load deck: ${getErrorMessage(err, 'Unknown error.')}`);
        } finally {
            setLoading(false);
        }
    };

    const resetUploadStage = () => {
        setUploadStage('idle');
        setError(null);
    };

    const updateFlashcardInDeck = async (cardId, patch) => {
        try {
            const response = await patchFlashcard(cardId, patch);
            if (response?.card) {
                setFlashcards((prev) => prev.map((card) => (
                    card.id === cardId ? { ...card, ...response.card } : card
                )));
            }
            return { ok: true, card: response?.card };
        } catch (err) {
            return { ok: false, error: getErrorMessage(err, 'Failed to update card.') };
        }
    };

    const regenerateFlashcard = async (cardId, feedback = '') => {
        setLoading(true);
        try {
            const response = await regenerateFlashcardApi(cardId, feedback);
            if (response?.card) {
                setFlashcards((prev) => prev.map((card) => (
                    card.id === cardId ? { ...card, ...response.card } : card
                )));
                toast.success('Card regenerated.');
            }
            return { ok: true, card: response?.card };
        } catch (err) {
            const message = getErrorMessage(err, 'Failed to regenerate card.');
            toast.error(message);
            return { ok: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    return (
        <StudyContext.Provider value={{
            text,
            flashcards,
            quiz,
            loading,
            uploadStage,
            lastDeckId,
            error,
            stats,
            handleFileUpload,
            handleFileUploadAndGenerate,
            generateFlashcards,
            generateQuiz,
            saveSession,
            updateStats,
            loadDeck,
            refreshLibrary,
            resetUploadStage,
            updateFlashcardInDeck,
            regenerateFlashcard,
        }}>
            {children}
        </StudyContext.Provider>
    );
};
