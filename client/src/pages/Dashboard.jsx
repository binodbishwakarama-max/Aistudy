import React, { useEffect, useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock3, Layers, Plus, Sparkles, Target, TrendingUp } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { getStudyHistory } from '../services/api';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(value));

const Dashboard = () => {
  const { user } = useAuth();
  const { gameState } = useGamification();
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
      } catch (error) {
        console.error('Failed to load history', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, navigate]);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';
  const totalCards = useMemo(
    () => history.reduce((sum, session) => sum + (session.flashcards?.length || session.card_count || 0), 0),
    [history],
  );
  const totalQuestions = useMemo(
    () => history.reduce((sum, session) => sum + (session.question_count || session.quiz?.length || 0), 0),
    [history],
  );
  const recentSessions = history.slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="section-shell w-full max-w-md p-8 text-center">
          <div className="relative mx-auto mb-4 h-10 w-10">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          </div>
          <h2 className="font-heading text-2xl font-bold">Loading your dashboard</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Pulling in your recent sessions and progress.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { icon: Layers, label: 'Sessions', value: history.length },
    { icon: BookOpen, label: 'Flashcards', value: totalCards },
    { icon: Target, label: 'Questions', value: totalQuestions },
    { icon: TrendingUp, label: 'Streak', value: `${gameState.streak}d` },
  ];

  return (
    <div className="space-y-6">
      <Motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="section-shell p-6 sm:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="pill-badge">
              <Sparkles size={14} className="text-[var(--accent)]" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <h1 className="font-heading mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              {getGreeting()}, {userName}
            </h1>
            <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
              Upload new material, continue a saved session, or check your study progress from one simple dashboard.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => document.querySelector('input[type="file"]')?.click()} className="primary-button justify-center">
                <Plus size={18} />
                Upload a source
              </button>
              <button onClick={() => navigate('/study')} className="secondary-button justify-center">
                Open study space
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[420px] lg:grid-cols-1">
            <div className="glass-card p-5">
              <div className="text-sm font-medium text-[var(--text-muted)]">Current XP</div>
              <div className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">{gameState.xp}</div>
            </div>
            <div className="glass-card p-5">
              <div className="text-sm font-medium text-[var(--text-muted)]">Level</div>
              <div className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">{gameState.level}</div>
            </div>
            <div className="glass-card p-5">
              <div className="text-sm font-medium text-[var(--text-muted)]">Last session</div>
              <div className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                {history[0]?.created_at ? formatDate(history[0].created_at) : 'No activity yet'}
              </div>
            </div>
          </div>
        </div>
      </Motion.section>

      <Motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.3 }}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-elevated)] text-[var(--accent)]">
              <stat.icon size={18} />
            </div>
            <div className="mt-5 text-3xl font-semibold text-[var(--text-primary)]">{stat.value}</div>
            <div className="mt-2 text-sm text-[var(--text-secondary)]">{stat.label}</div>
          </div>
        ))}
      </Motion.section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.3 }}
          className="section-shell overflow-hidden"
        >
          <div className="border-b border-[var(--border)] px-6 pb-4 pt-6 sm:px-8">
            <div className="kicker">Upload</div>
            <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight">Add a new study source</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
              Drop in a PDF or text file and move straight into cards, quiz mode, or a review sheet.
            </p>
          </div>
          <FileUpload />
        </Motion.section>

        <Motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.3 }}
          className="section-shell p-6 sm:p-8"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="kicker">Recent sessions</div>
              <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight">Continue where you left off</h2>
            </div>
            <button onClick={() => navigate('/study')} className="secondary-button hidden px-5 py-3 text-sm sm:inline-flex">
              Open library
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => navigate('/study')}
                  className="glass-card w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-base font-semibold text-[var(--text-primary)]">{session.title}</div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
                        <span className="info-chip">{formatDate(session.created_at)}</span>
                        <span className="info-chip">{session.card_count ?? session.flashcards?.length ?? 0} cards</span>
                        <span className="info-chip">{session.question_count ?? session.quiz?.length ?? 0} questions</span>
                      </div>
                    </div>
                    <ArrowRight size={18} className="mt-1 flex-shrink-0 text-[var(--text-muted)]" />
                  </div>
                </button>
              ))
            ) : (
              <div className="glass-card p-6 text-center">
                <h3 className="text-xl font-semibold">No saved sessions yet</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Upload your first source to start building your study library.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-2xl bg-[var(--bg-elevated)] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--accent)] shadow-[var(--shadow-soft)]">
                <Clock3 size={18} />
              </div>
              <div>
                <div className="text-base font-semibold">Want a quick progress check?</div>
                <div className="mt-1 text-sm leading-7 text-[var(--text-secondary)]">
                  Open the stats page to see activity, study time, and retention trends.
                </div>
              </div>
            </div>
            <button onClick={() => navigate('/stats')} className="secondary-button mt-5 w-full justify-center text-sm">
              View analytics
            </button>
          </div>
        </Motion.section>
      </div>
    </div>
  );
};

export default Dashboard;
