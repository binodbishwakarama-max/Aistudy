import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import Button from '../components/ui/Button';
import { getStudyHistory } from '../services/api';
import { useStudy } from '../context/StudyContext';

const UploadPage = () => {
  const navigate = useNavigate();
  const { text, loadDeck } = useStudy();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let active = true;
    const fetchHistory = async () => {
      try {
        const data = await getStudyHistory();
        if (active) setHistory(data || []);
      } catch (error) {
        console.error('Failed to fetch history', error);
      }
    };
    fetchHistory();
    return () => {
      active = false;
    };
  }, []);

  const openSession = async (sessionId) => {
    await loadDeck(sessionId);
    navigate('/flashcards');
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      {/* Header */}
      <Motion.header
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Create Study Deck
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          Upload lecture slides, notes, or readings to generate flashcards and quiz sets.
        </p>
      </Motion.header>

      {/* Main Grid */}
      <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
        {/* Dropzone Container */}
        <Motion.section
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-soft)]"
        >
          <FileUpload />
        </Motion.section>

        {/* Sidebar */}
        <Motion.aside
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="space-y-6"
        >
          {/* How It Works Card */}
          <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-soft)]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Workflow
            </h3>
            <ol className="mt-4 space-y-3 text-xs leading-relaxed text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-[var(--text-primary)]">1.</span>
                <span>Document parsing extracts key concepts and definitions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-[var(--text-primary)]">2.</span>
                <span>Active recall flashcards and quiz questions are structured.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-[var(--text-primary)]">3.</span>
                <span>Study mode opens with spaced repetition tracking.</span>
              </li>
            </ol>

            {text && (
              <Button
                className="mt-6 w-full justify-center"
                rightIcon={ArrowRight}
                onClick={() => navigate('/flashcards')}
              >
                Continue Active Session
              </Button>
            )}
          </div>

          {/* Recent Decks Library */}
          {history.length > 0 && (
            <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-[var(--text-muted)]" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Recent Decks
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/study')}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  View all
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {history.slice(0, 4).map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => openSession(session.id)}
                    className="flex w-full items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-left text-xs transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
                  >
                    <span className="truncate font-medium text-[var(--text-primary)]">
                      {session.title}
                    </span>
                    <ArrowRight size={13} className="flex-shrink-0 text-[var(--text-muted)]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </Motion.aside>
      </div>
    </div>
  );
};

export default UploadPage;
