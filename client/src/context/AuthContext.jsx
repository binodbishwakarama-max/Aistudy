import React, { createContext, useContext, useState } from 'react';
import { login, register, logout, getCurrentUser } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => getCurrentUser());
    const [loading] = useState(false);

    const handleLogin = async (email, password) => {
        const data = await login(email, password);
        setUser(data);
        return data;
    };

    const handleRegister = async (name, email, password) => {
        const data = await register(name, email, password);
        setUser(data);
        return data;
    };

    const handleLogout = () => {
        logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login: handleLogin, register: handleRegister, logout: handleLogout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
