import React, { useEffect, useMemo, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
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
  Search,
  Loader2,
  Trophy,
} from 'lucide-react';
import { getStudyHistory, searchFlashcards } from '../services/api';
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

  // Semantic Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced Search Effect
  useEffect(() => {
    let cancelled = false;
    const handler = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults(null);
        return;
      }

      setIsSearching(true);
      try {
        const res = await searchFlashcards(searchQuery);
        if (cancelled) return;
        setSearchResults(res.results || []);
      } catch (err) {
        if (!cancelled) console.error("Semantic search failed", err);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => {
      cancelled = true;
      clearTimeout(handler);
    };
  }, [searchQuery]);

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

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
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

  // --- Zero-State Onboarding UX ---
  if (history.length === 0 && !searchQuery.trim()) {
    return (
      <Motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
        <Card className="relative overflow-hidden p-8 sm:p-12 border-0 bg-[linear-gradient(135deg,var(--bg-card),var(--bg-elevated))] shadow-[var(--shadow-raised)]">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[rgba(26,115,232,0.12)] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[rgba(242,153,0,0.1)] blur-3xl" />
          
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-[var(--bg-card)] shadow-[var(--shadow-soft)] border border-[var(--border)] mb-8">
              <Sparkles size={36} className="text-[var(--accent)]" />
            </div>
            
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-[var(--text-primary)]">
              Welcome to MindFlow, {userName}!
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--text-secondary)] max-w-2xl mx-auto">
              Your AI-powered workspace is ready. To begin, upload your first piece of raw material—like a lecture PDF or course notes—and we'll instantly generate smart flashcards and quizzes for you.
            </p>
            
            <div className="mt-10 flex flex-col justify-center sm:flex-row gap-4">
              <Button size="lg" leftIcon={Upload} onClick={() => navigate('/upload')} className="w-full sm:w-auto h-14 px-8 text-base shadow-[var(--shadow-raised)]">
                Upload your first PDF
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { step: '01', title: 'Import Material', desc: 'Securely upload your PDFs or paste text notes. We handle the formatting.', icon: FileStack },
            { step: '02', title: 'Generate Assets', desc: 'MindFlow extracts the key concepts into active recall flashcards instantly.', icon: BookOpen },
            { step: '03', title: 'Master Topics', desc: 'Jump into focused quiz sessions to verify your knowledge and track XP.', icon: Target }
          ].map((item, i) => (
            <Motion.div key={item.step} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + (i * 0.1) }}>
              <Card className="h-full p-6 transition-mindflow hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-raised)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-[var(--accent)]">
                    <item.icon size={22} />
                  </div>
                  <div className="text-xs font-bold tracking-widest text-[var(--text-muted)]">STEP {item.step}</div>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.desc}</p>
              </Card>
            </Motion.div>
          ))}
        </div>
      </Motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Spotlight Semantic Search Bar Section */}
      <Motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative w-full mb-8">
        <div className="relative z-[110]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--text-muted)]">
            <Search size={20} />
          </div>
          <input
            type="text"
            className="h-14 w-full rounded-2xl border border-[var(--border)] bg-[rgba(16,18,27,0.7)] backdrop-blur-xl pl-12 pr-12 text-base text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition-all focus:border-[var(--accent)] focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/10"
            placeholder="Spotlight Search: find concepts, decks, or definitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--accent)]">
              <Loader2 size={20} className="animate-spin" />
            </div>
          )}
        </div>

        {/* Search Results Dropdown Overlay */}
        <AnimatePresence>
          {searchResults !== null && searchQuery.trim() !== '' && (
            <>
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[rgba(5,6,9,0.8)] backdrop-blur-sm z-[100]"
                onClick={() => { setSearchQuery(''); setSearchResults(null); }}
              />
              <Motion.div
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="absolute left-0 right-0 top-full mt-3 z-[110] w-full"
              >
                <Card className="overflow-hidden shadow-2xl p-0 border border-[rgba(255,255,255,0.08)] rounded-2xl bg-[rgba(16,18,27,0.95)] backdrop-blur-2xl">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)]">
                    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Concept Matches</span>
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(''); setSearchResults(null); }}
                      className="text-xs text-[var(--text-muted)] hover:text-white transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="overflow-y-auto max-h-[50vh] divide-y divide-[rgba(255,255,255,0.05)]">
                      {searchResults.map((card) => (
                        <div key={card.id} className="p-5 hover:bg-[rgba(255,255,255,0.02)] transition-colors flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-[rgba(99,102,241,0.15)] text-[var(--accent-light)] border border-[rgba(99,102,241,0.2)] rounded-full">
                                {Math.round(card.similarity * 100)}% Match
                              </span>
                            </div>
                            <div className="font-semibold text-white text-sm">Q: {card.front}</div>
                            <div className="text-[var(--text-secondary)] text-xs mt-1">A: {card.back}</div>
                            {card.explanation && (
                              <div className="text-[11px] text-[var(--text-muted)] italic mt-1.5">{card.explanation}</div>
                            )}
                          </div>
                          <Button variant="secondary" size="sm" onClick={() => openSession(card.deck_id)} className="flex-shrink-0">
                            Go to Deck
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-sm text-[var(--text-muted)] font-medium">
                      No matching concepts found for "{searchQuery}"
                    </div>
                  )}
                </Card>
              </Motion.div>
            </>
          )}
        </AnimatePresence>
      </Motion.div>

      {/* Main Grid Header Area */}
      <Motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card variant="accent" className="overflow-hidden p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border-accent)] bg-[rgba(99,102,241,0.07)] text-xs text-[var(--accent-light)] font-medium">
                <Sparkles size={12} className="text-[var(--accent)]" />
                <span>AI Study Workspace</span>
              </div>
              <h1 className="font-heading mt-5 text-3xl font-bold tracking-tight sm:text-5xl text-white">
                {getGreeting()}, {userName}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                Ready to level up your understanding? Drop in new lecture files, run an active recall review block, or analyze your streak statistics.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" leftIcon={Upload} onClick={() => navigate('/upload')} className="shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                  Upload Notes
                </Button>
                <Button size="lg" variant="secondary" rightIcon={ArrowRight} onClick={() => navigate('/flashcards')}>
                  Open Flashcards
                </Button>
              </div>
            </div>

            <div className="grid gap-3 grid-cols-3 lg:grid-cols-1 mt-6 lg:mt-0">
              <Card className="p-4 bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.03)]">
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Accumulated XP</div>
                <div className="mt-2 text-2xl font-bold text-white">{gameState.xp}</div>
              </Card>
              <Card className="p-4 bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.03)]">
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Level Progress</div>
                <div className="mt-2 text-2xl font-bold text-[var(--accent-light)]">Lv. {gameState.level}</div>
              </Card>
              <Card className="p-4 bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.03)]">
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Last Revision</div>
                <div className="mt-2 text-xs font-semibold text-[var(--text-secondary)] truncate">
                  {history[0]?.created_at ? formatDate(history[0].created_at) : 'No sessions yet'}
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </Motion.section>

      {/* Stats Counter Row */}
      <Motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-strong)] text-[var(--accent)]">
                <stat.icon size={18} />
              </div>
              <div className="mt-4 text-2xl font-bold text-white">{stat.value}</div>
              <div className="mt-1 text-xs text-[var(--text-muted)] font-medium">{stat.label}</div>
            </Card>
          ))}
        </div>
      </Motion.section>

      {/* Main Grid: Split Layout */}
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        {/* Left Side: Recent Activity */}
        <Motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
              <div>
                <div className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider">Recent Activity</div>
                <h2 className="font-heading text-2xl font-bold text-white mt-1">Continue Revision</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/study')}>
                Open Library
              </Button>
            </div>

            <div className="space-y-3">
              {history.length > 0 ? (
                history.slice(0, 4).map((session) => (
                  <Motion.button
                    key={session.id}
                    type="button"
                    onClick={() => openSession(session.id)}
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-4 text-left transition-all hover:border-[var(--border-strong)]"
                    whileHover={{ scale: 1.015, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-base font-bold text-white">{session.title}</div>
                        <div className="mt-2.5 flex flex-wrap gap-2 text-[10px] text-[var(--text-muted)] font-medium">
                          <span className="px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">{formatDate(session.created_at)}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[rgba(99,102,241,0.08)] text-[var(--accent-light)] border border-[rgba(99,102,241,0.15)]">{session.card_count ?? session.flashcards?.length ?? 0} cards</span>
                          <span className="px-2 py-0.5 rounded-full bg-[rgba(245,158,11,0.08)] text-[var(--warm)] border border-[rgba(245,158,11,0.15)]">{session.question_count ?? session.quiz?.length ?? 0} questions</span>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-[var(--text-muted)] flex-shrink-0" />
                    </div>
                  </Motion.button>
                ))
              ) : (
                <Card variant="muted" className="p-8 text-center border-dashed border-[var(--border)]">
                  <h3 className="text-lg font-bold text-white">No study sessions yet</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                    Upload your first course document or lecture PDF to start.
                  </p>
                  <Button className="mt-5" leftIcon={Upload} onClick={() => navigate('/upload')}>
                    Upload Document
                  </Button>
                </Card>
              )}
            </div>
          </Card>
        </Motion.section>

        {/* Right Side: Quick Actions & Gamification Badge */}
        <Motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Quick Actions Panel */}
          <Card className="p-6 sm:p-8">
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Quick Links</div>
            <h2 className="font-heading text-2xl font-bold text-white mb-6">Study Operations</h2>
            
            <div className="grid gap-3">
              {[
                {
                  title: 'Upload fresh materials',
                  desc: 'Import course files or slides.',
                  icon: Upload,
                  action: () => navigate('/upload'),
                },
                {
                  title: 'Run active recall cards',
                  desc: 'Study prompt decks with spaced recall.',
                  icon: BookOpen,
                  action: () => navigate('/flashcards'),
                },
                {
                  title: 'Check stats & trend indicators',
                  desc: 'View weekly progress charts.',
                  icon: Target,
                  action: () => navigate('/analytics'),
                },
              ].map((item) => (
                <Motion.button
                  key={item.title}
                  type="button"
                  onClick={item.action}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-4 text-left transition-all hover:border-[var(--border-strong)]"
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--bg-strong)] text-[var(--accent)] border border-[rgba(99,102,241,0.15)]">
                      <item.icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-white">{item.title}</div>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">{item.desc}</p>
                    </div>
                  </div>
                </Motion.button>
              ))}
            </div>
          </Card>

          {/* Gamification Streak Callout */}
          <Card variant="accent" className="p-6 sm:p-8 relative overflow-hidden">
            <div className="pointer-events-none absolute -right-16 -top-16 w-32 h-32 rounded-full bg-[rgba(245,158,11,0.12)] blur-2xl" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[rgba(245,158,11,0.12)] text-[var(--warm)] border border-[rgba(245,158,11,0.2)] shadow-sm">
                <Clock3 size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white">Daily Streak Active</h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                  Keep showing up daily to secure your study multiplier and gain extra XP on every reviewed card.
                </p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/analytics')}>
                  View Progress Log
                </Button>
              </div>
            </div>
          </Card>
        </Motion.section>
      </div>
    </div>
  );
};

export default Dashboard;
