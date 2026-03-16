import React, { createContext, useContext, useState } from 'react';
import { extractTextFromPDF } from '../services/pdfProcessor';
import { generateContent, saveStudySet, loadDeck as fetchDeck } from '../services/api';
import { toast } from 'react-hot-toast';

const StudyContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useStudy = () => useContext(StudyContext);

export const StudyProvider = ({ children }) => {
    const [text, setText] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [quiz, setQuiz] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshLibrary, setRefreshLibrary] = useState(0); // Trigger for library refresh
    const [stats, setStats] = useState({
        cardsReviewed: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        streak: 0
    });

    // --- FILE UPLOAD ---
    const handleFileUpload = async (file) => {
        setLoading(true);
        setError(null);
        try {
            let extractedText = '';
            if (file.type === 'application/pdf') {
                extractedText = await extractTextFromPDF(file);
            } else {
                extractedText = await file.text();
            }
            setText(extractedText);
            // Clear content
            setFlashcards([]);
            setQuiz([]);
        } catch (err) {
            setError("Failed to process file: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- GENERATE FLASHCARDS (AUTO-SAVE) ---
    const generateFlashcards = async () => {
        if (!text) return;
        setLoading(true);
        try {
            // Limit text context to ~5k-7k tokens to avoid rate limits
            const safeText = text.substring(0, 25000);
            const prompt = `Generate 15 flashcards based on the following text. 
      Return the result as a strictly formatted JSON array of objects. 
      Each object must have "question" and "answer" keys.
      Do not output any markdown formatting (like \`\`\`json), just the raw JSON.
      
      Text Content:
      ${safeText}`;

            const response = await generateContent(prompt, "You are a helpful study assistant that outputs strict JSON.");
            let content = response.content[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(content);

            setFlashcards(parsed);

            // AUTO-SAVE
            const saved = await saveSession('Auto-saved Flashcards ' + new Date().toLocaleTimeString(), parsed, []);
            if (saved) {
                toast.success("Flashcards generated & saved!");
                setRefreshLibrary(prev => prev + 1); // Trigger Refresh
            } else {
                toast.error("Generated, but auto-save failed.");
            }

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- GENERATE QUIZ (AUTO-SAVE) ---
    const generateQuiz = async () => {
        if (!text) return;
        setLoading(true);
        try {
            // Limit text context to ~5k-7k tokens to avoid rate limits
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

            const response = await generateContent(prompt, "You are a helpful study assistant that outputs strict JSON.");
            let content = response.content[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(content);

            setQuiz(parsed);

            // AUTO-SAVE
            const saved = await saveSession('Auto-saved Quiz ' + new Date().toLocaleTimeString(), [], parsed);
            if (saved) {
                toast.success("Quiz generated & saved!");
                setRefreshLibrary(prev => prev + 1); // Trigger Refresh
            } else {
                toast.error("Generated, but auto-save failed.");
            }

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStats = (newStats) => {
        setStats(prev => ({ ...prev, ...newStats }));
    };

    // --- SAVE SESSION ---
    const saveSession = async (title, currentFlashcards = flashcards, currentQuiz = quiz) => {
        if (!currentFlashcards.length && !currentQuiz.length) {
            return false;
        }

        try {
            await saveStudySet({
                title,
                originalText: text,
                flashcards: currentFlashcards,
                quiz: currentQuiz
            });
            return true;
        } catch (err) {
            console.error("Save failed:", err);
            return false;
        }
    };

    // --- LOAD DECK (LIBRARY) ---
    const loadDeck = async (id) => {
        setLoading(true);
        try {
            const data = await fetchDeck(id);
            setText(data.description || ''); // Using description as context
            setFlashcards(data.flashcards || []);
            setQuiz(data.quiz || []);
            toast.success("Session loaded!");
        } catch (err) {
            setError("Failed to load deck: " + err.message);
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
            refreshLibrary // Export trigger
        }}>
            {children}
        </StudyContext.Provider>
    );
};
