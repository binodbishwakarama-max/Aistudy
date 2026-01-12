import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://mindflow-api-k5ex.onrender.com/api';

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
