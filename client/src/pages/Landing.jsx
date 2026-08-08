import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Layers,
  Upload,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandMark from '../components/BrandMark';
import Button from '../components/ui/Button';
import { BRAND } from '../config/brand';

const steps = BRAND.steps.map((step, index) => ({
  ...step,
  icon: [Upload, Layers, BookOpen][index],
}));

const testimonials = [
  {
    quote: 'MindFlow makes a 90-minute exam prep block feel structured in the first five minutes.',
    name: 'Ava Larson',
    role: 'Medical Student',
  },
  {
    quote: 'It feels more like a focused workspace and less like juggling three separate tools.',
    name: 'Daniel Chen',
    role: 'Engineering Major',
  },
  {
    quote: 'The home screen makes it obvious what I uploaded, what I reviewed, and what to do next.',
    name: 'Mina Sarto',
    role: 'Grad Researcher',
  },
];

const HeroVisual = () => (
  <div className="relative h-full min-h-[320px] w-full overflow-hidden bg-[linear-gradient(160deg,#1d1d1f_0%,#2c2c2e_45%,#0071e3_160%)] sm:min-h-[420px] lg:min-h-full">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
    <div className="relative flex h-full flex-col justify-end p-8 sm:p-10 lg:p-12">
      <div className="max-w-md space-y-4 text-white">
        <p className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Consensus protocol
        </p>
        <p className="text-sm leading-7 text-white/70 sm:text-base">
          A protocol that lets distributed nodes agree on a shared state—even when the network partitions.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
            Flashcard 4 of 12
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80">
            Tap to reveal
          </span>
        </div>
      </div>
    </div>
  </div>
);

const Landing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + testimonials.length - 1) % testimonials.length);
  };

  return (
    <div className="app-shell overflow-hidden">
      {/* Hero: one composition */}
      <section className="relative min-h-[100svh]">
        <nav className="absolute inset-x-0 top-0 z-20">
          <div className="page-shell flex items-center justify-between py-5">
            <Link to="/" className="flex items-center gap-3">
              <BrandMark />
              <span className="font-heading text-lg font-bold tracking-tight">MindFlow</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/demo/flashcards">
                <Button variant="ghost">{BRAND.demoCta}</Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button rightIcon={ArrowRight}>Get started</Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="grid min-h-[100svh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="page-shell flex flex-col justify-center pb-16 pt-28 lg:max-w-none lg:pr-8 lg:pl-[max(1.25rem,calc((100vw-1120px)/2))]">
            <Motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl"
            >
              <p className="kicker">{BRAND.wedge}</p>
              <h1 className="font-heading text-5xl font-bold leading-[1.02] tracking-tight text-[var(--text-primary)] sm:text-6xl lg:text-[4.25rem]">
                MindFlow
              </h1>
              <p className="mt-5 text-xl font-medium leading-snug text-[var(--text-primary)] sm:text-2xl">
                {BRAND.headline}
              </p>
              <p className="mt-4 max-w-md text-base leading-7 text-[var(--text-secondary)]">
                {BRAND.subline}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button size="lg" rightIcon={ArrowRight} onClick={() => navigate('/demo/flashcards')}>
                  {BRAND.demoCta}
                </Button>
                <Link to="/register">
                  <Button size="lg" variant="secondary">
                    Upload your PDF
                  </Button>
                </Link>
              </div>
            </Motion.div>
          </div>

          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative min-h-[40vh] lg:min-h-[100svh]"
          >
            <HeroVisual />
          </Motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-[var(--border)] py-20 sm:py-24">
        <div className="page-shell">
          <div className="max-w-2xl">
            <p className="kicker">How it works</p>
            <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {BRAND.wedge}
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
              Three steps from lecture PDF to exam-ready—in about 45 minutes.
            </p>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map((step, index) => (
              <Motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--bg-strong)] text-[var(--accent)]">
                  <step.icon size={20} />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  0{index + 1}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{step.desc}</p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-elevated)] py-20 sm:py-24">
        <div className="page-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="kicker">Students</p>
            <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for focused revision.
            </h2>

            <div className="relative mt-10 min-h-[140px]">
              <AnimatePresence mode="wait">
                <Motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                >
                  <p className="text-lg leading-8 text-[var(--text-secondary)] sm:text-xl">
                    “{testimonials[currentTestimonial].quote}”
                  </p>
                  <p className="mt-6 text-sm font-semibold text-[var(--text-primary)]">
                    {testimonials[currentTestimonial].name}
                    <span className="font-normal text-[var(--text-muted)]">
                      {' '}
                      · {testimonials[currentTestimonial].role}
                    </span>
                  </p>
                </Motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={prevTestimonial}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] transition-colors hover:bg-[var(--bg-base)]"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-mono text-xs text-[var(--text-muted)]">
                {currentTestimonial + 1} / {testimonials.length}
              </span>
              <button
                type="button"
                onClick={nextTestimonial}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] transition-colors hover:bg-[var(--bg-base)]"
                aria-label="Next testimonial"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[var(--border)] py-20 sm:py-24">
        <div className="page-shell text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl">
            Your next exam sprint starts with one PDF.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[var(--text-secondary)]">
            {BRAND.shortSubline}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" rightIcon={ArrowRight} onClick={() => navigate('/demo/flashcards')}>
              {BRAND.demoCta}
            </Button>
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Create free account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-8">
        <div className="page-shell flex flex-col gap-4 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark />
            <span className="font-semibold text-[var(--text-primary)]">MindFlow</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="#how" className="hover:text-[var(--text-primary)]">
              How it works
            </a>
            <Link to="/login" className="hover:text-[var(--text-primary)]">
              Sign in
            </Link>
            <Link to="/register" className="hover:text-[var(--text-primary)]">
              Get started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
