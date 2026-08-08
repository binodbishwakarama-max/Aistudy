import React, { useEffect, useRef, useState } from 'react';
import { motion as Motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  Sparkles,
  Upload,
  Zap,
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
    quote: 'MindFlow turns a messy lecture PDF into a 45-minute sprint I can actually finish before the exam.',
    name: 'Ava Larson',
    role: 'Medical Student',
  },
  {
    quote: 'The glass-clear flow from upload to due cards tomorrow is what every study app promises but rarely delivers.',
    name: 'Daniel Chen',
    role: 'Engineering Major',
  },
  {
    quote: 'I open the app and know exactly what to review. No fake dashboards, no noise.',
    name: 'Mina Sarto',
    role: 'Grad Researcher',
  },
];

const marqueeItems = [
  '45-min exam sprint',
  'Spaced repetition',
  'Source citations',
  'Adaptive quizzes',
  'PDF → flashcards',
  'Due-card dashboard',
  'AI tutor',
  'Zero setup',
];

const HeroGlassStack = ({ tiltX, tiltY }) => {
  const rotateX = tiltY * -8;
  const rotateY = tiltX * 10;

  return (
    <div className="landing-scene">
      <div
        className="landing-card-stack"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        <div className="landing-glass-card liquid-glass landing-glass-card--back">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Question</p>
          <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">What is eventual consistency?</p>
        </div>

        <div className="landing-glass-card liquid-glass landing-glass-card--mid">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Question</p>
          <p className="mt-2 text-base font-semibold">What problem does Raft solve?</p>
        </div>

        <div className="landing-glass-card liquid-glass liquid-glass--dark landing-glass-card--front">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
              Card 4 of 12
            </span>
            <span className="text-[10px] text-white/60">~45 min sprint</span>
          </div>
          <p className="font-heading mt-5 text-xl font-bold leading-snug sm:text-2xl">
            What is the CAP theorem?
          </p>
          <p className="mt-4 text-sm leading-7 text-white/75">
            Tap to reveal — then rate how well you knew it.
          </p>
          <div className="mt-6 flex gap-2">
            {['Hard', 'Good', 'Easy'].map((label) => (
              <span
                key={label}
                className="rounded-xl bg-white/12 px-3 py-2 text-[10px] font-semibold backdrop-blur-sm"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <span className="landing-stat-pill">
          <Clock size={12} className="text-[var(--accent)]" />
          45 min
        </span>
        <span className="landing-stat-pill">
          <Layers size={12} className="text-[var(--accent)]" />
          12 cards
        </span>
        <span className="landing-stat-pill">
          <Zap size={12} className="text-[var(--accent)]" />
          1 PDF
        </span>
      </div>
    </div>
  );
};

const Landing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x, y });
  };

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-premium">
      <div className="landing-ambient" aria-hidden>
        <div className="landing-orb landing-orb--1" />
        <div className="landing-orb landing-orb--2" />
        <div className="landing-orb landing-orb--3" />
      </div>

      <header className={`landing-nav ${navScrolled ? 'is-scrolled' : ''}`}>
        <div className="page-shell">
          <div className={`landing-nav__inner ${navScrolled ? 'liquid-glass' : ''}`}>
            <Link to="/" className="flex items-center gap-3">
              <BrandMark />
              <span className="font-heading text-lg font-bold tracking-tight">MindFlow</span>
            </Link>
            <div className="hidden items-center gap-2 sm:flex">
              <a href="#how" className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                How it works
              </a>
              <Link to="/demo/flashcards">
                <Button variant="ghost" size="sm">{BRAND.demoCta}</Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" rightIcon={ArrowRight}>Get started</Button>
              </Link>
            </div>
            <Link to="/demo/flashcards" className="sm:hidden">
              <Button size="sm">{BRAND.demoCta}</Button>
            </Link>
          </div>
        </div>
      </header>

      <section ref={heroRef} className="landing-hero">
        <Motion.div style={{ y: heroY, opacity: heroOpacity }} className="page-shell w-full">
          <div className="landing-hero__grid">
            <Motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="kicker inline-flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--accent)]" />
                {BRAND.wedge}
              </p>
              <h1 className="font-heading mt-4 text-[clamp(2.75rem,8vw,4.5rem)] font-bold leading-[1.02] tracking-tight">
                <span className="landing-headline-gradient">{BRAND.headline}</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-[var(--text-secondary)]">
                {BRAND.subline}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" rightIcon={ArrowRight} onClick={() => navigate('/demo/flashcards')}>
                  {BRAND.demoCta}
                </Button>
                <Link to="/register">
                  <Button size="lg" variant="secondary">Upload your PDF</Button>
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <span className="landing-stat-pill">No credit card</span>
                <span className="landing-stat-pill">Demo in 10 seconds</span>
                <span className="landing-stat-pill">Real SRS + analytics</span>
              </div>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setTilt({ x: 0, y: 0 })}
              className="relative"
            >
              <HeroGlassStack tiltX={tilt.x} tiltY={tilt.y} />
            </Motion.div>
          </div>
        </Motion.div>
      </section>

      <section className="relative z-[1] border-y border-[rgba(255,255,255,0.5)] py-6">
        <div className="landing-marquee">
          <div className="landing-marquee__track">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span key={`${item}-${index}`} className="text-sm font-semibold tracking-wide text-[var(--text-muted)]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-story">
        <div className="page-shell">
          <div className="landing-story__panel liquid-glass">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="kicker">The loop</p>
                <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Messy PDF in. Exam-ready in 45 minutes.
                </h2>
                <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
                  MindFlow isn&apos;t another AI toy—it&apos;s a single sprint from lecture pack to spaced review,
                  with citations you can trust and a home screen that tells you what&apos;s due tomorrow.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {[
                  { label: 'Upload', value: '< 60s', sub: 'to first card' },
                  { label: 'Sprint', value: '~45m', sub: 'focused review' },
                  { label: 'Return', value: 'Due', sub: 'cards tomorrow' },
                ].map((item) => (
                  <div key={item.label} className="liquid-glass rounded-2xl p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{item.label}</p>
                    <p className="font-heading mt-2 text-2xl font-bold text-[var(--accent)]">{item.value}</p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="relative z-[1] py-20 sm:py-28">
        <div className="page-shell">
          <div className="max-w-2xl">
            <p className="kicker">How it works</p>
            <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              PDF → 45-min exam review
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
              Three steps from lecture PDF to exam-ready—in about 45 minutes.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <Motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.1, duration: 0.45 }}
                className="landing-step-card liquid-glass"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(0,113,227,0.12)] text-[var(--accent)]">
                  <step.icon size={22} />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Step 0{index + 1}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{step.desc}</p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-[1] py-20 sm:py-24">
        <div className="page-shell">
          <div className="liquid-glass mx-auto max-w-3xl rounded-[32px] p-8 text-center sm:p-12">
            <p className="kicker">Students</p>
            <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for the night before.
            </h2>

            <div className="relative mt-10 min-h-[150px]">
              <AnimatePresence mode="wait">
                <Motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-lg leading-8 text-[var(--text-secondary)] sm:text-xl">
                    &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
                  </p>
                  <p className="mt-6 text-sm font-semibold text-[var(--text-primary)]">
                    {testimonials[currentTestimonial].name}
                    <span className="font-normal text-[var(--text-muted)]">
                      {' '}· {testimonials[currentTestimonial].role}
                    </span>
                  </p>
                </Motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentTestimonial((p) => (p + testimonials.length - 1) % testimonials.length)}
                className="liquid-glass flex h-11 w-11 items-center justify-center rounded-full"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-mono text-xs text-[var(--text-muted)]">
                {currentTestimonial + 1} / {testimonials.length}
              </span>
              <button
                type="button"
                onClick={() => setCurrentTestimonial((p) => (p + 1) % testimonials.length)}
                className="liquid-glass flex h-11 w-11 items-center justify-center rounded-full"
                aria-label="Next testimonial"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-[1] pb-24 pt-8">
        <div className="page-shell">
          <div className="landing-cta-panel liquid-glass">
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
                <Button size="lg" variant="secondary">Create free account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-[1] border-t border-[rgba(255,255,255,0.45)] py-8">
        <div className="page-shell flex flex-col gap-4 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark />
            <span className="font-semibold text-[var(--text-primary)]">MindFlow</span>
          </div>
          <div className="flex flex-wrap gap-4">
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
