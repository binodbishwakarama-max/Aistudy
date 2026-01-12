import axios from 'axios';

// Normalize API_URL: Ensure it doesn't have a trailing slash and usually points to /api
let envUrl = import.meta.env.VITE_API_URL || 'https://mindflow-api-k5ex.onrender.com/api';
// Remove trailing slash if present
if (envUrl.endsWith('/')) envUrl = envUrl.slice(0, -1);
// Append /api if missing (heuristic: if it doesn't end with /api)
if (!envUrl.endsWith('/api')) envUrl += '/api';

const API_URL = envUrl;

export const generateContent = async (prompt, system) => {
    try {
        const response = await axios.post(`${API_URL}/generate`, { prompt, system });
        // response.data is the full Anthropic message object
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
