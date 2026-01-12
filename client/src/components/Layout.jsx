import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Brain, LayoutDashboard, BarChart, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const isActive = (path) => location.pathname === path
        ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium'
        : 'text-gray-600 hover:text-indigo-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-300';

    return (
        <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-800 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900 dark:text-gray-100">
            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
                                MindFlow
                            </span>
                        </Link>

                        <div className="flex gap-1 items-center">
                            <Link to="/" className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${isActive('/')}`}>
                                <LayoutDashboard size={18} />
                                <span className="hidden sm:inline">Upload</span>
                            </Link>
                            <Link to="/study" className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${isActive('/study')}`}>
                                <BookOpen size={18} />
                                <span className="hidden sm:inline">Study</span>
                            </Link>
                            {user && (
                                <Link to="/dashboard" className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${isActive('/dashboard')}`}>
                                    <BarChart size={18} />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>
                            )}

                            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>

                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Toggle Dark Mode"
                            >
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            {user ? (
                                <div className="flex items-center gap-3 ml-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline">Hi, {user.user?.name || 'Student'}</span>
                                    <button
                                        onClick={logout}
                                        className="text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="ml-2 px-5 py-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition font-medium text-sm shadow-md shadow-gray-200 dark:shadow-none">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {children}
            </main>
        </div>
    );
};

export default Layout;
