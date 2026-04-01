import React, { useMemo, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
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
import StudyLibrary from '../components/StudyLibrary';
import { useAuth } from '../context/AuthContext';
import { useStudy } from '../context/StudyContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const modeDetails = {
  flashcards: {
    title: 'Flashcards',
    description: 'Review the source one prompt at a time.',
  },
  quiz: {
    title: 'Quizzes',
    description: 'Pressure test recall with multiple-choice questions.',
  },
  review: {
    title: 'Review sheet',
    description: 'Scan the core ideas before a deeper study pass.',
  },
  library: {
    title: 'Library',
    description: 'Open a saved session and continue where you left off.',
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

  return hasText ? 'flashcards' : 'library';
};

const Study = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { text, flashcards, quiz, generateFlashcards, generateQuiz, saveSession, loading, error } = useStudy();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const mode = getModeFromLocation(location.pathname, location.search, Boolean(text));
  const activeMode = modeDetails[mode] || modeDetails.library;
  const sourceCharacters = text.length;
  const approximateWords = useMemo(() => (text ? text.trim().split(/\s+/).filter(Boolean).length : 0), [text]);
  const flashcardSessionKey = useMemo(() => buildSessionKey(flashcards), [flashcards]);
  const quizSessionKey = useMemo(() => buildSessionKey(quiz), [quiz]);

  const tabs = [
    { id: 'flashcards', label: 'Flashcards', icon: Layers, to: '/flashcards' },
    { id: 'quiz', label: 'Quizzes', icon: HelpCircle, to: '/quizzes' },
    { id: 'review', label: 'Review', icon: FileText, to: '/study?mode=review' },
    { id: 'library', label: 'Library', icon: BookOpen, to: '/study' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, to: '/analytics' },
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
      <Card className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center p-6 text-center sm:p-10">
        <div className="pill-badge">
          <Sparkles size={14} className="text-[var(--accent)]" />
          Start a study session
        </div>
        <h1 className="font-heading mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Upload a source before you start reviewing.</h1>
        <p className="mt-4 max-w-xl text-base leading-8 text-[var(--text-secondary)]">
          Add a document from the upload screen to generate flashcards, quizzes, and a review sheet, or open a saved
          session from your library.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => navigate('/upload')}>Upload document</Button>
          <Button variant="secondary" onClick={() => navigate('/study')}>
            Open library
          </Button>
        </div>
      </Card>
    );
  }

  const contentShellClass = 'min-h-[420px] sm:min-h-[520px]';

  return (
    <div className="space-y-6">
      <Motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card variant="accent" className="p-6 sm:p-10">
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
            <div className="max-w-3xl">
              <div className="pill-badge">
                <Target size={14} className="text-[var(--accent)]" />
                {activeMode.title}
              </div>
              <h1 className="font-heading mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
                {mode === 'library' ? 'Continue a saved study session' : 'Keep your revision flow in one place'}
              </h1>
              <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">{activeMode.description}</p>
              {text && (
                <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
                  {text.replace(/\s+/g, ' ').trim().slice(0, 240)}
                  {text.length > 240 ? '...' : ''}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
              {text && (
                <Button
                  onClick={handleSave}
                  loading={saving}
                  variant={saved ? 'subtle' : 'secondary'}
                  leftIcon={saved ? CheckCircle : Save}
                  className="w-full justify-center sm:w-auto"
                >
                  {saved ? 'Saved' : 'Save session'}
                </Button>
              )}
              <Button variant="ghost" leftIcon={ArrowLeft} onClick={() => navigate('/upload')} className="w-full justify-center sm:w-auto">
                New document
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Card className="p-4">
              <div className="text-sm font-medium text-[var(--text-muted)]">Source</div>
              <div className="mt-2 text-lg font-semibold">{text ? `${sourceCharacters.toLocaleString()} characters` : 'No source loaded'}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-[var(--text-muted)]">Words</div>
              <div className="mt-2 text-lg font-semibold">{text ? approximateWords.toLocaleString() : 0}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-[var(--text-muted)]">Generated</div>
              <div className="mt-2 text-lg font-semibold">
                {flashcards.length} cards - {quiz.length} questions
              </div>
            </Card>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const isActive = tab.id === mode || (tab.id === 'analytics' && location.pathname === '/analytics');
              return (
                <Link
                  key={tab.id}
                  to={tab.to}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-mindflow ${
                    isActive
                      ? 'border border-[var(--border-accent)] bg-[var(--bg-strong)] text-[var(--accent)]'
                      : 'border border-[var(--border)] bg-white text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </Card>
      </Motion.section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-[rgba(217,48,37,0.22)] bg-[rgba(217,48,37,0.06)] px-4 py-3 text-sm">
          <Sparkles size={18} className="mt-0.5 flex-shrink-0 text-[var(--danger)]" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <AnimatePresence mode="wait">
          <Motion.section
            key={mode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            <Card className={`p-5 sm:p-8 ${contentShellClass}`}>
              {mode === 'flashcards' && (
                <>
                  {flashcards.length === 0 ? (
                    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                      <div className="pill-badge">
                        <Layers size={14} className="text-[var(--accent)]" />
                        Flashcards
                      </div>
                      <h2 className="font-heading mt-5 text-3xl font-bold">Generate a focused card deck.</h2>
                      <p className="mt-4 max-w-xl text-base leading-8 text-[var(--text-secondary)]">
                        Create prompt-and-answer cards from your uploaded source and move straight into active recall.
                      </p>
                      <Button className="mt-8" loading={loading} onClick={generateFlashcards}>
                        Generate flashcards
                      </Button>
                    </div>
                  ) : (
                    <Flashcard key={flashcardSessionKey} cards={flashcards} />
                  )}
                </>
              )}

              {mode === 'quiz' && (
                <>
                  {quiz.length === 0 ? (
                    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                      <div className="pill-badge">
                        <HelpCircle size={14} className="text-[var(--accent)]" />
                        Quizzes
                      </div>
                      <h2 className="font-heading mt-5 text-3xl font-bold">Turn the source into a quick recall check.</h2>
                      <p className="mt-4 max-w-xl text-base leading-8 text-[var(--text-secondary)]">
                        Generate multiple-choice questions to pressure test understanding and surface weak spots quickly.
                      </p>
                      <Button className="mt-8" loading={loading} onClick={generateQuiz}>
                        Generate quiz
                      </Button>
                    </div>
                  ) : (
                    <Quiz key={quizSessionKey} questions={quiz} />
                  )}
                </>
              )}

              {mode === 'review' && <ReviewSheet flashcards={flashcards} />}

              {mode === 'library' && <StudyLibrary onSelect={() => navigate('/flashcards')} />}
            </Card>
          </Motion.section>
        </AnimatePresence>

        <div className="grid gap-6">
          <Card className="p-5">
            <SRSDashboard />
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="kicker">Source preview</div>
            <h2 className="font-heading mt-3 text-2xl font-bold tracking-tight">What you are studying right now</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              {text
                ? `${text.replace(/\s+/g, ' ').trim().slice(0, 620)}${text.length > 620 ? '...' : ''}`
                : 'Open a saved session or upload a new source from the upload page.'}
            </p>
          </Card>

          <Card variant="accent" className="p-5 sm:p-6">
            <div className="text-sm font-semibold text-[var(--text-primary)]">Need a broader progress view?</div>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
              Analytics shows your weekly output, heatmap, accuracy, and study momentum across sessions.
            </p>
            <Button variant="secondary" className="mt-5" onClick={() => navigate('/analytics')}>
              Open analytics
            </Button>
          </Card>
        </div>
      </div>

      <ChatInterface />
    </div>
  );
};

export default Study;
