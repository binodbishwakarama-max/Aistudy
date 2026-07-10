import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileStack,
  GraduationCap,
  LayoutPanelTop,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Upload,
  ChevronLeft,
  ChevronRight,
  Code,
  BookOpen,
  Trophy,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandMark from '../components/BrandMark';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const problems = [
  {
    title: 'Wasted Time',
    desc: 'Students waste hours turning messy lecture notes and raw PDFs into study guides.',
  },
  {
    title: 'Fragmented Tools',
    desc: 'Flashcards, quizzes, and tracking tools are scattered across different apps.',
  },
  {
    title: 'Friction & Fatigue',
    desc: 'Momentum drops when complex interfaces get in the way of starting your session.',
  },
];

const testimonials = [
  {
    quote: 'MindFlow makes a 90-minute exam prep block feel structured in the first five minutes.',
    name: 'Ava Larson',
    role: 'Medical Student',
    avatar: 'AL',
  },
  {
    quote: 'It feels more like a focused workspace and less like juggling three separate tools.',
    name: 'Daniel Chen',
    role: 'Engineering Major',
    avatar: 'DC',
  },
  {
    quote: 'The dashboard makes it obvious what I uploaded, what I reviewed, and what to do next.',
    name: 'Mina Sarto',
    role: 'Grad Researcher',
    avatar: 'MS',
  },
];

const stats = [
  { label: 'Files Analyzed', value: '45,000+' },
  { label: 'Setup Time', value: '< 10 Sec' },
  { label: 'Active Learners', value: '12,000+' },
];

const MockupWorkspace = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [chatStep, setChatStep] = useState(0);

  const chatMessages = [
    "Analyzing 'Distributed Systems.pdf'...",
    "Found 12 main concepts. Generating flashcards...",
    "Flashcards generated! Ready to test active recall.",
  ];

  useEffect(() => {
    let charIndex = 0;
    let messageIndex = 0;
    let textInterval;

    const startTyping = () => {
      const currentMessage = chatMessages[messageIndex];
      textInterval = setInterval(() => {
        setTypedText(currentMessage.substring(0, charIndex));
        charIndex++;
        if (charIndex > currentMessage.length) {
          clearInterval(textInterval);
          setTimeout(() => {
            messageIndex = (messageIndex + 1) % chatMessages.length;
            setChatStep(messageIndex);
            charIndex = 0;
            startTyping();
          }, 3000);
        }
      }, 35);
    };

    startTyping();
    return () => clearInterval(textInterval);
  }, []);

  return (
    <Card className="relative overflow-hidden rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[rgba(10,12,17,0.7)] backdrop-blur-xl shadow-2xl p-0">
      {/* Top Window Header */}
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(16,18,27,0.4)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="text-[10px] text-[var(--text-muted)] font-mono tracking-wider uppercase">mindflow.ai/workspace</div>
        <div className="w-12" />
      </div>

      <div className="p-6 space-y-6">
        {/* Row 1: Active Document Info & Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">Active Session</div>
            <h4 className="text-base font-bold text-white mt-1">Distributed Systems Notes</h4>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.06)] px-3 py-1 text-xs font-semibold text-[var(--success)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            Workspace Loaded
          </span>
        </div>

        {/* Row 2: Interactive 3D Recall Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Click card to test recall</span>
            <span className="font-semibold text-[var(--accent)]">Card 03 of 12</span>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative w-full h-[160px] cursor-pointer perspective-1000 preserve-3d"
          >
            <Motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-full h-full relative preserve-3d"
            >
              {/* Card Front */}
              <div className="absolute inset-0 backface-hidden flex flex-col justify-between p-5 rounded-2xl bg-[linear-gradient(135deg,rgba(99,102,241,0.08),rgba(16,18,27,0.9))] border border-[var(--border-accent)]">
                <div>
                  <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Question</span>
                  <p className="mt-2 text-sm md:text-base font-semibold leading-relaxed text-white">
                    What is the primary difference between stateful and stateless replication?
                  </p>
                </div>
                <div className="text-xs text-[var(--text-muted)] text-right">Click to reveal answer</div>
              </div>

              {/* Card Back */}
              <div className="absolute inset-0 backface-hidden flex flex-col justify-between p-5 rounded-2xl bg-[linear-gradient(135deg,rgba(139,92,246,0.08),rgba(16,18,27,0.9))] border border-[var(--border-accent)] [transform:rotateY(180deg)]">
                <div>
                  <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Correct Answer</span>
                  <p className="mt-2 text-xs md:text-sm leading-relaxed text-[var(--text-secondary)]">
                    Stateful tracks ongoing connection data and coordinates locks, while stateless processes requests independently.
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <span className="px-2 py-1 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] rounded text-[10px] text-[var(--success)]">Easy</span>
                  <span className="px-2 py-1 bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)] rounded text-[10px] text-[var(--accent)]">Next</span>
                </div>
              </div>
            </Motion.div>
          </div>
        </div>

        {/* Row 3: AI Chat Simulation */}
        <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-4 flex gap-3 items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgba(99,102,241,0.15)] flex items-center justify-center text-[var(--accent)] border border-[rgba(99,102,241,0.2)]">
            <Sparkles size={14} className="animate-spin-slow" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">MindFlow Assistant</span>
              <span className="text-[10px] text-[var(--text-muted)]">Active</span>
            </div>
            <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed min-h-[32px] font-mono">
              {typedText}
              <span className="w-1 h-3.5 ml-0.5 bg-[var(--accent)] inline-block animate-pulse" />
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

const Landing = () => {
  const { user, loading } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="app-shell overflow-hidden relative">
      <div className="page-shell pb-24 pt-6">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.03)]">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark />
            <div>
              <div className="font-heading text-lg font-bold tracking-tight text-white">MindFlow</div>
              <div className="text-xs text-[var(--text-muted)]">AI Study Studio</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button rightIcon={ArrowRight}>Get Started Free</Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border-accent)] bg-[rgba(99,102,241,0.07)] text-xs text-[var(--accent-light)] font-medium">
              <Sparkles size={12} className="text-[var(--accent)]" />
              <span>Next-Gen Study Workflow</span>
            </div>

            <h1 className="font-heading mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Turn messy notes into a study system that{' '}
              <span className="bg-[linear-gradient(90deg,#818cf8,#c084fc,#f472b6)] bg-clip-text text-transparent">
                flows.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
              Upload your PDFs, slides, or raw readings. MindFlow processes them instantly into structured study guides,
              3D flashcards, and checks that adapt as you improve.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" rightIcon={ArrowRight} className="shadow-[0_0_30px_rgba(99,102,241,0.25)]">
                  Get Started Free
                </Button>
              </Link>
              <a href="#demo">
                <Button size="lg" variant="secondary" leftIcon={PlayCircle}>
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-[rgba(255,255,255,0.05)] pt-8">
              {stats.map((item) => (
                <div key={item.label}>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">{item.label}</div>
                  <div className="text-xl md:text-2xl font-bold text-white mt-1">{item.value}</div>
                </div>
              ))}
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <MockupWorkspace />
          </Motion.div>
        </section>

        {/* Problems & Contrast Section */}
        <section className="py-12 border-t border-[rgba(255,255,255,0.03)]">
          <div className="grid gap-6 lg:grid-cols-3">
            {problems.map((prob, i) => (
              <Card key={prob.title} className="p-6 border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Problem 0{i + 1}</div>
                <h3 className="text-lg font-bold text-white mt-3">{prob.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{prob.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="py-16 space-y-12" id="demo">
          <div className="max-w-3xl">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">Modular Ecosystem</span>
            <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Engineered for seamless learning loops.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              No tabs overload, no context switching. Our Bento features compile your upload into immediate interactive outputs.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Large Span */}
            <Card className="col-span-1 md:col-span-2 p-8 flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(99,102,241,0.12)] text-[var(--accent)] border border-[rgba(99,102,241,0.15)]">
                  <Upload size={20} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">Intelligent Document Parsing</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
                  Upload raw PDFs, lecture transcriptions, or reading materials. Our system filters out the noise and highlights essential principles automatically.
                </p>
              </div>

              {/* Mock Content inside Bento */}
              <div className="mt-6 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] p-4 font-mono text-[11px] text-[var(--text-secondary)] space-y-2">
                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] pb-2 text-[var(--text-muted)]">
                  <span>Distributed_Systems_Lec3.pdf</span>
                  <span>Parser active</span>
                </div>
                <p>
                  "A <span className="text-[var(--accent-light)] font-semibold bg-[rgba(99,102,241,0.15)] px-1 rounded">consensus protocol</span> enables distributed nodes to agree on a state even under network partitions."
                </p>
              </div>
            </Card>

            {/* Bento Card 2: 1-Column Span */}
            <Card className="p-8 flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(245,158,11,0.12)] text-[var(--warm)] border border-[rgba(245,158,11,0.15)]">
                  <BrainCircuit size={20} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">Active Recall</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  Turn long articles into bite-sized questions designed for spaced repetition.
                </p>
              </div>

              {/* Card Stack Graphic Mockup */}
              <div className="mt-6 relative h-20 w-full flex items-center justify-center">
                <div className="absolute w-[80%] h-12 rounded-xl bg-[rgba(16,18,27,0.8)] border border-[rgba(255,255,255,0.03)] transform translate-y-3 opacity-40" />
                <div className="absolute w-[88%] h-12 rounded-xl bg-[rgba(16,18,27,0.9)] border border-[rgba(255,255,255,0.06)] transform translate-y-1.5 opacity-70" />
                <div className="absolute w-full h-12 rounded-xl bg-[rgba(20,24,35,1)] border border-[var(--border-accent)] flex items-center justify-between px-4 text-xs font-semibold text-white shadow-lg">
                  <span>How does Paxos guarantee safety?</span>
                  <span className="text-[10px] text-[var(--accent)]">Card 02</span>
                </div>
              </div>
            </Card>

            {/* Bento Card 3: 1-Column Span */}
            <Card className="p-8 flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(16,185,129,0.12)] text-[var(--success)] border border-[rgba(16,185,129,0.15)]">
                  <TimerReset size={20} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">Interactive Quizzing</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  Test your understanding with instant quizzes that adjust check parameters in real-time.
                </p>
              </div>

              {/* Mock MCQ Choices */}
              <div className="mt-6 space-y-2">
                <div className="w-full p-2.5 rounded-lg border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.06)] flex items-center justify-between text-xs text-[var(--success)] font-medium">
                  <span>Option A: Consensus consistency</span>
                  <CheckCircle2 size={12} />
                </div>
                <div className="w-full p-2.5 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] text-xs text-[var(--text-muted)]">
                  <span>Option B: Thread locking concurrency</span>
                </div>
              </div>
            </Card>

            {/* Bento Card 4: Large Span */}
            <Card className="col-span-1 md:col-span-2 p-8 flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(236,72,153,0.12)] text-[#ec4899] border border-[rgba(236,72,153,0.15)]">
                  <LayoutPanelTop size={20} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">XP & Habit Gamification</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
                  We integrate streaks, level milestones, and smart review schedules to encourage repeated, focused work sessions.
                </p>
              </div>

              {/* Mock Gamification Tracker */}
              <div className="mt-6 flex flex-wrap gap-4 items-center justify-between border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(245,158,11,0.15)] text-[var(--warm)]">
                    <Trophy size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Daily Streak Active</div>
                    <div className="text-[10px] text-[var(--text-muted)]">6 consecutive study days</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <span
                      key={day + i}
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                        i < 6
                          ? 'bg-[var(--accent)] text-white border border-[rgba(99,102,241,0.3)] shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                          : 'bg-[rgba(255,255,255,0.02)] text-[var(--text-muted)] border border-[rgba(255,255,255,0.05)]'
                      }`}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Testimonials Slider */}
        <section className="py-16 border-t border-[rgba(255,255,255,0.03)]">
          <div className="flex flex-col gap-6 items-center text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">Student Reviews</span>
            <h2 className="font-heading text-3xl font-bold text-white">What active learners say.</h2>

            <div className="relative w-full min-h-[180px] flex items-center justify-center px-8 mt-4">
              <AnimatePresence mode="wait">
                <Motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p className="text-lg md:text-xl font-medium leading-relaxed italic text-[var(--text-secondary)]">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <div className="w-10 h-10 rounded-full bg-[rgba(99,102,241,0.15)] border border-[var(--border-accent)] flex items-center justify-center font-bold text-xs text-white">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">{testimonials[currentTestimonial].name}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{testimonials[currentTestimonial].role}</div>
                    </div>
                  </div>
                </Motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-[var(--text-muted)] font-mono">
                {currentTestimonial + 1} / {testimonials.length}
              </span>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Feature Grid Icons */}
        <section className="py-12 border-t border-[rgba(255,255,255,0.03)] grid gap-8 md:grid-cols-3">
          {[
            {
              icon: FileStack,
              title: 'One source, multiple outputs',
              body: 'Flashcards, quizzes, and review sheets all come from the same uploaded material.',
            },
            {
              icon: LayoutPanelTop,
              title: 'Built like a real product',
              body: 'The UI is structured for repeat usage, not just an isolated demo screen.',
            },
            {
              icon: ShieldCheck,
              title: 'Clear next actions',
              body: 'Students always know whether to upload, review, continue a session, or check analytics.',
            },
          ].map((item) => (
            <Card key={item.title} className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-[var(--accent)]">
                <item.icon size={20} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{item.body}</p>
            </Card>
          ))}
        </section>

        {/* Call to Action Callout */}
        <section className="mt-12">
          <Card variant="accent" className="overflow-hidden p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="kicker">Get Started Today</div>
                <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-5xl text-white">
                  Ready to upgrade your study system?
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
                  Join students automating their study prep. Process slides, notes, and PDF reading packs in seconds.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link to="/register" className="w-full">
                  <Button size="lg" rightIcon={ArrowRight} className="w-full min-w-[220px] justify-center shadow-lg">
                    Start Learning Smarter
                  </Button>
                </Link>
                <Link to="/login" className="w-full">
                  <Button size="lg" variant="secondary" className="w-full min-w-[220px] justify-center">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="mt-16 flex flex-col gap-4 border-t border-[rgba(255,255,255,0.03)] py-8 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark />
            <span className="font-bold text-white">MindFlow Studio</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="hover:text-white transition-colors">Get started</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
