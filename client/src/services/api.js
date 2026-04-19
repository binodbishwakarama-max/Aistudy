import axios from 'axios';
import { supabase } from './supabaseClient';

const normalizeApiBase = (value) => {
    let base = value || 'http://localhost:3000/api';

    if (base.endsWith('/')) {
        base = base.slice(0, -1);
    }

    if (!base.endsWith('/api')) {
        base = `${base}/api`;
    }

    return base;
};

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL);

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
});

// --- INTERCEPTOR: Attach Supabase Token ---
api.interceptors.request.use(async (config) => {
    try {
        if (!supabase) {
            return config;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            throw error;
        }

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }
    } catch (error) {
        console.error('Failed to attach auth token:', error);
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- API METHODS ---

/**
 * Generate Flashcards / Quiz using AI (Proxied through backend)
 */
export const generateContent = async (prompt, system, contentType = 'text') => {
    try {
        const response = await api.post('/generate', { prompt, system, contentType });
        
        // Output from the synchronous fallback (No Redis configured) or direct return
        if (!response.data.jobId) {
            return response.data;
        }

        // BullMQ Pipeline: Start polling for job completion
        const { jobId } = response.data;
        let jobState = 'queued';
        let result = null;

        while (jobState !== 'completed' && jobState !== 'failed') {
            // Wait 1.5 seconds before asking the server again
            await new Promise((resolve) => setTimeout(resolve, 1500));
            
            const jobStatusRes = await api.get(`/jobs/${jobId}`);
            
            jobState = jobStatusRes.data.state;
            
            if (jobState === 'completed') {
                result = jobStatusRes.data.result;
            } else if (jobState === 'failed') {
                throw new Error(jobStatusRes.data.error || 'AI generation job failed in the background.');
            }
        }

        return result;
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

/**
 * Semantic vector search for flashcards
 */
export const searchFlashcards = async (query) => {
    try {
        const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error("Search Error:", error);
        throw error;
    }
};

export default api;

/**
 * Fetch Gamification Stats
 */
export const fetchUserStats = async () => {
    try {
        const response = await api.get('/stats');
        return response.data;
    } catch (error) {
        console.error('Fetch Stats Error:', error);
        throw error;
    }
};

/**
 * Update Gamification Stats
 */
export const updateUserStats = async (statsData) => {
    try {
        const response = await api.patch('/stats', statsData);
        return response.data;
    } catch (error) {
        console.error('Update Stats Error:', error);
        throw error;
    }
};

/**
 * Generate an Adaptive Quiz from all user decks
 * @param {number} questionCount - Number of questions to generate (default 10, max 20)
 */
export const generateAdaptiveQuiz = async (questionCount = 10) => {
    try {
        const response = await api.post('/adaptive/generate', { questionCount });
        return response.data;
    } catch (error) {
        console.error('Adaptive Quiz Generation Error:', error);
        throw error;
    }
};

/**
 * Submit Adaptive Quiz results for topic score updates
 * @param {Array} results - Array of { topic: string, correct: boolean }
 */
export const submitAdaptiveResults = async (results) => {
    try {
        const response = await api.post('/adaptive/submit', { results });
        return response.data;
    } catch (error) {
        console.error('Adaptive Quiz Submit Error:', error);
        throw error;
    }
};

/**
 * Fetch user's topic mastery scores
 */
export const fetchTopicScores = async () => {
    try {
        const response = await api.get('/adaptive/topics');
        return response.data;
    } catch (error) {
        console.error('Fetch Topic Scores Error:', error);
        throw error;
    }
};
