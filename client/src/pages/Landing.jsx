import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  FileText,
  Layers3,
  Play,
  Sparkles,
  Target,
  Upload,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandMark from '../components/BrandMark';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const features = [
  {
    icon: Upload,
    eyebrow: '01 · Import',
    title: 'Start with what you already have.',
    description: 'Drop in a lecture PDF, transcript, or text note. MindFlow turns raw material into a clean study source.',
    accent: 'violet',
  },
  {
    icon: BrainCircuit,
    eyebrow: '02 · Understand',
    title: 'Build active recall automatically.',
    description: 'Generate focused flashcards and quizzes that give every concept a place in your revision loop.',
    accent: 'cyan',
  },
  {
    icon: BarChart3,
    eyebrow: '03 · Improve',
    title: 'See what is actually sticking.',
    description: 'Use spaced repetition, adaptive quizzes, and analytics to spend your next hour where it matters.',
    accent: 'emerald',
  },
];

const proofPoints = [
  { value: 'One workspace', label: 'source → recall → progress' },
  { value: 'Less setup', label: 'more time actually studying' },
  { value: 'Built for focus', label: 'clear next step every time' },
];

const LandingPreview = () => (
  <div className="landing-preview" aria-label="MindFlow workspace preview">
    <div className="landing-preview-bar">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-rose-400" />
        <span className="h-2 w-2 rounded-full bg-amber-300" />
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
      </div>
      <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-faint)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
        live workspace
      </div>
    </div>

    <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[0.78fr_1.22fr]">
      <div className="landing-preview-sidebar">
        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
          <BrandMark className="h-8 w-8 rounded-[10px]" />
          <div>
            <div className="text-xs font-bold">MindFlow</div>
            <div className="text-[10px] text-[var(--text-faint)]">Study workspace</div>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          {[
            { icon: Layers3, label: 'Overview', active: true },
            { icon: BookOpen, label: 'Flashcards' },
            { icon: Target, label: 'Quizzes' },
            { icon: BarChart3, label: 'Analytics' },
          ].map(({ icon: Icon, label, active }) => (
            <div key={label} className={`landing-preview-nav ${active ? 'landing-preview-nav--active' : ''}`}>
              <Icon size={13} />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-xl border border-[var(--border)] bg-[rgba(139,92,246,0.08)] p-3">
          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
            <span>Weekly goal</span>
            <span className="font-mono text-[var(--accent-light)]">68%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/20">
            <div className="h-full w-[68%] rounded-full bg-[var(--accent)]" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--accent-light)]">Tuesday, October 24</div>
            <div className="mt-1 text-xl font-bold tracking-tight text-white">Good evening, Alex.</div>
          </div>
          <div className="rounded-full border border-[var(--border)] bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-[var(--text-muted)]">7 day streak</div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Reviewed', value: '24', icon: Check, color: 'text-[var(--success)]' },
            { label: 'Accuracy', value: '86%', icon: Target, color: 'text-[var(--accent-light)]' },
            { label: 'Focus time', value: '42m', icon: Zap, color: 'text-[var(--warm)]' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl border border-[var(--border)] bg-white/[0.025] p-3">
              <Icon size={13} className={color} />
              <div className="mt-2 text-base font-bold text-white">{value}</div>
              <div className="mt-0.5 text-[9px] text-[var(--text-faint)]">{label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[var(--border-accent)] bg-[linear-gradient(135deg,rgba(139,92,246,0.2),rgba(15,23,42,0.72))] p-4 shadow-[0_18px_35px_rgba(76,29,149,0.18)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent-light)]">
                <Sparkles size={12} />
                Suggested next
              </div>
              <div className="mt-2 text-sm font-bold text-white">Review distributed systems</div>
              <div className="mt-1 text-[10px] leading-5 text-[var(--text-secondary)]">12 cards are due. You are strongest on consensus and weakest on replication.</div>
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
              <ArrowRight size={14} />
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-white/[0.025] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[var(--text-muted)]">Recent source</span>
              <FileText size={13} className="text-[var(--text-faint)]" />
            </div>
            <div className="mt-3 truncate text-xs font-semibold text-white">Distributed_Systems_Lec3.pdf</div>
            <div className="mt-1 text-[10px] text-[var(--text-faint)]">24 cards · 15 questions</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-white/[0.025] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[var(--text-muted)]">Mastery trend</span>
              <BarChart3 size={13} className="text-[var(--success)]" />
            </div>
            <div className="mt-3 flex h-7 items-end gap-1">
              {[35, 46, 40, 62, 54, 74, 86].map((height, index) => <span key={index} className="flex-1 rounded-t bg-[var(--success)]/70" style={{ height: `${height}%` }} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Landing = () => {
  const { user, loading } = useAuth();

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="app-shell overflow-hidden">
      <div className="page-shell pb-20 pt-5 sm:pb-28 sm:pt-7">
        <nav className="flex items-center justify-between border-b border-white/[0.07] pb-5">
          <Link to="/" className="flex items-center gap-3" aria-label="MindFlow home">
            <BrandMark />
            <div>
              <div className="font-heading text-base font-bold tracking-tight text-white">MindFlow</div>
              <div className="text-[11px] text-[var(--text-muted)]">AI study workspace</div>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/register"><Button size="sm" rightIcon={ArrowRight}>Start studying</Button></Link>
          </div>
        </nav>

        <main>
          <section className="grid items-center gap-12 py-16 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16 lg:py-24">
            <Motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="pill-badge"><Sparkles size={13} className="text-[var(--accent-light)]" /> A calmer way to learn</div>
              <h1 className="font-heading mt-6 max-w-2xl text-5xl font-bold leading-[1.02] tracking-[-0.065em] text-white sm:text-6xl lg:text-[4.55rem]">
                Turn information into <span className="headline-accent">momentum.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
                MindFlow turns the notes you already have into a focused study loop—so you can move from upload to understanding without losing the thread.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/register"><Button size="lg" rightIcon={ArrowRight}>Build my workspace</Button></Link>
                <a href="#how-it-works"><Button size="lg" variant="secondary" leftIcon={Play}>See how it works</Button></a>
              </div>
              <div className="mt-8 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                <div className="flex -space-x-2">
                  {['A', 'M', 'J'].map((initial, index) => <span key={initial} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--bg-base)] bg-[var(--bg-elevated)] text-[10px] font-bold text-[var(--accent-light)]" style={{ opacity: 1 - index * 0.12 }}>{initial}</span>)}
                </div>
                <span>Made for the next focused study session.</span>
              </div>
            </Motion.div>

            <Motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.08 }}>
              <LandingPreview />
            </Motion.div>
          </section>

          <section className="grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
            {proofPoints.map((point) => <div key={point.value} className="bg-[rgba(13,18,32,0.92)] px-5 py-5 sm:px-6"><div className="text-sm font-bold text-white">{point.value}</div><div className="mt-1 text-xs text-[var(--text-muted)]">{point.label}</div></div>)}
          </section>

          <section id="how-it-works" className="scroll-mt-8 py-20 sm:py-28">
            <div className="max-w-2xl">
              <div className="kicker"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> The learning loop</div>
              <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">Everything you need to keep moving.</h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-[var(--text-secondary)]">The product gets out of the way. Every screen answers the same question: what is the most useful next step?</p>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {features.map(({ icon: Icon, eyebrow, title, description, accent }, index) => (
                <Motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.06 }}>
                  <Card className="h-full p-6 sm:p-7">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent === 'emerald' ? 'bg-[var(--success-soft)] text-[var(--success)]' : accent === 'cyan' ? 'bg-cyan-400/10 text-cyan-300' : 'bg-[var(--bg-strong)] text-[var(--accent-light)]'}`}><Icon size={19} /></div>
                    <div className="mt-7 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-faint)]">{eyebrow}</div>
                    <h3 className="mt-3 text-xl font-bold leading-tight text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{description}</p>
                    <div className="mt-7 flex items-center gap-1 text-xs font-semibold text-[var(--accent-light)]">Explore the flow <ChevronRight size={14} /></div>
                  </Card>
                </Motion.div>
              ))}
            </div>
          </section>

          <section className="grid items-center gap-8 rounded-3xl border border-[var(--border-accent)] bg-[linear-gradient(120deg,rgba(139,92,246,0.16),rgba(15,23,42,0.8)_58%,rgba(8,11,20,0.92))] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12">
            <div>
              <div className="kicker"><Zap size={13} /> Start with one source</div>
              <h2 className="font-heading mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Your next study session should already know where to begin.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">Upload a source, generate your first recall set, and leave with a clearer map of what you know.</p>
            </div>
            <Link to="/register"><Button size="lg" rightIcon={ArrowRight}>Create free workspace</Button></Link>
          </section>
        </main>

        <footer className="mt-14 flex flex-col gap-4 border-t border-white/[0.07] pt-6 text-xs text-[var(--text-faint)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2"><BrandMark className="h-6 w-6 rounded-lg" /><span>MindFlow · Study with intention.</span></div>
          <div className="flex items-center gap-4"><Link to="/login" className="transition-colors hover:text-white">Sign in</Link><Link to="/register" className="transition-colors hover:text-white">Get started</Link></div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
