import React from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, CheckCircle, Clock3, Sparkles, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandMark from '../components/BrandMark';

const features = [
  {
    icon: Sparkles,
    title: 'Generate study material fast',
    description: 'Turn notes and PDFs into flashcards, quizzes, and review sheets without extra cleanup.',
  },
  {
    icon: Brain,
    title: 'Stay focused in one flow',
    description: 'Move between reading, recall, and review without jumping through cluttered screens.',
  },
  {
    icon: Target,
    title: 'See what matters next',
    description: 'Track streaks, progress, and saved sessions in a way that feels clear and useful.',
  },
];

const steps = [
  { label: 'Upload', detail: 'Add a PDF or text file.' },
  { label: 'Generate', detail: 'Pick flashcards, quiz, or review.' },
  { label: 'Review', detail: 'Keep learning from the same workspace.' },
];

const Landing = () => {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="app-shell">
      <div className="page-shell pb-16 pt-6 sm:pb-20">
        <nav className="flex items-center justify-between gap-4 py-2">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark />
            <div>
              <div className="font-heading text-lg font-bold tracking-tight">MindFlow</div>
              <div className="text-sm text-[var(--text-muted)]">Simple AI study workspace</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login" className="ghost-button hidden text-sm font-medium sm:inline-flex">
              Sign in
            </Link>
            <Link to="/register" className="primary-button px-5 py-3 text-sm">
              Get started
            </Link>
          </div>
        </nav>

        <section className="grid items-center gap-8 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="pill-badge">
              <Sparkles size={14} className="text-[var(--accent)]" />
              Minimal by design
            </div>

            <div className="space-y-4">
              <h1 className="font-heading max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
                Study in a cleaner workspace that stays out of your way.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
                MindFlow helps you upload notes, generate study material, and review everything from one calm, simple
                interface.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="primary-button justify-center px-6 text-base">
                Create account
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="secondary-button justify-center px-6 text-base">
                Open workspace
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Formats', value: 'PDF + TXT' },
                { label: 'Outputs', value: 'Cards, quiz, review' },
                { label: 'Setup', value: 'Under a minute' },
              ].map((item) => (
                <div key={item.label} className="glass-card p-5">
                  <div className="text-sm font-medium text-[var(--text-muted)]">{item.label}</div>
                  <div className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{item.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="section-shell p-6 sm:p-7"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
              <div>
                <div className="text-base font-semibold">Today&apos;s study flow</div>
                <div className="mt-1 text-sm text-[var(--text-muted)]">A simpler view of the product</div>
              </div>
              <div className="info-chip">
                <Clock3 size={14} className="text-[var(--accent)]" />
                18 min
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="glass-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-[var(--text-muted)]">Current deck</div>
                    <div className="mt-1 text-lg font-semibold">Binary search essentials</div>
                  </div>
                  <div className="rounded-full bg-[var(--bg-strong)] px-3 py-1 text-sm font-medium text-[var(--accent)]">
                    Ready
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-[var(--bg-elevated)] p-5">
                  <div className="text-sm font-medium text-[var(--text-muted)]">Flashcard prompt</div>
                  <p className="mt-3 text-lg font-semibold leading-8">
                    What is the time complexity of binary search on a sorted array?
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {['Again', 'Hard', 'Good', 'Easy'].map((item) => (
                    <div key={item} className="rounded-full border border-[var(--border)] px-3 py-2 text-center text-sm font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: BookOpen, label: 'Source', value: 'Lecture notes' },
                  { icon: CheckCircle, label: 'Cards', value: '15 generated' },
                  { icon: Target, label: 'Goal', value: 'Quiz after review' },
                ].map((item) => (
                  <div key={item.label} className="glass-card p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--bg-elevated)] text-[var(--accent)]">
                      <item.icon size={18} />
                    </div>
                    <div className="mt-4 text-sm font-medium text-[var(--text-muted)]">{item.label}</div>
                    <div className="mt-1 font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-[var(--accent)]">
                <feature.icon size={20} />
              </div>
              <h2 className="mt-5 text-xl font-semibold">{feature.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="section-shell mt-10 p-8 sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="kicker">How it works</div>
              <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                One simple loop for study sessions.
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {steps.map((step, index) => (
                  <div key={step.label} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
                    <div className="text-sm font-medium text-[var(--text-muted)]">Step {index + 1}</div>
                    <div className="mt-2 text-lg font-semibold">{step.label}</div>
                    <div className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{step.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link to="/register" className="primary-button min-w-[200px] justify-center px-6">
                Start now
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="secondary-button min-w-[200px] justify-center px-6">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
