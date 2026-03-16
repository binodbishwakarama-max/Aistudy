import axios from 'axios';
import { supabase } from './supabaseClient';

// --- CONFIGURATION ---
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE.endsWith('/') ? API_BASE : API_BASE, // Axios handles slash, but we ensure base is correct
    headers: {
        'Content-Type': 'application/json'
    }
});

// --- INTERCEPTOR: Attach Supabase Token ---
api.interceptors.request.use(async (config) => {
    // 1. Get the current session from Supabase
    const { data: { session } } = await supabase.auth.getSession();

    // 2. If logged in, add the token to headers
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- API METHODS ---

/**
 * Generate Flashcards / Quiz using AI (Proxied through backend)
 */
export const generateContent = async (prompt, system) => {
    try {
        const response = await api.post('/generate', { prompt, system });
        return response.data;
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error; // Re-throw for UI handling
    }
};

/**
 * Save a Study Set (Deck + Cards) to Supabase (via Backend)
 * @param {Object} data { title, originalText, flashcards: [], quiz: [] }
 */
export const saveStudySet = async (data) => {
    try {
        const response = await api.post('/study/save', data);
        return response.data;
    } catch (error) {
        console.error("Save Study Set Error:", error);
        throw error;
    }
};

/**
 * Fetch User's Study History (Decks)
 */
export const getStudyHistory = async () => {
    try {
        const response = await api.get('/study/history');
        return response.data;
    } catch (error) {
        console.error("Fetch History Error:", error);
        throw error;
    }
};

/**
 * Chat with AI Tutor
 * @param {string} message - User's question
 * @param {string} context - Study material text
 * @param {Array} history - Previous chat messages
 */
export const chatWithAI = async (message, context, history) => {
    try {
        const response = await api.post('/chat', { message, context, history });
        return response.data;
    } catch (error) {
        console.error("Chat Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};

/**
 * Submit a Flashcard Review (SRS)
 * @param {string} cardId - ID of the flashcard
 * @param {number} rating - 1 (Again), 2 (Hard), 3 (Good), 4 (Easy)
 */
export const reviewFlashcard = async (cardId, rating) => {
    try {
        const response = await api.post('/study/review', { cardId, rating });
        return response.data;
    } catch (error) {
        console.error("Review Error:", error);
        throw error;
    }
};

/**
 * Load a full study set (Deck + Cards)
 */
export const loadDeck = async (id) => {
    try {
        const response = await api.get(`/study/deck/${id}`);
        return response.data;
    } catch (error) {
        console.error("Load Deck Error:", error);
        throw error;
    }
};

/**
 * Delete a study set
 */
export const deleteDeck = async (id) => {
    try {
        const response = await api.delete(`/study/deck/${id}`);
        return response.data;
    } catch (error) {
        console.error("Delete Deck Error:", error);
        throw error;
    }
};

export default api;
