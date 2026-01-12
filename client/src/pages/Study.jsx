import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { useAuth } from '../context/AuthContext';
import { Layers, HelpCircle, AlertTriangle, Save, CheckCircle, FileText, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import Quiz from '../components/Quiz';
import ReviewSheet from '../components/ReviewSheet';
import StatsDashboard from '../components/StatsDashboard';
import axios from 'axios';

let envUrl = import.meta.env.VITE_API_URL || 'https://mindflow-api-k5ex.onrender.com/api';
if (envUrl.endsWith('/')) envUrl = envUrl.slice(0, -1);
if (!envUrl.endsWith('/api')) envUrl += '/api';
const API_URL = envUrl;

const Study = () => {
    const { text, flashcards, quiz, generateFlashcards, generateQuiz, loading, error } = useStudy();
    const { user } = useAuth();
    const [mode, setMode] = useState('quiz');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const navigate = useNavigate();

    const handleSave = async () => {
        if (!user) return navigate('/login');
        setSaving(true);
        try {
            const token = user.token;
            await axios.post(`${API_URL}/study/save`, {
                title: 'Study Session ' + new Date().toLocaleDateString(),
                originalText: text,
                flashcards,
                quiz
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Failed to save', error);
            alert('Failed to save progress');
        } finally {
            setSaving(false);
        }
    };

    if (!text) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Content Uploaded</h2>
                <p className="text-gray-600 mb-6">Please upload a document to start studying.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Go to Upload
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Your Study Session</h1>
                {(flashcards.length > 0 || quiz.length > 0) && (
                    <button
                        onClick={handleSave}
                        disabled={saving || saved}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${saved
                            ? 'bg-green-100 text-green-700'
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                            }`}
                    >
                        {saved ? <CheckCircle size={18} /> : <Save size={18} />}
                        {saved ? 'Saved!' : 'Save Progress'}
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertTriangle size={20} />
                    <p>{error}</p>
                </div>
            )}

            <div className="flex justify-center gap-4 mb-8 flex-wrap">
                <button
                    onClick={() => setMode('quiz')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${mode === 'quiz'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    <HelpCircle size={20} />
                    Quiz Mode
                </button>
                <button
                    onClick={() => setMode('flashcards')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${mode === 'flashcards'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    <Layers size={20} />
                    Flashcards
                </button>
                <button
                    onClick={() => setMode('review')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${mode === 'review'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    <FileText size={20} />
                    Cheat Sheet
                </button>
                <button
                    onClick={() => setMode('stats')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${mode === 'stats'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    <BarChart size={20} />
                    Statistics
                </button>
            </div>

            <div className="min-h-[400px]">
                {mode === 'flashcards' && (
                    <div className="animate-fade-in">
                        {flashcards.length === 0 ? (
                            <div className="text-center py-20">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Generate Flashcards?</h3>
                                <button
                                    onClick={generateFlashcards}
                                    disabled={loading}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Generating...' : 'Generate with AI'}
                                </button>
                            </div>
                        ) : (
                            <Flashcard cards={flashcards} />
                        )}
                    </div>
                )}

                {mode === 'quiz' && (
                    <div className="animate-fade-in">
                        {quiz.length === 0 ? (
                            <div className="text-center py-20">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready for a Challenge?</h3>
                                <button
                                    onClick={generateQuiz}
                                    disabled={loading}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Generating...' : 'Generate Quiz'}
                                </button>
                            </div>
                        ) : (
                            <Quiz questions={quiz} />
                        )}
                    </div>
                )}

                {mode === 'review' && (
                    <div className="animate-fade-in">
                        <ReviewSheet flashcards={flashcards} />
                    </div>
                )}

                {mode === 'stats' && (
                    <div className="animate-fade-in">
                        <StatsDashboard />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Study;
