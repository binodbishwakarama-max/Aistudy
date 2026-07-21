import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileStack,
  Loader2,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { getStudyHistory, searchFlashcards } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { useStudy } from '../context/StudyContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const formatDate = (value) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(value));

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const handler = window.setTimeout(async () => {
      const query = searchQuery.trim();
      if (!query) {
        setSearchResults(null);
        return;
      }

      setIsSearching(true);
      try {
        const response = await searchFlashcards(query);
        if (!cancelled) setSearchResults(response.results || []);
      } catch (error) {
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    let active = true;
    const loadHistory = async () => {
      try {
        const data = await getStudyHistory();
        if (active) setHistory(data || []);
      } catch (error) {
        if (active) setHistory([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadHistory();
    return () => { active = false; };
  }, []);

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student';
  const totalCards = useMemo(() => history.reduce((total, session) => total + (session.flashcards?.length || session.card_count || 0), 0), [history]);
  const totalQuestions = useMemo(() => history.reduce((total, session) => total + (session.question_count || session.quiz?.length || 0), 0), [history]);
  const mostRecent = history[0];

  const openSession = async (sessionId) => {
    await loadDeck(sessionId);
    navigate('/flashcards');
  };

  const closeSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  if (loading) {
    return <div className="space-y-5"><div className="h-52 animate-pulse rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]" />)}</div></div>;
  }

  if (history.length === 0) {
    return (
      <Motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl">
        <Card className="overflow-hidden p-6 sm:p-10 lg:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="pill-badge"><Sparkles size={13} className="text-[var(--accent-light)]" /> Your workspace is ready</div>
              <h1 className="font-heading mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">Welcome, {userName}.<br /><span className="headline-accent">Let’s make your first study loop.</span></h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[var(--text-secondary)]">Start with the material you already have. We’ll help you transform it into reviewable cards and a quiz you can come back to.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button size="lg" leftIcon={Upload} onClick={() => navigate('/upload')}>Upload study material</Button><Button size="lg" variant="secondary" onClick={() => navigate('/study')}>Open empty library</Button></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { number: '01', title: 'Import', copy: 'PDFs, text files, and raw notes.', icon: FileStack },
                { number: '02', title: 'Generate', copy: 'Flashcards and quizzes from one source.', icon: BrainCircuit },
                { number: '03', title: 'Review', copy: 'Use active recall to build momentum.', icon: Target },
              ].map(({ number, title, copy, icon: Icon }) => <div key={number} className="flex gap-4 rounded-2xl border border-[var(--border)] bg-white/[0.025] p-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-strong)] text-[var(--accent-light)]"><Icon size={18} /></span><div><div className="text-[10px] font-bold tracking-[0.13em] text-[var(--text-faint)]">{number}</div><div className="mt-1 text-sm font-bold text-white">{title}</div><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{copy}</p></div></div>)}
            </div>
          </div>
        </Card>
      </Motion.div>
    );
  }

  const metrics = [
    { label: 'Study sources', value: history.length, detail: 'saved sessions', icon: FileStack, color: 'text-[var(--accent-light)]' },
    { label: 'Flashcards', value: totalCards, detail: 'ready to review', icon: BookOpen, color: 'text-cyan-300' },
    { label: 'Quiz questions', value: totalQuestions, detail: 'knowledge checks', icon: BrainCircuit, color: 'text-[var(--success)]' },
    { label: 'Current streak', value: `${gameState.streak}d`, detail: 'keep it going', icon: TrendingUp, color: 'text-[var(--warm)]' },
  ];

  return (
    <div className="space-y-5">
      <div className="relative z-30">
        <div className="relative">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="h-12 w-full rounded-xl border border-[var(--border)] bg-[rgba(15,23,42,0.68)] pl-11 pr-12 text-sm text-white shadow-[var(--shadow-soft)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10" placeholder="Search your study material, cards, and concepts..." aria-label="Search study material" />
          {isSearching && <Loader2 size={17} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[var(--accent-light)]" />}
        </div>
        <AnimatePresence>
          {searchResults !== null && searchQuery.trim() && <>
            <div className="fixed inset-0 z-20 bg-slate-950/50 backdrop-blur-[2px]" onClick={closeSearch} />
            <Motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute inset-x-0 top-[calc(100%+0.65rem)] z-30 overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[rgba(13,18,32,0.98)] shadow-[var(--shadow-raised)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3"><span className="text-xs font-semibold text-[var(--text-muted)]">Concept matches</span><button type="button" onClick={closeSearch} className="text-xs font-semibold text-[var(--accent-light)]">Clear</button></div>
              {searchResults.length ? <div className="max-h-[50vh] overflow-y-auto">{searchResults.map((card) => <button key={card.id} type="button" onClick={() => openSession(card.deck_id)} className="flex w-full items-start justify-between gap-4 border-b border-[var(--border)] px-4 py-4 text-left last:border-0 hover:bg-white/[0.04]"><div className="min-w-0"><div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--accent-light)]">{Math.round(card.similarity * 100)}% match</div><div className="truncate text-sm font-semibold text-white">{card.front}</div><div className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">{card.back}</div></div><ArrowRight size={16} className="mt-1 shrink-0 text-[var(--text-faint)]" /></button>)}</div> : <div className="p-7 text-center text-sm text-[var(--text-muted)]">No saved concepts match that search.</div>}
            </Motion.div>
          </>}
        </AnimatePresence>
      </div>

      <Motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card variant="accent" className="overflow-hidden p-6 sm:p-8">
          <div className="grid gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="kicker"><Sparkles size={12} /> Today’s study plan</div>
              <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">{getGreeting()}, {userName}.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">Your most recent material is ready. Pick up where you left off, or bring in something new.</p>
              <div className="mt-6 flex flex-wrap gap-3"><Button leftIcon={BookOpen} onClick={() => mostRecent && openSession(mostRecent.id)}>Continue studying</Button><Button variant="secondary" leftIcon={Upload} onClick={() => navigate('/upload')}>Add a source</Button></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-xl border border-[var(--border)] bg-slate-950/20 p-4"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--text-faint)]"><CalendarDays size={13} /> Latest session</div><div className="mt-2 truncate text-sm font-bold text-white">{mostRecent?.title || 'No session selected'}</div><div className="mt-1 text-xs text-[var(--text-muted)]">{mostRecent?.created_at ? `Created ${formatDate(mostRecent.created_at)}` : 'Open a saved deck to continue'}</div></div>
              <div className="rounded-xl border border-[var(--border)] bg-slate-950/20 p-4"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--text-faint)]"><Clock3 size={13} /> Best next step</div><div className="mt-2 text-sm font-bold text-white">Review a focused block</div><div className="mt-1 text-xs text-[var(--text-muted)]">A short recall pass keeps the streak alive.</div></div>
            </div>
          </div>
        </Card>
      </Motion.section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, detail, icon: Icon, color }) => <Card key={label} className="p-5"><Icon size={17} className={color} /><div className="mt-5 text-2xl font-bold tracking-tight text-white">{value}</div><div className="mt-1 text-sm font-semibold text-[var(--text-secondary)]">{label}</div><div className="mt-1 text-xs text-[var(--text-faint)]">{detail}</div></Card>)}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><div className="kicker">Continue learning</div><h2 className="font-heading mt-2 text-2xl font-bold tracking-tight text-white">Your recent study sessions</h2></div><Button variant="ghost" size="sm" onClick={() => navigate('/study')}>View library</Button></div>
          <div className="mt-6 divide-y divide-[var(--border)]">
            {history.slice(0, 5).map((session, index) => <button key={session.id} type="button" onClick={() => openSession(session.id)} className="group flex w-full items-center gap-4 py-4 text-left first:pt-0"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.045] text-xs font-bold text-[var(--accent-light)]">{String(index + 1).padStart(2, '0')}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-white group-hover:text-[var(--accent-light)]">{session.title}</span><span className="mt-1 flex flex-wrap gap-2 text-[11px] text-[var(--text-faint)]"><span>{formatDate(session.created_at)}</span><span>·</span><span>{session.card_count ?? session.flashcards?.length ?? 0} cards</span><span>·</span><span>{session.question_count ?? session.quiz?.length ?? 0} questions</span></span></span><ArrowRight size={16} className="shrink-0 text-[var(--text-faint)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent-light)]" /></button>)}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="p-5 sm:p-6"><div className="flex items-center justify-between"><div><div className="kicker">Momentum</div><h2 className="mt-2 text-xl font-bold text-white">Your study rhythm</h2></div><TrendingUp size={20} className="text-[var(--success)]" /></div><div className="mt-6 grid grid-cols-7 items-end gap-1.5" aria-label="Weekly activity chart">{[24, 50, 38, 66, 48, 82, 68].map((height, index) => <div key={index} className="flex h-20 items-end"><div className={`w-full rounded-t-md ${index === 6 ? 'bg-[var(--success)]' : 'bg-[var(--accent)]/60'}`} style={{ height: `${height}%` }} /></div>)}</div><div className="mt-3 flex justify-between text-[10px] font-medium text-[var(--text-faint)]"><span>Mon</span><span>Today</span></div><p className="mt-4 text-xs leading-6 text-[var(--text-muted)]">Keep a small daily review block to make progress feel effortless.</p></Card>
          <Card className="border-[var(--border-accent)] bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(15,23,42,0.78))] p-5 sm:p-6"><CheckCircle2 size={19} className="text-[var(--success)]" /><div className="mt-4 text-base font-bold text-white">Ready for a deeper check?</div><p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Run an adaptive quiz to find the topics worth your next focused pass.</p><Button variant="secondary" className="mt-5" rightIcon={ArrowRight} onClick={() => navigate('/study?mode=adaptive')}>Start adaptive quiz</Button></Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
