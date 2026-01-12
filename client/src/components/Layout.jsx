import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Brain, LayoutDashboard, BarChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    // Enforce light mode
    useEffect(() => {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }, []);

    const isActive = (path) => location.pathname === path
        ? 'text-indigo-600 bg-indigo-50 font-medium'
        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50';

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-900">
            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm">
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

                            <div className="w-px h-6 bg-gray-300 mx-2"></div>

                            {user ? (
                                <div className="flex items-center gap-3 ml-2">
                                    <span className="text-sm font-medium text-gray-800 hidden md:inline">Hi, {user.user?.name || 'Student'}</span>
                                    <button
                                        onClick={logout}
                                        className="text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="ml-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm shadow-md shadow-indigo-200">
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
