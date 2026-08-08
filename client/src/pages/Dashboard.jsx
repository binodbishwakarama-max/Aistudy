import React, { useEffect, useMemo, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Loader2,
  Search,
  Upload,
} from 'lucide-react';
import { getDueSummary, getStudyHistory, searchFlashcards } from '../services/api';
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
  const [dueSummary, setDueSummary] = useState({ dueCount: 0, dueTomorrow: 0, dueByDeck: [] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults(null);
        return;
      }
      setIsSearching(true);
      try {
        const res = await searchFlashcards(searchQuery);
        setSearchResults(res.results || []);
      } catch (err) {
        console.error('Semantic search failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    let active = true;

    const fetchDashboard = async () => {
      try {
        const [historyData, dueData] = await Promise.all([
          getStudyHistory(),
          getDueSummary().catch(() => ({ dueCount: 0, dueTomorrow: 0, dueByDeck: [] })),
        ]);

        if (!active) return;
        setHistory(historyData || []);
        setDueSummary(dueData || { dueCount: 0, dueTomorrow: 0, dueByDeck: [] });
      } catch (error) {
        console.error('Failed to load dashboard', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      active = false;
    };
  }, []);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
  const totalCards = useMemo(
    () => history.reduce((sum, session) => sum + (session.flashcards?.length || session.card_count || 0), 0),
    [history],
  );

  const topDueDeck = dueSummary.dueByDeck?.[0];
  const continueDeck = topDueDeck
    ? history.find((session) => session.id === topDueDeck.deckId) || { id: topDueDeck.deckId, title: topDueDeck.title }
    : history[0];

  const openSession = async (sessionId) => {
    await loadDeck(sessionId);
    navigate('/flashcards');
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 rounded-lg bg-[rgba(0,0,0,0.06)]" />
        <div className="h-28 rounded-[var(--radius-xl)] bg-[rgba(0,0,0,0.04)]" />
        <div className="h-48 rounded-[var(--radius-xl)] bg-[rgba(0,0,0,0.04)]" />
      </div>
    );
  }

  if (history.length === 0 && !searchQuery.trim()) {
    return (
      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-xl py-8 text-center sm:py-16"
      >
        <p className="kicker">{getGreeting()}</p>
        <h1 className="font-heading mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome, {userName}
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          Upload a lecture PDF — we&apos;ll parse it, generate flashcards, and open study mode automatically.
        </p>
        <Button
          size="lg"
          leftIcon={Upload}
          onClick={() => navigate('/upload')}
          className="mt-8"
        >
          Upload your first PDF
        </Button>
      </Motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-[var(--text-muted)]">{getGreeting()}</p>
          <h1 className="font-heading mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{userName}</h1>
        </div>
        <div className="relative w-full sm:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--text-muted)]">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] pl-11 pr-11 text-sm text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition-shadow focus:border-[var(--accent)] focus:outline-none focus:ring-4 focus:ring-[var(--accent-glow)]"
            placeholder="Search concepts across your decks…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--accent)]">
              <Loader2 size={18} className="animate-spin" />
            </div>
          )}

          <AnimatePresence>
            {searchResults !== null && searchQuery.trim() !== '' && (
              <>
                <Motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-[rgba(29,29,31,0.25)]"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults(null);
                  }}
                />
                <Motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 right-0 top-full z-[110] mt-2"
                >
                  <Card className="overflow-hidden p-0 shadow-[var(--shadow-raised)]">
                    <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Matches
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults(null);
                        }}
                        className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      >
                        Clear
                      </button>
                    </div>
                    {searchResults.length > 0 ? (
                      <div className="max-h-[50vh] divide-y divide-[var(--border)] overflow-y-auto">
                        {searchResults.map((card) => (
                          <div key={card.id} className="flex items-start justify-between gap-4 p-4">
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-semibold text-[var(--accent)]">
                                {Math.round(card.similarity * 100)}% match
                              </span>
                              <div className="mt-1 text-sm font-semibold">{card.front}</div>
                              <div className="mt-1 text-xs text-[var(--text-secondary)]">{card.back}</div>
                            </div>
                            <Button variant="secondary" size="sm" onClick={() => openSession(card.deck_id)}>
                              Open
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-[var(--text-muted)]">
                        No matches for “{searchQuery}”
                      </div>
                    )}
                  </Card>
                </Motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-soft)] sm:p-8"
      >
        <p className="kicker">Up next</p>
        {dueSummary.dueCount > 0 && continueDeck ? (
          <>
            <h2 className="font-heading mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {dueSummary.dueCount} card{dueSummary.dueCount === 1 ? '' : 's'} due · continue “{continueDeck.title}”
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
              {dueSummary.dueTomorrow > 0
                ? `${dueSummary.dueTomorrow} more scheduled for tomorrow.`
                : 'Spaced repetition is keeping your review queue tight.'}
            </p>
          </>
        ) : continueDeck ? (
          <>
            <h2 className="font-heading mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Continue “{continueDeck.title}”
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
              {continueDeck.created_at
                ? `Last opened ${formatDate(continueDeck.created_at)}. You're caught up on due cards.`
                : 'Pick up flashcards or jump into a quiz.'}
            </p>
          </>
        ) : (
          <>
            <h2 className="font-heading mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Start a study session</h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
              Upload material or open your library to begin.
            </p>
          </>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {continueDeck && (
            <Button size="lg" rightIcon={ArrowRight} onClick={() => openSession(continueDeck.id)}>
              {dueSummary.dueCount > 0 ? 'Study due cards' : 'Continue studying'}
            </Button>
          )}
          <Button size="lg" variant="secondary" leftIcon={Upload} onClick={() => navigate('/upload')}>
            Upload notes
          </Button>
          <Button size="lg" variant="ghost" leftIcon={BookOpen} onClick={() => navigate('/study')}>
            Open library
          </Button>
        </div>

        {dueSummary.dueCount > 0 && (
          <p className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Clock size={14} />
            {dueSummary.dueCount} cards ready for review across {dueSummary.dueByDeck.length} deck{dueSummary.dueByDeck.length === 1 ? '' : 's'}
          </p>
        )}
      </Motion.section>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Progress</p>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold tabular-nums">{history.length}</div>
              <div className="mt-1 text-sm text-[var(--text-muted)]">Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums">{totalCards}</div>
              <div className="mt-1 text-sm text-[var(--text-muted)]">Cards</div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums">{dueSummary.dueCount}</div>
              <div className="mt-1 text-sm text-[var(--text-muted)]">Due now</div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums">{gameState.streak}d</div>
              <div className="mt-1 text-sm text-[var(--text-muted)]">Streak</div>
            </div>
          </div>
          <Button variant="ghost" className="mt-6 px-0" rightIcon={ArrowRight} onClick={() => navigate('/analytics')}>
            View progress
          </Button>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold tracking-tight">Recent sessions</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/study')}>
              Library
            </Button>
          </div>
          <div className="space-y-2">
            {history.slice(0, 5).map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => openSession(session.id)}
                className="flex w-full items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-4 text-left transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface)]"
              >
                <div className="min-w-0">
                  <div className="truncate font-semibold">{session.title}</div>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">
                    {formatDate(session.created_at)} · {session.card_count ?? session.flashcards?.length ?? 0} cards
                  </div>
                </div>
                <ArrowRight size={16} className="flex-shrink-0 text-[var(--text-muted)]" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
