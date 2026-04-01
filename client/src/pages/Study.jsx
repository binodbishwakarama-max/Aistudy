import React, { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle,
  FileText,
  HelpCircle,
  Layers,
  Save,
  Sparkles,
  Target,
} from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import Flashcard from '../components/Flashcard';
import Quiz from '../components/Quiz';
import ReviewSheet from '../components/ReviewSheet';
import SRSDashboard from '../components/SRSDashboard';
import StatsDashboard from '../components/StatsDashboard';
import StudyLibrary from '../components/StudyLibrary';
import { useAuth } from '../context/AuthContext';
import { useStudy } from '../context/StudyContext';

const modeDetails = {
  flashcards: {
    title: 'Flashcards',
    description: 'Review the source one prompt at a time.',
  },
  quiz: {
    title: 'Quiz',
    description: 'Check recall with multiple-choice questions.',
  },
  review: {
    title: 'Review sheet',
    description: 'Scan a simpler written summary before deeper review.',
  },
  stats: {
    title: 'Stats',
    description: 'See learning trends for this session and overall progress.',
  },
  library: {
    title: 'Library',
    description: 'Open a saved session and continue where you left off.',
  },
};

const Study = () => {
  const { text, flashcards, quiz, generateFlashcards, generateQuiz, saveSession, loading, error } = useStudy();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState(() => (text ? 'flashcards' : 'library'));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const sourceCharacters = text.length;
  const approximateWords = useMemo(
    () => (text ? text.trim().split(/\s+/).filter(Boolean).length : 0),
    [text],
  );

  const tabs = [
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'review', label: 'Review', icon: FileText },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'library', label: 'Library', icon: BookOpen },
  ];

  const activeMode = modeDetails[mode];

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
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="section-shell w-full max-w-2xl p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-strong)] text-[var(--accent)]">
            <BookOpen size={28} />
          </div>
          <div className="mt-6 flex justify-center">
            <div className="pill-badge">
              <Sparkles size={14} className="text-[var(--accent)]" />
              Start a study session
            </div>
          </div>
          <h2 className="font-heading mt-5 text-4xl font-bold tracking-tight">Upload a source to begin.</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[var(--text-secondary)]">
            Add a document from the dashboard to generate flashcards, quizzes, and a review sheet, or open a saved
            session from your library.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={() => navigate('/dashboard')} className="primary-button justify-center px-7">
              Upload document
            </button>
            <button onClick={() => setMode('library')} className="secondary-button justify-center px-7">
              Open library
            </button>
          </div>
        </div>
      </div>
    );
  }

  const contentShellClass = 'section-shell min-h-[520px] p-6 sm:p-8';

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
              <Target size={14} className="text-[var(--accent)]" />
              {activeMode.title}
            </div>
            <h1 className="font-heading mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              {mode === 'library' ? 'Open a saved session' : 'Keep your study flow in one place'}
            </h1>
            <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">{activeMode.description}</p>
            {text && (
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
                {text.replace(/\s+/g, ' ').trim().slice(0, 240)}
                {text.length > 240 ? '...' : ''}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {text && (
              <button
                onClick={handleSave}
                disabled={saving}
                className={`secondary-button justify-center px-6 text-sm ${
                  saved ? 'border-[rgba(24,128,56,0.35)] bg-[rgba(24,128,56,0.08)] text-[var(--success)]' : ''
                }`}
              >
                {saved ? <CheckCircle size={16} /> : <Save size={16} />}
                {saved ? 'Saved' : saving ? 'Saving...' : 'Save session'}
              </button>
            )}
            <button onClick={() => navigate('/dashboard')} className="secondary-button justify-center px-6 text-sm">
              <ArrowLeft size={16} />
              New document
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="glass-card p-4">
            <div className="text-sm font-medium text-[var(--text-muted)]">Source</div>
            <div className="mt-2 text-lg font-semibold">{text ? `${sourceCharacters.toLocaleString()} characters` : 'No source loaded'}</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-sm font-medium text-[var(--text-muted)]">Words</div>
            <div className="mt-2 text-lg font-semibold">{text ? approximateWords.toLocaleString() : 0}</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-sm font-medium text-[var(--text-muted)]">Generated</div>
            <div className="mt-2 text-lg font-semibold">
              {flashcards.length} cards · {quiz.length} questions
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = mode === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-mindflow ${
                  isActive
                    ? 'border border-[var(--border-accent)] bg-[var(--bg-strong)] text-[var(--accent)]'
                    : 'border border-[var(--border)] bg-white text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </Motion.section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-[rgba(217,48,37,0.22)] bg-[rgba(217,48,37,0.06)] px-4 py-3 text-sm">
          <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-[var(--danger)]" />
          <span>{error}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {mode === 'flashcards' && (
          <Motion.section
            key="flashcards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className={contentShellClass}
          >
            {flashcards.length === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="pill-badge">
                  <Layers size={14} className="text-[var(--accent)]" />
                  Flashcards
                </div>
                <h2 className="font-heading mt-5 text-3xl font-bold">Generate a focused card deck.</h2>
                <p className="mt-4 max-w-xl text-base leading-8 text-[var(--text-secondary)]">
                  Create a set of prompt-and-answer cards you can work through quickly without leaving this page.
                </p>
                <button onClick={generateFlashcards} disabled={loading} className="primary-button mt-8 justify-center px-7">
                  {loading ? 'Generating...' : 'Generate flashcards'}
                </button>
              </div>
            ) : (
              <Flashcard cards={flashcards} />
            )}
          </Motion.section>
        )}

        {mode === 'quiz' && (
          <Motion.section
            key="quiz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className={contentShellClass}
          >
            {quiz.length === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="pill-badge">
                  <HelpCircle size={14} className="text-[var(--accent)]" />
                  Quiz
                </div>
                <h2 className="font-heading mt-5 text-3xl font-bold">Turn the source into a quick recall check.</h2>
                <p className="mt-4 max-w-xl text-base leading-8 text-[var(--text-secondary)]">
                  Generate multiple-choice questions to test understanding and find weak spots quickly.
                </p>
                <button onClick={generateQuiz} disabled={loading} className="primary-button mt-8 justify-center px-7">
                  {loading ? 'Generating...' : 'Generate quiz'}
                </button>
              </div>
            ) : (
              <Quiz questions={quiz} />
            )}
          </Motion.section>
        )}

        {mode === 'review' && (
          <Motion.section
            key="review"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className={contentShellClass}
          >
            <ReviewSheet flashcards={flashcards} />
          </Motion.section>
        )}

        {mode === 'stats' && (
          <Motion.section
            key="stats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className={contentShellClass}
          >
            <StatsDashboard />
          </Motion.section>
        )}

        {mode === 'library' && (
          <Motion.section
            key="library"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className={contentShellClass}
          >
            <StudyLibrary onSelect={setMode} />
          </Motion.section>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="section-shell p-5">
          <SRSDashboard />
        </section>

        <section className="section-shell p-6">
          <div className="kicker">Source preview</div>
          <h2 className="font-heading mt-3 text-2xl font-bold tracking-tight">What you are studying right now</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            {text
              ? text.replace(/\s+/g, ' ').trim().slice(0, 520) + (text.length > 520 ? '...' : '')
              : 'Open a saved session or upload a new source from the dashboard.'}
          </p>
        </section>
      </div>

      <ChatInterface />
    </div>
  );
};

export default Study;
