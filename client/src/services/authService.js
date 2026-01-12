import axios from 'axios';

let envUrl = import.meta.env.VITE_API_URL || 'https://mindflow-api-k5ex.onrender.com/api';
if (envUrl.endsWith('/')) envUrl = envUrl.slice(0, -1);
if (!envUrl.endsWith('/api')) envUrl += '/api';
const API_URL = envUrl + '/auth';

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const register = async (name, email, password) => {
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};
