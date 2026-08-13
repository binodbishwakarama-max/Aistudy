import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Layers, Sparkles, Trophy, Zap, ShieldCheck } from 'lucide-react';
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
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      {/* Hero Header */}
      <Motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-soft)] sm:p-10"
      >
        {/* Decorative Ambient Radial Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-[var(--accent-light)] to-purple-500 opacity-10 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] bg-[var(--bg-strong)] px-3.5 py-1 text-xs font-bold text-[var(--accent)]">
            <Sparkles size={14} className="animate-spin" style={{ animationDuration: '8s' }} />
            <span>MIND-FLOW AI 2.0 SPRINT ENGINE</span>
          </div>

          <h1 className="font-heading mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Transform Any Document into a Master Deck
          </h1>

          <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Upload your lecture slides, PDFs, research papers, or syllabus. MindFlow parses your notes into spaced-repetition flashcards and adaptive quizzes in seconds.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-[var(--text-secondary)]">
              <Clock size={14} className="text-[var(--accent)]" />
              <span>~45-min Exam Review Sprint</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-[var(--text-secondary)]">
              <Layers size={14} className="text-[var(--accent)]" />
              <span>Spaced Repetition (SRS)</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-[var(--text-secondary)]">
              <Trophy size={14} className="text-[var(--accent)]" />
              <span>Adaptive Difficulty Engine</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-[var(--text-secondary)]">
              <ShieldCheck size={14} className="text-[var(--success)]" />
              <span>100% Private Parsing</span>
            </div>
          </div>
        </div>
      </Motion.header>

      {/* Main Content Layout */}
      <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
        {/* Left Column: Upload Dropzone & Text Area */}
        <Motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-raised)]"
        >
          <FileUpload />
        </Motion.section>

        {/* Right Column: Interactive Process & Recent Decks */}
        <Motion.aside
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* How It Works Card */}
          <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-soft)] sm:p-7">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                HOW MINDFLOW WORKS
              </p>
              <span className="rounded-full bg-[var(--bg-strong)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--accent)]">
                AUTOMATED 3-STEP PIPELINE
              </span>
            </div>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--bg-strong)] font-heading text-sm font-bold text-[var(--accent)]">
                  01
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">Parse & Structure</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                    Optical text extraction parses your PDF, headings, and equations into clean study text.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--bg-strong)] font-heading text-sm font-bold text-[var(--accent)]">
                  02
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">AI Deck Synthesis</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                    Multi-model AI synthesizes active recall flashcards, hints, and multiple-choice quizzes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--bg-strong)] font-heading text-sm font-bold text-[var(--accent)]">
                  03
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">Instant Study Launch</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                    Review with Leitner SRS queues, adaptive quizzes, and live progress heatmaps.
                  </p>
                </div>
              </div>
            </div>

            {text && (
              <Button
                className="mt-6 w-full justify-center shadow-md shadow-[rgba(0,113,227,0.2)]"
                rightIcon={ArrowRight}
                onClick={() => navigate('/flashcards')}
              >
                Continue to Active Study Session
              </Button>
            )}
          </div>

          {/* Recent Decks Card */}
          {history.length > 0 && (
            <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-soft)] sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-[var(--accent)]" />
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    RECENT DECK LIBRARY
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/study')}>
                  View All
                </Button>
              </div>

              <div className="mt-4 space-y-2.5">
                {history.slice(0, 4).map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => openSession(session.id)}
                    className="group flex w-full items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-left transition-all hover:border-[var(--border-accent)] hover:bg-[var(--bg-elevated)] hover:shadow-[var(--shadow-soft)]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                        {session.title}
                      </div>
                      <div className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                        {session.cards_count ? `${session.cards_count} cards` : 'Study Deck'}
                      </div>
                    </div>
                    <ArrowRight size={14} className="flex-shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
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
