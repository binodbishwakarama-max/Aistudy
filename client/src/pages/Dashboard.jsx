import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStudy } from '../context/StudyContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, BookOpen, ChevronRight, Activity } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Dashboard = () => {
    const { user } = useAuth();
    const { loadSession } = useStudy();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchHistory = async () => {
            try {
                const response = await axios.get(`${API_URL}/study/history`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setHistory(response.data);
            } catch (error) {
                console.error("Failed to load history", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user, navigate]);

    const handleResume = (session) => {
        loadSession(session);
        navigate('/study');
    };

    if (loading) return <div className="text-center py-20">Loading your progress...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.user?.name || 'Student'}!</h1>
                    <p className="text-gray-500 mt-2">Here are your saved study sessions.</p>
                </div>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Activity size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Study Sessions Yet</h3>
                    <p className="text-gray-500 mb-6">Upload a document to start your first session.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                    >
                        Create New Session
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {history.map((session) => (
                        <div
                            key={session._id}
                            onClick={() => handleResume(session)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <BookOpen size={24} />
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    {new Date(session.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{session.title}</h3>

                            <div className="flex gap-4 text-sm text-gray-500 mt-4">
                                <span className="flex items-center gap-1">
                                    <span className="font-bold text-gray-900">{session.flashcards?.length || 0}</span> Cards
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="font-bold text-gray-900">{session.quiz?.length || 0}</span> Questions
                                </span>
                            </div>

                            <button className="w-full mt-6 py-2 text-indigo-600 font-bold bg-indigo-50 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                                Resume Session <ChevronRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
