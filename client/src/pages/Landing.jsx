import React, { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandMark from '../components/BrandMark';
import Button from '../components/ui/Button';
import { BRAND } from '../config/brand';

const testimonials = [
  {
    quote: 'I finished a lecture pack the night before and walked into the exam knowing exactly what I still needed.',
    name: 'Ava Larson',
    role: 'Medical Student',
  },
  {
    quote: 'Upload, review, done. The due cards the next day are what keep me coming back.',
    name: 'Daniel Chen',
    role: 'Engineering Major',
  },
  {
    quote: 'No dashboard theater. Just the cards I need, from the notes I already have.',
    name: 'Mina Sarto',
    role: 'Grad Researcher',
  },
];

const HeroPreview = () => (
  <div className="landing-preview-card" aria-hidden>
    <div className="flex items-center justify-between gap-2">
      <span className="landing-preview-card__badge">Card 4 of 12</span>
      <span className="text-[11px] font-medium text-[var(--text-muted)]">~45 min</span>
    </div>
    <p className="landing-preview-card__question">What is the CAP theorem?</p>
    <p className="landing-preview-card__hint">Tap to reveal, then rate how well you knew it.</p>
    <div className="landing-preview-card__ratings">
      {['Hard', 'Good', 'Easy'].map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  </div>
);

const Landing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-premium">
      <header className={`landing-nav ${navScrolled ? 'is-scrolled' : ''}`}>
        <div className="page-shell">
          <div className="landing-nav__inner">
            <Link to="/" className="landing-nav__brand flex min-w-0 items-center gap-2.5">
              <BrandMark />
              <span className="truncate font-heading text-lg font-bold tracking-tight">MindFlow</span>
            </Link>
            <div className="hidden items-center gap-1 sm:flex">
              <a href="#how" className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                How it works
              </a>
              <Link to="/login" className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                Sign in
              </Link>
              <Link to="/demo/flashcards" className="ml-1">
                <Button size="sm">{BRAND.demoCtaShort}</Button>
              </Link>
            </div>
            <Link to="/demo/flashcards" className="landing-nav__cta sm:hidden">
              <Button size="sm">{BRAND.demoCtaShort}</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="landing-hero">
        <div className="page-shell w-full">
          <div className="landing-hero__grid">
            <div className="landing-hero__copy">
              <p className="landing-eyebrow">{BRAND.wedge}</p>
              <h1 className="font-heading mt-3 text-[clamp(2rem,6vw,3.25rem)] font-bold leading-[1.12] tracking-tight text-[var(--text-primary)]">
                {BRAND.headline}
              </h1>
              <p className="mt-4 max-w-md text-[0.95rem] leading-7 text-[var(--text-secondary)] sm:mt-5 sm:text-base sm:leading-8">
                {BRAND.subline}
              </p>

              <div className="landing-hero__actions mt-7 sm:mt-8">
                <Button size="lg" rightIcon={ArrowRight} onClick={() => navigate('/demo/flashcards')}>
                  {isMobile ? BRAND.demoCtaShort : BRAND.demoCta}
                </Button>
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Upload a PDF
                  </Button>
                </Link>
              </div>

              <p className="mt-5 text-sm text-[var(--text-muted)]">
                No account needed for the demo · 12 cards · ~45 minutes
              </p>
            </div>

            <div className="landing-hero__visual">
              <HeroPreview />
              <div className="landing-preview-meta">
                <span>45 min</span>
                <span aria-hidden>·</span>
                <span>12 cards</span>
                <span aria-hidden>·</span>
                <span>1 PDF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-story">
        <div className="page-shell">
          <div className="landing-story__panel">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="landing-eyebrow">The loop</p>
                <h2 className="font-heading mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  Messy PDF in. Exam-ready in 45 minutes.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-[var(--text-secondary)]">
                  One sprint from lecture pack to spaced review—with citations from your notes
                  and a home screen that shows what&apos;s due tomorrow.
                </p>
              </div>
              <dl className="landing-metrics">
                {[
                  { label: 'To first card', value: '< 60s' },
                  { label: 'Focused review', value: '~45m' },
                  { label: 'Next session', value: 'Due cards' },
                ].map((item) => (
                  <div key={item.label} className="landing-metrics__item">
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="landing-section">
        <div className="page-shell">
          <div className="max-w-xl">
            <p className="landing-eyebrow">How it works</p>
            <h2 className="font-heading mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              PDF → 45-min exam review
            </h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              Three steps from lecture PDF to exam-ready—in about 45 minutes.
            </p>
          </div>

          <ol className="landing-steps">
            {BRAND.steps.map((step, index) => (
              <li key={step.title} className="landing-step">
                <span className="landing-step__num" aria-hidden>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="landing-section landing-section--tight">
        <div className="page-shell">
          <div className="landing-quote">
            <p className="landing-eyebrow">From students</p>
            <div className="relative mt-6 min-h-[120px]">
              <AnimatePresence mode="wait">
                <Motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <blockquote className="text-lg leading-8 text-[var(--text-primary)] sm:text-xl sm:leading-9">
                    &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
                  </blockquote>
                  <p className="mt-5 text-sm text-[var(--text-muted)]">
                    <span className="font-medium text-[var(--text-secondary)]">
                      {testimonials[currentTestimonial].name}
                    </span>
                    {' '}· {testimonials[currentTestimonial].role}
                  </p>
                </Motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentTestimonial((p) => (p + testimonials.length - 1) % testimonials.length)}
                className="landing-icon-btn"
                aria-label="Previous quote"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="font-mono text-xs text-[var(--text-muted)]">
                {currentTestimonial + 1} / {testimonials.length}
              </span>
              <button
                type="button"
                onClick={() => setCurrentTestimonial((p) => (p + 1) % testimonials.length)}
                className="landing-icon-btn"
                aria-label="Next quote"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="page-shell">
          <div className="landing-cta">
            <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Your next exam sprint starts with one PDF.
            </h2>
            <p className="mt-3 max-w-md text-base leading-7 text-[var(--text-secondary)]">
              {BRAND.shortSubline}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" rightIcon={ArrowRight} onClick={() => navigate('/demo/flashcards')}>
                {BRAND.demoCta}
              </Button>
              <Link to="/register">
                <Button size="lg" variant="secondary">Create free account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="page-shell flex flex-col gap-4 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <BrandMark />
            <span className="font-medium text-[var(--text-primary)]">MindFlow</span>
          </div>
          <div className="flex flex-wrap gap-5">
            <a href="#how" className="hover:text-[var(--text-primary)]">How it works</a>
            <Link to="/login" className="hover:text-[var(--text-primary)]">Sign in</Link>
            <Link to="/register" className="hover:text-[var(--text-primary)]">Get started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
