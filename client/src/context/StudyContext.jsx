import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { generateContent, saveStudySet, loadDeck as fetchDeck } from '../services/api';
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
    const [error, setError] = useState(null);
    const [refreshLibrary, setRefreshLibrary] = useState(0);
    const [stats, setStats] = useState({
        cardsReviewed: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        streak: 0
    });

    const handleFileUpload = async (file) => {
        setLoading(true);
        setError(null);

        try {
            const extractedText = file.type === 'application/pdf'
                ? await (async () => {
                    const { extractTextFromPDF } = await import('../services/pdfProcessor');
                    return extractTextFromPDF(file);
                })()
                : await file.text();

            setText(extractedText);
            setFlashcards([]);
            setQuiz([]);
        } catch (err) {
            setError(`Failed to process file: ${getErrorMessage(err, 'Unknown error.')}`);
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

            return {
                ok: true,
                warnings: response?.warnings || []
            };
        } catch (err) {
            return {
                ok: false,
                error: getErrorMessage(err, 'Save failed.')
            };
        }
    };

    const generateFlashcards = async () => {
        if (!text) return;

        setLoading(true);
        setError(null);

        try {
            const safeText = text.substring(0, 25000);
            const prompt = `Generate 15 flashcards based on the following text. 
Return the result as a strictly formatted JSON array of objects. 
Each object must have "question", "answer", "explanation", and "topics" (an array of 1-3 short topic tags that describe what subject area this card covers, e.g. ["photosynthesis", "plant biology"]).
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

            setFlashcards(parsedFlashcards);

            const saveResult = await saveSession(
                `Auto-saved Flashcards ${new Date().toLocaleTimeString()}`,
                parsedFlashcards,
                quiz
            );

            if (saveResult.ok) {
                toast.success(`Flashcards generated and saved with ${response.provider}.`);
                saveResult.warnings.forEach((warning) => toast(warning));
            } else {
                toast.error(saveResult.error || 'Generated, but auto-save failed.');
            }
        } catch (err) {
            const message = getErrorMessage(err, 'Failed to generate flashcards.');
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const generateQuiz = async () => {
        if (!text) return;

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
                `Auto-saved Quiz ${new Date().toLocaleTimeString()}`,
                flashcards,
                parsedQuiz
            );

            if (saveResult.ok) {
                toast.success(`Quiz generated and saved with ${response.provider}.`);
                saveResult.warnings.forEach((warning) => toast(warning));
            } else {
                toast.error(saveResult.error || 'Generated quiz, but auto-save failed.');
            }
        } catch (err) {
            const message = getErrorMessage(err, 'Failed to generate quiz.');
            setError(message);
            toast.error(message);
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
            setText(data.description || '');
            setFlashcards(normalizeFlashcards(data.flashcards));
            setQuiz(normalizeQuizQuestions(data.quiz));
            toast.success('Session loaded!');
        } catch (err) {
            setError(`Failed to load deck: ${getErrorMessage(err, 'Unknown error.')}`);
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
            error,
            stats,
            handleFileUpload,
            generateFlashcards,
            generateQuiz,
            saveSession,
            updateStats,
            loadDeck,
            refreshLibrary
        }}>
            {children}
        </StudyContext.Provider>
    );
};
