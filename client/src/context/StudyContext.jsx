import React, { createContext, useContext, useState } from 'react';
import { extractTextFromPDF } from '../services/pdfProcessor';
import { generateContent } from '../services/api';

const StudyContext = createContext();

export const useStudy = () => useContext(StudyContext);

export const StudyProvider = ({ children }) => {
    const [text, setText] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [quiz, setQuiz] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
            let extractedText = '';
            if (file.type === 'application/pdf') {
                extractedText = await extractTextFromPDF(file);
            } else {
                extractedText = await file.text();
            }
            setText(extractedText);
            // Clear previous generated content when new file is uploaded
            setFlashcards([]);
            setQuiz([]);
        } catch (err) {
            setError("Failed to process file: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const generateFlashcards = async () => {
        if (!text) return;
        setLoading(true);
        try {
            // Truncate text to ~300k chars (Llama 3.3 70b supports 128k tokens, ~500k chars)
            const safeText = text.substring(0, 300000);
            const prompt = `Generate 30 flashcards based on the following text. 
      Return the result as a strictly formatted JSON array of objects. 
      Each object must have "question" and "answer" keys.
      Do not output any markdown formatting (like \`\`\`json), just the raw JSON.
      
      Text Content:
      ${safeText}`;

            const response = await generateContent(prompt, "You are a helpful study assistant that outputs strict JSON.");

            // Parse response
            let content = response.content[0].text;
            // Clean up markdown code blocks if present despite instructions
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();

            const parsed = JSON.parse(content);
            setFlashcards(parsed);
        } catch (err) {
            console.error(err);
            setError("Failed to generate flashcards. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const generateQuiz = async () => {
        if (!text) return;
        setLoading(true);
        try {
            const safeText = text.substring(0, 300000);
            const prompt = `Generate 30 multiple-choice questions based on the following text.
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

            let content = response.content[0].text;
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();

            const parsed = JSON.parse(content);
            setQuiz(parsed);
        } catch (err) {
            console.error(err);
            setError("Failed to generate quiz. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const updateStats = (newStats) => {
        setStats(prev => ({ ...prev, ...newStats }));
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
            updateStats,
            loadSession: (session) => {
                setText(session.originalText);
                setFlashcards(session.flashcards || []);
                setQuiz(session.quiz || []);
            }
        }}>
            {children}
        </StudyContext.Provider>
    );
};
