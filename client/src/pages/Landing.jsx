import React, { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  Zap,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandMark from '../components/BrandMark';
import Button from '../components/ui/Button';
import HeroInteractiveDemo from '../components/landing/HeroInteractiveDemo';
import RetentionSimulator from '../components/landing/RetentionSimulator';
import { playSound } from '../utils/soundEngine';

const TESTIMONIALS = [
  {
    quote: "Uploaded my 5th sem DBMS & Operating Systems lecture PDFs the night before CIA exams. MindFlow's active recall cards saved my internal marks!",
    name: "Rohan Sharma",
    role: "Computer Science (CSE), DSU Bangalore",
  },
  {
    quote: "The adaptive quiz engine automatically highlighted my weak Signal Processing topics before midterms. I scored 94% in my DSU semester exams.",
    name: "Ananya Deshmukh",
    role: "Electronics & Communication (ECE), DSU",
  },
  {
    quote: "No fluff or useless dashboard clutter. Just clean flashcards from our exact DSU lecture PPTs. A must-have for every engineering student.",
    name: "Karthik Venkatesh",
    role: "Data Science (B.Tech), DSU Bangalore",
  },
];

const FEATURES = [
  {
    icon: FileText,
    title: "Document Parsing Engine",
    desc: "Extracts key concepts, definitions, and equations from lecture PDFs, slides, and raw text outlines.",
  },
  {
    icon: Layers,
    title: "Leitner Spaced Repetition",
    desc: "Schedules review sessions right before memory decay occurs according to the Ebbinghaus curve.",
  },
  {
    icon: Zap,
    title: "Adaptive Assessment Engine",
    desc: "Quiz questions dynamically adjust difficulty (Foundational → Balanced → Advanced) based on topic mastery.",
  },
  {
    icon: BarChart3,
    title: "Habit Heatmap & Analytics",
    desc: "Track your 84-day study habit streak, daily card velocity, and mastery breakdown in a clean desk view.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Import Lecture Source",
    desc: "Upload lecture PDFs, slides, or paste outline text. No manual card writing required.",
  },
  {
    step: "02",
    title: "Synthesize Study Deck",
    desc: "MindFlow structures active recall flashcards and distractor-tested multiple choice items.",
  },
  {
    step: "03",
    title: "Execute Spaced Review",
    desc: "Review due cards daily via keyboard hotkeys (`Space`, `1-4`) with Web Audio haptics.",
  },
];

const Landing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);

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
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] antialiased font-sans">
      {/* 1. Translucent Apple Navigation Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navScrolled
            ? 'border-b border-[rgba(255,255,255,0.6)] bg-[var(--bg-base)]/75 backdrop-blur-[20px] saturate-[180%] shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <BrandMark />
              <span className="font-heading text-lg font-bold tracking-tight text-[var(--text-primary)]">
                MindFlow
              </span>
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              <a href="#simulator" className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Memory Model
              </a>
              <a href="#features" className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Architecture
              </a>
              <a href="#how" className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Workflow
              </a>
              <a href="#testimonials" className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Reviews
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-2">
                Sign In
              </Link>
              <Motion.div whileTap={{ scale: 0.97 }}>
                <Button size="sm" rightIcon={ArrowRight} onClick={() => navigate('/register')}>
                  Start Free
                </Button>
              </Motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-28 pb-14 sm:pt-32 sm:pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Hero Left Column */}
            <Motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="space-y-6 text-left"
            >
              {/* Main Optical Headline */}
              <h1 className="font-heading text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl md:text-5xl lg:text-6xl leading-[1.08] tracking-tight">
                Structured Active Recall for Complex Coursework.
              </h1>

              {/* Subheadline */}
              <p className="max-w-xl text-sm text-[var(--text-secondary)] sm:text-base md:text-lg leading-relaxed">
                Import lecture slides, PDFs, or raw outlines. MindFlow parses section hierarchies, synthesizes active recall flashcard pairs, and builds Leitner SRS review queues.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center pt-2">
                <Motion.div whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full justify-center" rightIcon={ArrowRight} onClick={() => navigate('/register')}>
                    Start Free Sprint
                  </Button>
                </Motion.div>
                <Motion.div whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Button size="lg" variant="secondary" className="w-full justify-center" onClick={() => navigate('/demo/flashcards')}>
                    Try Live Demo Deck
                  </Button>
                </Motion.div>
              </div>
            </Motion.div>

            {/* Hero Right Column — Interactive Product Showcase */}
            <Motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: 0.1 }}
            >
              <HeroInteractiveDemo />
            </Motion.div>
          </div>
        </div>
      </section>

      {/* 3. Scientific Ebbinghaus Retention Simulator */}
      <section id="simulator" className="py-14 sm:py-20 border-y border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          >
            <RetentionSimulator />
          </Motion.div>
        </div>
      </section>

      {/* 4. Core Feature Pillars Bento Grid */}
      <section id="features" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] font-mono">
              ACTIVE RECALL MECHANICS
            </span>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Engineered For Exam Preparation.
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Grounded in neuroscience principles to maintain high retention with predictable review schedules.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-16 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <Motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="rounded-[20px] border border-[var(--border)] bg-white p-6 space-y-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)]">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-heading text-base font-bold text-[var(--text-primary)] tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {feat.desc}
                  </p>
                </Motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. 3-Step Process Walkthrough */}
      <section id="how" className="py-16 sm:py-24 border-t border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] font-mono">
              WORKFLOW
            </span>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              From PDF Source to Spaced Queue.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-16 sm:gap-8 md:grid-cols-3">
            {STEPS.map((st, index) => (
              <Motion.div
                key={st.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: index * 0.1 }}
                className="relative rounded-[20px] border border-[var(--border)] bg-white p-6 sm:p-8 text-left space-y-4 shadow-sm"
              >
                <span className="font-mono text-2xl font-bold text-[var(--text-muted)]">
                  {st.step}
                </span>
                <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] tracking-tight">
                  {st.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {st.desc}
                </p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DSU Student Testimonials Carousel */}
      <section id="testimonials" className="py-16 sm:py-24 border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] font-mono">
            STUDENT REVIEWS
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Trusted by DSU Students.
          </h2>

          <div className="relative mt-8 sm:mt-12 min-h-[160px] rounded-[20px] sm:rounded-[24px] border border-[var(--border)] bg-white p-5 sm:p-8 shadow-sm">
            <AnimatePresence mode="wait">
              <Motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                className="space-y-6"
              >
                <blockquote className="text-sm text-[var(--text-primary)] sm:text-base md:text-lg leading-relaxed font-medium italic">
                  "{TESTIMONIALS[currentTestimonial].quote}"
                </blockquote>

                <div className="text-center">
                    <div className="text-sm font-bold text-[var(--text-primary)]">
                      {TESTIMONIALS[currentTestimonial].name}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {TESTIMONIALS[currentTestimonial].role}
                    </div>
                </div>
              </Motion.div>
            </AnimatePresence>

            {/* Testimonial Nav Buttons */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <Motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setCurrentTestimonial((p) => (p + TESTIMONIALS.length - 1) % TESTIMONIALS.length);
                  playSound('click');
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
              >
                <ChevronLeft size={16} />
              </Motion.button>
              <span className="font-mono text-xs text-[var(--text-muted)]">
                {currentTestimonial + 1} / {TESTIMONIALS.length}
              </span>
              <Motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setCurrentTestimonial((p) => (p + 1) % TESTIMONIALS.length);
                  playSound('click');
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
              >
                <ChevronRight size={16} />
              </Motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="py-14 sm:py-20 border-t border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Start Your Next Study Sprint.
          </h2>
          <p className="max-w-xl mx-auto text-sm text-[var(--text-secondary)] leading-relaxed">
            Upload lecture notes or slide decks to generate active recall cards and Leitner spaced repetition queues.
          </p>
          <div className="pt-2 flex justify-center">
            <Motion.div whileTap={{ scale: 0.97 }}>
              <Button size="lg" rightIcon={ArrowRight} onClick={() => navigate('/register')}>
                Create Free Account
              </Button>
            </Motion.div>
          </div>
        </div>
      </section>

      {/* 8. Tier 1 Apple-Grade Footer */}
      <footer className="border-t border-[var(--border)] bg-white py-12 text-xs text-[var(--text-muted)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 mb-12 text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <BrandMark />
                <span className="font-heading text-base font-bold text-[var(--text-primary)]">
                  MindFlow
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                The spaced repetition engine for master-level studying. Built with pure Web Audio synthesis & Leitner algorithms.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-semibold uppercase tracking-wider text-[var(--text-primary)] font-mono">
                Product
              </div>
              <ul className="space-y-1.5">
                <li><a href="#simulator" className="hover:text-[var(--text-primary)] transition-colors">Ebbinghaus Simulator</a></li>
                <li><a href="#features" className="hover:text-[var(--text-primary)] transition-colors">Adaptive Quiz Engine</a></li>
                <li><a href="#features" className="hover:text-[var(--text-primary)] transition-colors">Heatmap Analytics</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-semibold uppercase tracking-wider text-[var(--text-primary)] font-mono">
                Study Modes
              </div>
              <ul className="space-y-1.5">
                <li><Link to="/demo/flashcards" className="hover:text-[var(--text-primary)] transition-colors">Leitner Flashcards</Link></li>
                <li><Link to="/demo/quiz" className="hover:text-[var(--text-primary)] transition-colors">Multiple Choice Quiz</Link></li>
                <li><Link to="/upload" className="hover:text-[var(--text-primary)] transition-colors">PDF Note Parser</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-semibold uppercase tracking-wider text-[var(--text-primary)] font-mono">
                Account
              </div>
              <ul className="space-y-1.5">
                <li><Link to="/login" className="hover:text-[var(--text-primary)] transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-[var(--text-primary)] transition-colors">Register Account</Link></li>
                <li><Link to="/settings" className="hover:text-[var(--text-primary)] transition-colors">Sound Preferences</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              © {new Date().getFullYear()} MindFlow Inc. All rights reserved. Built for master-level learning.
            </div>
            <div className="flex items-center gap-4 font-mono">
              <Link to="/privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy Policy</Link>
              <span>·</span>
              <Link to="/terms" className="hover:text-[var(--text-primary)] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
