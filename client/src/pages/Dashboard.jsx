import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getStudyHistory } from '../services/api';
import { BookOpen, Plus, Sparkles, Layers, Target, TrendingUp, FileText } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { motion } from 'framer-motion';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = () => {
  const { user } = useAuth();
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
        const data = await getStudyHistory();
        setHistory(data || []);
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user, navigate]);

  const totalCards = history.reduce((sum, s) => sum + (s.flashcards?.length || s.card_count || 0), 0);
  const totalQuestions = history.reduce((sum, s) => sum + (s.quiz?.length || 0), 0);
  const userName = user?.user?.name || user?.user_metadata?.full_name || 'there';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-10 h-10 mx-auto mb-4">
            <div className="absolute inset-0 border-2 border-[var(--border)] rounded-full" />
            <div className="absolute inset-0 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium text-[var(--text-muted)]">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--text-muted)] font-mono">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
              {getGreeting()}, {userName}
            </h1>
          </div>
          <button
            onClick={() => document.querySelector('input[type="file"]')?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--accent-light)] transition-mindflow glow-shadow self-start sm:self-auto"
          >
            <Plus size={16} /> New Session
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-5"
      >
        {/* Upload — 3 cols */}
        <div className="lg:col-span-3 glass-card rounded-2xl overflow-hidden">
          <div className="px-6 pt-6 pb-2">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-[var(--accent)]" />
              <span className="text-xs font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Quick Start
              </span>
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Upload notes or lecture PDF to generate study materials
            </p>
          </div>
          <FileUpload />
        </div>

        {/* Stats grid — 2 cols */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {[
            { icon: Layers, label: 'Sessions', value: history.length },
            { icon: BookOpen, label: 'Flashcards', value: totalCards },
            { icon: Target, label: 'Questions', value: totalQuestions },
            {
              icon: TrendingUp,
              label: 'Active Rate',
              value: history.length > 0 ? `${Math.min(history.length * 15, 100)}%` : '—',
              accent: true,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`glass-card rounded-xl p-5 flex flex-col justify-between transition-mindflow ${
                stat.accent ? 'bg-[var(--accent)]/10 border-[var(--border-accent)]' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-auto ${
                  stat.accent ? 'bg-[var(--accent)]/20' : 'bg-[var(--bg-elevated)]'
                }`}
              >
                <stat.icon
                  size={16}
                  className={stat.accent ? 'text-[var(--accent-light)]' : 'text-[var(--text-secondary)]'}
                />
              </div>
              <div className="mt-4">
                <div
                  className={`font-mono text-2xl font-bold tracking-tight leading-none ${
                    stat.accent ? 'text-[var(--accent-light)]' : 'text-[var(--text-primary)]'
                  }`}
                >
                  {stat.value}
                </div>
                <div
                  className={`text-xs font-medium mt-1 ${
                    stat.accent ? 'text-[var(--accent-light)]/80' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
