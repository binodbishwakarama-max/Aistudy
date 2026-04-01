import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, BookOpen, FileText, ShieldCheck, Sparkles, Upload as UploadIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import Card from '../components/ui/Card';
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
        if (active) {
          setHistory(data || []);
        }
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
    <div className="space-y-6">
      <Motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card variant="accent" className="p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="max-w-3xl">
              <div className="pill-badge">
                <Sparkles size={14} className="text-[var(--accent)]" />
                Upload notes
              </div>
              <h1 className="font-heading mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
                Import your source and let the workspace build from there.
              </h1>
              <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
                Drop in lecture notes, a PDF, or raw study material. MindFlow will prepare it for flashcards, quizzes,
                and review sheets inside the same product flow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { label: 'Formats', value: 'PDF and TXT', icon: FileText },
                { label: 'Best for', value: 'Lecture notes, readings, summaries', icon: BookOpen },
                { label: 'Security', value: 'Private workspace flow', icon: ShieldCheck },
              ].map((item) => (
                <Card key={item.label} className="p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-[var(--accent)]">
                    <item.icon size={18} />
                  </div>
                  <div className="mt-4 text-sm font-medium text-[var(--text-muted)]">{item.label}</div>
                  <div className="mt-2 text-sm font-semibold leading-7">{item.value}</div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </Motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
          <Card className="overflow-hidden">
            <div className="border-b border-[var(--border)] px-6 pb-4 pt-6 sm:px-8">
              <div className="kicker">Importer</div>
              <h2 className="font-heading mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Drag, drop, and continue</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                Keep the intake step simple. Once the source is parsed, you can move directly into flashcards and quizzes.
              </p>
            </div>
            <FileUpload />
          </Card>
        </Motion.section>

        <Motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <div className="grid gap-6">
            <Card className="p-6 sm:p-8">
              <div className="kicker">What happens next</div>
              <div className="mt-5 space-y-4">
                {[
                  'The source is converted into plain study text.',
                  'You can generate flashcards or quizzes from the same upload.',
                  'The session is preserved so you can continue later from your library.',
                ].map((item, index) => (
                  <div key={item} className="flex gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-sm font-semibold text-[var(--accent)]">
                      0{index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-7 text-[var(--text-secondary)]">{item}</p>
                  </div>
                ))}
              </div>

              {text && (
                <Button className="mt-6" rightIcon={ArrowRight} onClick={() => navigate('/flashcards')}>
                  Open flashcards
                </Button>
              )}
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="kicker">Recent uploads</div>
                  <h2 className="font-heading mt-3 text-2xl font-bold tracking-tight">Latest study sessions</h2>
                </div>
                <Button variant="ghost" onClick={() => navigate('/study')}>
                  Library
                </Button>
              </div>

              <div className="mt-6 space-y-3">
                {history.slice(0, 4).map((session) => (
                  <button
                    type="button"
                    key={session.id}
                    onClick={() => openSession(session.id)}
                    className="w-full rounded-[24px] border border-[var(--border)] bg-[var(--bg-card)] px-4 py-4 text-left transition-mindflow hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-raised)]"
                  >
                    <div className="text-sm font-semibold text-[var(--text-primary)]">{session.title}</div>
                    <div className="mt-2 text-xs text-[var(--text-muted)]">
                      {session.card_count ?? session.flashcards?.length ?? 0} cards -{' '}
                      {session.question_count ?? session.quiz?.length ?? 0} questions
                    </div>
                  </button>
                ))}
                {history.length === 0 && (
                  <Card variant="muted" className="p-6 text-center">
                    <UploadIcon size={20} className="mx-auto text-[var(--accent)]" />
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                      Your recent uploads will appear here after the first source is processed.
                    </p>
                  </Card>
                )}
              </div>
            </Card>
          </div>
        </Motion.section>
      </div>
    </div>
  );
};

export default UploadPage;
