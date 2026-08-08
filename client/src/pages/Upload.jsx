import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, BookOpen, FileText } from 'lucide-react';
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
    <div className="space-y-8">
      <Motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="kicker">Upload</p>
        <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Import your source
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-[var(--text-secondary)]">
          Drop a PDF or text file. MindFlow parses it, generates flashcards, and opens study mode automatically.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <FileText size={14} /> PDF and TXT
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={14} /> Lecture notes & readings
          </span>
        </div>
      </Motion.header>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-soft)]"
        >
          <div className="border-b border-[var(--border)] px-6 py-5 sm:px-8">
            <h2 className="font-heading text-xl font-bold tracking-tight">Drag, drop, and continue</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Once parsed, jump straight into study modes.
            </p>
          </div>
          <FileUpload />
        </Motion.section>

        <Motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="space-y-4"
        >
          <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">What happens next</p>
            <ol className="mt-4 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <li>1. Source is parsed into study text.</li>
              <li>2. Flashcards are generated automatically.</li>
              <li>3. You land in study mode — review right away.</li>
            </ol>
            {text && (
              <Button className="mt-6 w-full justify-center" rightIcon={ArrowRight} onClick={() => navigate('/flashcards')}>
                Continue to study
              </Button>
            )}
          </div>

          {history.length > 0 && (
            <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Recent uploads</p>
                <Button variant="ghost" size="sm" onClick={() => navigate('/study')}>
                  Library
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                {history.slice(0, 4).map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => openSession(session.id)}
                    className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--bg-surface)]"
                  >
                    <span className="truncate font-medium">{session.title}</span>
                    <ArrowRight size={14} className="flex-shrink-0 text-[var(--text-muted)]" />
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
