import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Brain, LayoutDashboard, BarChart, Trophy, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const { gameState, getXpToNextLevel, showLevelUp } = useGamification();
    const xpNeeded = getXpToNextLevel(gameState.level);
    const xpProgress = (gameState.xp / xpNeeded) * 100;

    // Enforce light mode (glassmorphism looks best in light/hybrid for now)
    useEffect(() => {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }, []);

    const isActive = (path) => location.pathname === path
        ? 'text-indigo-700 bg-white/50 font-medium shadow-sm'
        : 'text-gray-700 hover:text-indigo-700 hover:bg-white/30';

    return (
        <div className="min-h-screen text-slate-900 relative">
            {/* Level Up Modal / Overlay */}
            {showLevelUp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-2 border-yellow-400 animate-bounce text-center">
                        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">LEVEL UP!</h2>
                        <p className="text-xl font-bold text-gray-700 mt-2">You reached Level {gameState.level}</p>
                    </div>
                </div>
            )}

            {/* Background Overlay for better text contrast if needed */}
            <div className="fixed inset-0 bg-white/30 -z-10" />

            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-indigo-600/90 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform backdrop-blur-md">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight">
                                MindFlow
                            </span>
                        </Link>

                        <div className="hidden md:flex gap-2 items-center bg-white/20 p-1 rounded-2xl backdrop-blur-md border border-white/30">
                            <Link to="/" className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${isActive('/')}`}>
                                <LayoutDashboard size={18} />
                                <span>Upload</span>
                            </Link>
                            <Link to="/study" className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${isActive('/study')}`}>
                                <BookOpen size={18} />
                                <span>Study</span>
                            </Link>
                            <Link to="/stats" className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${isActive('/stats')}`}>
                                <BarChart size={18} />
                                <span>Stats</span>
                            </Link>
                            {user && (
                                <Link to="/dashboard" className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${isActive('/dashboard')}`}>
                                    <BarChart size={18} />
                                    <span>History</span>
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Gamification Stats */}
                            <div className="hidden lg:flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase tracking-wide">
                                        <span>Level {gameState.level}</span>
                                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: `${xpProgress}%` }} />
                                        </div>
                                    </div>
                                    <div className="text-xs text-indigo-600 font-semibold">{gameState.xp} / {xpNeeded} XP</div>
                                </div>

                                <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100" title="Daily Streak">
                                    <Flame size={16} className="text-orange-500 fill-orange-500" />
                                    <span className="text-sm font-bold text-orange-700">{gameState.streak}</span>
                                </div>
                            </div>

                            {user ? (
                                <div className="flex items-center gap-3">
                                    <div className="hidden md:flex flex-col items-end">
                                        <span className="text-sm font-bold text-gray-800">{user.user?.name || 'Student'}</span>
                                        <span className="text-xs text-gray-600">Level 1 Scholar</span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="text-sm font-medium text-red-600 hover:bg-red-50/50 px-4 py-2 rounded-xl transition border border-transparent hover:border-red-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="px-6 py-2.5 bg-indigo-600/90 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 font-medium flex items-center gap-2">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative z-10">
                {children}
            </main>
        </div>
    );
};

export default Layout;
