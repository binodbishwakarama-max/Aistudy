import React from 'react';
import { motion as Motion } from 'framer-motion';
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandMark from '../components/BrandMark';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const problems = [
  'Students waste time turning messy notes into usable revision material.',
  'Quiz apps, flashcards, and note tools live in separate workflows.',
  'Momentum drops when the interface feels heavy before studying even starts.',
];

const features = [
  {
    icon: Upload,
    title: 'Upload notes and PDFs',
    description: 'Bring in lecture slides, raw notes, or reading packs without manual cleanup first.',
  },
  {
    icon: Sparkles,
    title: 'Generate flashcards instantly',
    description: 'Turn the source into concise prompts and answers tuned for active recall.',
  },
  {
    icon: BrainCircuit,
    title: 'Run quiz-based checks',
    description: 'Pressure test understanding with MCQs and review explanations in one flow.',
  },
  {
    icon: TimerReset,
    title: 'Keep revision moving',
    description: 'Jump between review, quizzes, and progress tracking without rebuilding context.',
  },
];

const testimonials = [
  {
    quote: 'MindFlow makes a 90-minute exam prep block feel structured in the first five minutes.',
    name: 'Ava, medical student',
  },
  {
    quote: 'It feels more like a focused product and less like juggling three study tools together.',
    name: 'Daniel, engineering major',
  },
  {
    quote: 'The dashboard makes it obvious what I uploaded, what I reviewed, and what to do next.',
    name: 'Mina, grad researcher',
  },
];

const stats = [
  { label: 'Notes processed', value: '10,000+' },
  { label: 'Avg. setup time', value: '< 60 sec' },
  { label: 'Study modes', value: 'Flashcards + Quiz + Review' },
];

const workflow = [
  { step: '01', title: 'Import material', detail: 'Drop in a PDF, lecture notes, or raw text file.' },
  { step: '02', title: 'Generate study assets', detail: 'Create flashcards, review sheets, and quizzes from the same source.' },
  { step: '03', title: 'Review in one workspace', detail: 'Track progress, revisit sessions, and keep momentum without tool switching.' },
];

const Landing = () => {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="app-shell overflow-hidden">
      <div className="page-shell pb-16 pt-6 sm:pb-24">
        <nav className="flex flex-wrap items-center justify-between gap-4 py-2 sm:py-3">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark />
            <div>
              <div className="font-heading text-lg font-bold tracking-tight">MindFlow</div>
              <div className="text-sm text-[var(--text-muted)]">AI-powered study assistant</div>
            </div>
          </Link>

          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <Link to="/login" className="hidden sm:inline-flex">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/register" className="w-full sm:w-auto">
              <Button rightIcon={ArrowRight} className="w-full justify-center sm:w-auto">
                Get Started Free
              </Button>
            </Link>
          </div>
        </nav>

        <section className="grid items-center gap-8 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-24">
          <Motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }} className="max-w-3xl">
            <div className="pill-badge border-[rgba(26,115,232,0.18)] bg-[rgba(26,115,232,0.1)] text-[var(--accent)]">
              <Sparkles size={14} />
              Built for focused, modern study workflows
            </div>
            <h1 className="font-heading mt-6 text-4xl font-bold leading-[1.02] tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl xl:text-7xl">
              Turn raw notes into a study system that actually keeps moving.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--text-secondary)] sm:text-xl">
              MindFlow transforms PDFs and notes into flashcards, quizzes, and smart review flows so students spend less
              time formatting and more time remembering.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" rightIcon={ArrowRight} className="w-full justify-center sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <a href="#product-demo" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" leftIcon={PlayCircle} className="w-full justify-center sm:w-auto">
                  See Demo
                </Button>
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <Card key={item.label} className="p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{item.label}</div>
                  <div className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">{item.value}</div>
                </Card>
              ))}
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="relative"
          >
            <div className="pointer-events-none absolute -left-8 top-8 h-32 w-32 rounded-full bg-[rgba(26,115,232,0.12)] blur-3xl" />
            <div className="pointer-events-none absolute -right-2 bottom-10 h-36 w-36 rounded-full bg-[rgba(242,153,0,0.14)] blur-3xl" />

            <Card className="relative overflow-hidden rounded-[32px] p-5 sm:p-6">
              <div className="rounded-[26px] border border-[rgba(255,255,255,0.62)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(244,247,252,0.96))] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-5">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">Today&apos;s study flow</div>
                    <div className="mt-1 text-xs text-[var(--text-muted)]">Binary search lecture notes</div>
                  </div>
                  <span className="rounded-full border border-[rgba(24,128,56,0.18)] bg-[rgba(24,128,56,0.08)] px-3 py-1 text-xs font-semibold text-[var(--success)]">
                    Ready to review
                  </span>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
                  <div className="space-y-4">
                    <Card variant="accent" className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Flashcard preview</div>
                          <div className="mt-3 text-lg font-semibold leading-8">
                            What is the time complexity of binary search on a sorted array?
                          </div>
                        </div>
                        <div className="rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-[var(--accent)] shadow-[var(--shadow-soft)]">
                          Card 04 / 15
                        </div>
                      </div>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        {['Again', 'Hard', 'Good', 'Easy'].map((rating) => (
                          <div key={rating} className="rounded-2xl border border-[var(--border)] bg-white px-3 py-3 text-center text-sm font-medium">
                            {rating}
                          </div>
                        ))}
                      </div>
                    </Card>

                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        { title: 'Source', value: '42 slides parsed' },
                        { title: 'Flashcards', value: '15 generated' },
                        { title: 'Quiz', value: '12 questions ready' },
                      ].map((item) => (
                        <Card key={item.title} className="p-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">{item.title}</div>
                          <div className="mt-3 text-sm font-semibold leading-6">{item.value}</div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card className="p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Workflow</div>
                      <div className="mt-4 space-y-4">
                        {workflow.map((item) => (
                          <div key={item.step} className="flex gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-sm font-semibold text-[var(--accent)]">
                              {item.step}
                            </div>
                            <div>
                              <div className="text-sm font-semibold">{item.title}</div>
                              <p className="mt-1 text-xs leading-6 text-[var(--text-secondary)]">{item.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-[var(--accent)]">
                          <GraduationCap size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Focus first, features second</div>
                          <div className="text-xs text-[var(--text-muted)]">Designed to reduce setup friction.</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </Motion.div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <Card variant="dark" className="p-8">
            <div className="kicker text-white/70">Problem to Solution</div>
            <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight text-white">Students already have enough cognitive load.</h2>
            <p className="mt-4 text-sm leading-7 text-white/78">
              MindFlow removes the busywork between collecting material and actually revising it, so the product feels
              like a study accelerator rather than another admin task.
            </p>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {problems.map((item, index) => (
              <Card key={item} className="p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Pain point {index + 1}</div>
                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{item}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10" id="features">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="kicker">Features</div>
              <h2 className="font-heading mt-3 text-4xl font-bold tracking-tight">Everything needed for the first study loop.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
              Premium, clear, and intentional. No cluttered control panels. No dead-end screens. Just the actions that
              help students start and continue.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => (
              <Motion.div key={feature.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                <Card className="h-full p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-[var(--accent)]">
                    <feature.icon size={20} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{feature.description}</p>
                </Card>
              </Motion.div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]" id="product-demo">
          <Card className="overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="kicker">Product demo</div>
                <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight">A workflow that mirrors how students actually work.</h2>
              </div>
              <div className="hidden rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] sm:block">
                Live preview concept
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {workflow.map((item) => (
                <Card key={item.step} variant="accent" className="p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Step {item.step}</div>
                  <div className="mt-3 text-lg font-semibold">{item.title}</div>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.detail}</p>
                </Card>
              ))}
            </div>
          </Card>

          <div className="grid gap-4">
            {testimonials.map((item) => (
              <Card key={item.name} className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-1 text-[var(--success)]" />
                  <div>
                    <p className="text-sm leading-7 text-[var(--text-secondary)]">"{item.quote}"</p>
                    <div className="mt-4 text-sm font-semibold text-[var(--text-primary)]">{item.name}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
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
              <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.body}</p>
            </Card>
          ))}
        </section>

        <section className="mt-12">
          <Card variant="accent" className="overflow-hidden p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="kicker">Call to action</div>
                <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Start learning smarter, not slower.</h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--text-secondary)]">
                  Upload a source, generate your first set, and move through the whole study cycle in one polished
                  workspace.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link to="/register" className="w-full">
                  <Button size="lg" rightIcon={ArrowRight} className="w-full min-w-[220px] justify-center">
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

        <footer className="mt-10 flex flex-col gap-4 border-t border-[var(--border)] py-6 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark />
            <span>MindFlow</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#features">Features</a>
            <a href="#product-demo">Demo</a>
            <Link to="/login">Login</Link>
            <Link to="/register">Get started</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
