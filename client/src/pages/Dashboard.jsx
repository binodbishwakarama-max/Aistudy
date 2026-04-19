import React, { useEffect, useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Clock3,
  FileStack,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { getStudyHistory } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { useStudy } from '../context/StudyContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = () => {
  const { user } = useAuth();
  const { gameState } = useGamification();
  const { loadDeck } = useStudy();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchHistory = async () => {
      try {
        const data = await getStudyHistory();
        if (!active) return;
        setHistory(data || []);
      } catch (error) {
        console.error('Failed to load history', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      active = false;
    };
  }, []);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';
  const totalCards = useMemo(
    () => history.reduce((sum, session) => sum + (session.flashcards?.length || session.card_count || 0), 0),
    [history],
  );
  const totalQuestions = useMemo(
    () => history.reduce((sum, session) => sum + (session.question_count || session.quiz?.length || 0), 0),
    [history],
  );
  const statCards = [
    { label: 'Notes uploaded', value: history.length, icon: FileStack },
    { label: 'Flashcards created', value: totalCards, icon: BookOpen },
    { label: 'Quiz questions', value: totalQuestions, icon: BrainCircuit },
    { label: 'Current streak', value: `${gameState.streak} days`, icon: TrendingUp },
  ];

  const openSession = async (sessionId) => {
    await loadDeck(sessionId);
    navigate('/flashcards');
  };

  if (loading) {
    return (
      <div className="grid gap-6">
        <Card className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 rounded-full bg-[var(--bg-elevated)]" />
            <div className="h-14 w-2/3 rounded-2xl bg-[var(--bg-elevated)]" />
            <div className="h-5 w-full rounded-full bg-[var(--bg-elevated)]" />
            <div className="h-5 w-3/4 rounded-full bg-[var(--bg-elevated)]" />
          </div>
        </Card>
        <div className="grid gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="animate-pulse p-6">
              <div className="h-11 w-11 rounded-2xl bg-[var(--bg-elevated)]" />
              <div className="mt-5 h-8 w-16 rounded-xl bg-[var(--bg-elevated)]" />
              <div className="mt-3 h-4 w-24 rounded-full bg-[var(--bg-elevated)]" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card variant="accent" className="overflow-hidden p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl">
              <div className="pill-badge">
                <Sparkles size={14} className="text-[var(--accent)]" />
                Overview
              </div>
              <h1 className="font-heading mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
                {getGreeting()}, {userName}
              </h1>
              <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
                Your study workspace is ready. Upload new material, jump into flashcards, or check how your quiz
                accuracy is trending.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" leftIcon={Upload} onClick={() => navigate('/upload')}>
                  Upload Notes
                </Button>
                <Button size="lg" variant="secondary" rightIcon={ArrowRight} onClick={() => navigate('/flashcards')}>
                  Open Flashcards
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <Card className="p-5">
                <div className="text-sm font-medium text-[var(--text-muted)]">Current XP</div>
                <div className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">{gameState.xp}</div>
              </Card>
              <Card className="p-5">
                <div className="text-sm font-medium text-[var(--text-muted)]">Level</div>
                <div className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">{gameState.level}</div>
              </Card>
              <Card className="p-5">
                <div className="text-sm font-medium text-[var(--text-muted)]">Most recent session</div>
                <div className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
                  {history[0]?.created_at ? formatDate(history[0].created_at) : 'No activity yet'}
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </Motion.section>

      <Motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-[var(--accent)]">
                <stat.icon size={20} />
              </div>
              <div className="mt-5 text-3xl font-semibold text-[var(--text-primary)]">{stat.value}</div>
              <div className="mt-2 text-sm text-[var(--text-secondary)]">{stat.label}</div>
            </Card>
          ))}
        </div>
      </Motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="kicker">Recent activity</div>
                <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight">Continue where you left off</h2>
              </div>
              <Button variant="ghost" onClick={() => navigate('/study')}>
                Open library
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              {history.length > 0 ? (
                history.slice(0, 5).map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => openSession(session.id)}
                    className="w-full rounded-[24px] border border-[var(--border)] bg-[var(--bg-card)] px-5 py-4 text-left transition-mindflow hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-raised)]"
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
                <Card variant="muted" className="p-8 text-center">
                  <h3 className="text-xl font-semibold">No study sessions yet</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    Upload your first PDF or note set to start generating flashcards and quizzes.
                  </p>
                  <Button className="mt-6" leftIcon={Upload} onClick={() => navigate('/upload')}>
                    Upload your first source
                  </Button>
                </Card>
              )}
            </div>
          </Card>
        </Motion.section>

        <Motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <div className="grid gap-6">
            <Card className="p-6 sm:p-8">
              <div className="kicker">Quick actions</div>
              <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight">Move into the next study block fast.</h2>
              <div className="mt-6 grid gap-4">
                {[
                  {
                    title: 'Upload new notes',
                    description: 'Import a new source and generate fresh material.',
                    icon: Upload,
                    action: () => navigate('/upload'),
                  },
                  {
                    title: 'Run flashcards',
                    description: 'Jump into active recall from your current session.',
                    icon: BookOpen,
                    action: () => navigate('/flashcards'),
                  },
                  {
                    title: 'Check quiz accuracy',
                    description: 'See your performance and weekly momentum.',
                    icon: Target,
                    action: () => navigate('/analytics'),
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={item.action}
                    className="rounded-[24px] border border-[var(--border)] bg-[var(--bg-card)] px-5 py-4 text-left transition-mindflow hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-raised)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-[var(--accent)]">
                        <item.icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-base font-semibold text-[var(--text-primary)]">{item.title}</div>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{item.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card variant="accent" className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-card)] text-[var(--accent)] shadow-[var(--shadow-soft)]">
                  <Clock3 size={20} />
                </div>
                <div>
                  <div className="text-base font-semibold text-[var(--text-primary)]">Need a quick progress check?</div>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                    Open analytics to review accuracy, total study time, and how often you are showing up.
                  </p>
                  <Button variant="secondary" className="mt-5" onClick={() => navigate('/analytics')}>
                    View analytics
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </Motion.section>
      </div>
    </div>
  );
};

export default Dashboard;
