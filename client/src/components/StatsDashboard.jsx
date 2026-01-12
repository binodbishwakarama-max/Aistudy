import React, { useState, useEffect } from 'react';
import { Trophy, Target, Clock, TrendingUp, Star, Brain } from 'lucide-react';

const StatsDashboard = () => {
    const [stats, setStats] = useState({
        totalQuestions: 0,
        correctAnswers: 0,
        totalTimeSpent: 0,
        cardsReviewed: 0,
        favorites: 0,
        hardCards: 0,
        mediumCards: 0,
        easyCards: 0
    });

    useEffect(() => {
        // Load stats from localStorage
        const quizStats = JSON.parse(localStorage.getItem('quiz_stats') || '{}');
        const favorites = JSON.parse(localStorage.getItem('flashcard_favorites') || '[]');
        const difficulty = JSON.parse(localStorage.getItem('flashcard_difficulty') || '{}');

        const hardCards = Object.values(difficulty).filter(d => d === 'hard').length;
        const mediumCards = Object.values(difficulty).filter(d => d === 'medium').length;
        const easyCards = Object.values(difficulty).filter(d => d === 'easy').length;

        setStats({
            totalQuestions: quizStats.totalQuestions || 0,
            correctAnswers: quizStats.correctAnswers || 0,
            totalTimeSpent: quizStats.totalTimeSpent || 0,
            cardsReviewed: hardCards + mediumCards + easyCards,
            favorites: favorites.length,
            hardCards,
            mediumCards,
            easyCards
        });
    }, []);

    const accuracy = stats.totalQuestions > 0
        ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
        : 0;

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const StatCard = ({ icon: Icon, label, value, color, subtitle }) => (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-sm font-medium text-gray-600">{label}</div>
            {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Study Statistics</h2>
                    <p className="text-gray-600">Track your learning progress</p>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    icon={Target}
                    label="Quiz Accuracy"
                    value={`${accuracy}%`}
                    color="bg-indigo-600"
                    subtitle={`${stats.correctAnswers} / ${stats.totalQuestions} correct`}
                />
                <StatCard
                    icon={Clock}
                    label="Time Studied"
                    value={formatTime(stats.totalTimeSpent)}
                    color="bg-purple-600"
                    subtitle={`${stats.totalQuestions} questions answered`}
                />
                <StatCard
                    icon={Brain}
                    label="Cards Reviewed"
                    value={stats.cardsReviewed}
                    color="bg-blue-600"
                    subtitle="Flashcards practiced"
                />
                <StatCard
                    icon={Star}
                    label="Favorites"
                    value={stats.favorites}
                    color="bg-yellow-500"
                    subtitle="Bookmarked cards"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Easy Cards"
                    value={stats.easyCards}
                    color="bg-green-600"
                    subtitle="Mastered concepts"
                />
                <StatCard
                    icon={Trophy}
                    label="Need Practice"
                    value={stats.hardCards}
                    color="bg-red-600"
                    subtitle="Cards marked as hard"
                />
            </div>

            {/* Difficulty Breakdown */}
            {stats.cardsReviewed > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Difficulty Distribution</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Easy</span>
                                <span className="font-medium text-green-600">{stats.easyCards} cards</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all"
                                    style={{ width: `${(stats.easyCards / stats.cardsReviewed) * 100}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Medium</span>
                                <span className="font-medium text-yellow-600">{stats.mediumCards} cards</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-yellow-500 h-2 rounded-full transition-all"
                                    style={{ width: `${(stats.mediumCards / stats.cardsReviewed) * 100}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Hard</span>
                                <span className="font-medium text-red-600">{stats.hardCards} cards</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-red-500 h-2 rounded-full transition-all"
                                    style={{ width: `${(stats.hardCards / stats.cardsReviewed) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatsDashboard;
