import React, { useMemo, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Brain,
  CheckCircle,
  FileText,
  HelpCircle,
  Layers,
  BookOpen,
  Save,
  Upload,
} from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import Flashcard from '../components/Flashcard';
import Quiz from '../components/Quiz';
import ReviewSheet from '../components/ReviewSheet';
import AdaptiveQuiz from '../components/AdaptiveQuiz';
import SRSDashboard from '../components/SRSDashboard';
import StudyLibrary from '../components/StudyLibrary';
import { useAuth } from '../context/AuthContext';
import { useStudy } from '../context/StudyContext';
import Button from '../components/ui/Button';

const modeDetails = {
  flashcards: {
    title: 'Flashcards',
    description: 'Review one prompt at a time.',
  },
  quiz: {
    title: 'Quizzes',
    description: 'Multiple-choice knowledge checks.',
  },
  review: {
    title: 'Review sheet',
    description: 'Scan core ideas before a deeper pass.',
  },
  library: {
    title: 'Library',
    description: 'Open a saved session and continue.',
  },
  adaptive: {
    title: 'Adaptive',
    description: 'Difficulty adjusts to your weak topics.',
  },
};

const buildSessionKey = (items) => items.map((item) => JSON.stringify(item)).join('|');

const getModeFromLocation = (pathname, search, hasText) => {
  if (pathname === '/flashcards') return 'flashcards';
  if (pathname === '/quizzes') return 'quiz';

  const params = new URLSearchParams(search);
  const queryMode = params.get('mode');

  if (queryMode === 'review') return 'review';
  if (queryMode === 'library') return 'library';
  if (queryMode === 'adaptive') return 'adaptive';

  return hasText ? 'flashcards' : 'library';
};

const Study = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { text, flashcards, quiz, generateFlashcards, generateQuiz, saveSession, loading, error, lastDeckId } = useStudy();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const mode = getModeFromLocation(location.pathname, location.search, Boolean(text));
  const activeMode = modeDetails[mode] || modeDetails.library;
  const flashcardSessionKey = useMemo(() => buildSessionKey(flashcards), [flashcards]);
  const quizSessionKey = useMemo(() => buildSessionKey(quiz), [quiz]);
  const sourcePreview = useMemo(() => {
    if (!text) return 'No source loaded';
    const cleaned = text.replace(/\s+/g, ' ').trim();
    return cleaned.length > 72 ? `${cleaned.slice(0, 72)}…` : cleaned;
  }, [text]);

  const tabs = [
    { id: 'library', label: 'Library', icon: BookOpen, to: '/study' },
    { id: 'flashcards', label: 'Cards', icon: Layers, to: '/flashcards' },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, to: '/quizzes' },
    { id: 'adaptive', label: 'Adaptive', icon: Brain, to: '/study?mode=adaptive' },
    { id: 'review', label: 'Review', icon: FileText, to: '/study?mode=review' },
  ];

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save your progress.');
      return;
    }

    setSaving(true);
    try {
      const result = await saveSession(`Study Session ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
      if (result.ok) {
        setSaved(true);
        result.warnings?.forEach((warning) => toast(warning));
        window.setTimeout(() => setSaved(false), 3000);
      } else if (result.error) {
        toast.error(result.error);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!text && mode !== 'library') {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center py-12 text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Load a source to study
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          Upload a document to generate flashcards and quizzes, or open a saved session from your library.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button leftIcon={Upload} onClick={() => navigate('/upload')}>
            Upload document
          </Button>
          <Button variant="secondary" onClick={() => navigate('/study')}>
            Open library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="session-bar">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {activeMode.title}
          </p>
          <h1 className="font-heading mt-1 truncate text-xl font-bold tracking-tight sm:text-2xl">
            {mode === 'library' ? 'Your study library' : sourcePreview}
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{activeMode.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {text && (
            <Button
              onClick={handleSave}
              loading={saving}
              variant={saved ? 'subtle' : 'secondary'}
              leftIcon={saved ? CheckCircle : Save}
              size="sm"
            >
              {saved ? 'Saved' : 'Save'}
            </Button>
          )}
          <Button variant="ghost" size="sm" leftIcon={Upload} onClick={() => navigate('/upload')}>
            New
          </Button>
        </div>
      </header>

      <nav className="segmented-control w-full sm:w-auto" aria-label="Study modes">
        {tabs.map((tab) => {
          const isActive = tab.id === mode;
          return (
            <Link key={tab.id} to={tab.to} className={isActive ? 'is-active' : ''}>
              <tab.icon size={15} />
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {error && (
        <div className="rounded-[var(--radius-md)] border border-[rgba(215,0,21,0.2)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AnimatePresence mode="wait">
          <Motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="study-stage p-4 sm:p-6"
          >
            {mode === 'flashcards' && (
              <>
                {flashcards.length === 0 ? (
                  <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                    <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                      Generate flashcards
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)]">
                      Create prompt-and-answer cards from your uploaded source.
                    </p>
                    <Button className="mt-8" loading={loading} onClick={generateFlashcards}>
                      Generate flashcards
                    </Button>
                  </div>
                ) : (
                  <Flashcard key={flashcardSessionKey} cards={flashcards} deckId={lastDeckId} />
                )}
              </>
            )}

            {mode === 'quiz' && (
              <>
                {quiz.length === 0 ? (
                  <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                    <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                      Generate a quiz
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)]">
                      Turn the source into multiple-choice questions.
                    </p>
                    <Button className="mt-8" loading={loading} onClick={generateQuiz}>
                      Generate quiz
                    </Button>
                  </div>
                ) : (
                  <Quiz key={quizSessionKey} questions={quiz} deckId={lastDeckId} />
                )}
              </>
            )}

            {mode === 'review' && <ReviewSheet flashcards={flashcards} />}
            {mode === 'adaptive' && <AdaptiveQuiz />}
            {mode === 'library' && <StudyLibrary onSelect={() => navigate('/flashcards')} />}
          </Motion.div>
        </AnimatePresence>

        <aside className="space-y-4">
          <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow-soft)]">
            <SRSDashboard />
          </div>
          {text && (
            <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow-soft)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Source</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                {text.replace(/\s+/g, ' ').trim().slice(0, 420)}
                {text.length > 420 ? '…' : ''}
              </p>
              <p className="mt-3 text-xs text-[var(--text-muted)]">
                {flashcards.length} cards · {quiz.length} questions
              </p>
            </div>
          )}
        </aside>
      </div>

      <ChatInterface />
    </div>
  );
};

export default Study;
