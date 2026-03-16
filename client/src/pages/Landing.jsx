import React from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { Sparkles, Zap, Brain, Trophy, ArrowRight, ShieldCheck, FileText, BookOpen, BarChart3, Layers, Clock, Star, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] relative overflow-hidden grain-overlay">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--accent)]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[300px] bg-[var(--accent)]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-[var(--accent)] text-xl font-bold">✦</span>
            <span className="font-heading font-bold text-lg tracking-tight">MindFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-mindflow hidden sm:block"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="py-2 px-5 bg-[var(--accent)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--accent-light)] transition-mindflow glow-shadow"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-12 lg:pt-28 lg:pb-16 px-6 max-w-5xl mx-auto z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent)]/15 border border-[var(--border-accent)] text-[var(--accent-light)] text-xs font-semibold mb-8 uppercase tracking-widest"
          >
            <Sparkles size={13} />
            AI-Powered Study Tools
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6"
          >
            Study smarter,
            <br className="hidden sm:block" />
            <span className="text-[var(--accent-light)]">not harder.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Transform any PDF, notes, or lecture into flashcards, quizzes, and spaced-repetition schedules — powered by AI.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-[var(--accent)] text-white rounded-xl font-semibold hover:bg-[var(--accent-light)] transition-mindflow glow-shadow flex items-center justify-center gap-2"
            >
              Start Learning Free <ArrowRight size={18} />
            </Link>
            <span className="text-[var(--text-muted)] text-xs font-medium">No credit card required</span>
          </motion.div>
        </motion.div>

        {/* Hero mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-4xl mx-auto mt-16"
        >
          <div className="glass-card rounded-2xl overflow-hidden border-[var(--border)]">
            <div className="h-11 bg-[var(--bg-elevated)] border-b border-[var(--border)] flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[var(--text-muted)]/30" />
                <div className="w-3 h-3 rounded-full bg-[var(--text-muted)]/30" />
                <div className="w-3 h-3 rounded-full bg-[var(--text-muted)]/30" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-4 py-1 text-xs text-[var(--text-muted)] w-56 text-center font-mono">
                  mindflow.app/study
                </div>
              </div>
            </div>
            <div className="p-6 grid grid-cols-3 gap-4 bg-[var(--bg-surface)]/50">
              <div className="col-span-2 glass-card rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-[var(--accent)]/20 rounded-lg flex items-center justify-center">
                    <Layers size={14} className="text-[var(--accent-light)]" />
                  </div>
                  <span className="text-sm font-semibold">Flashcard Study</span>
                  <span className="ml-auto font-mono text-xs text-[var(--text-muted)]">3 / 12</span>
                </div>
                <div className="bg-[var(--bg-elevated)] rounded-lg p-5 border border-[var(--border)] mb-3">
                  <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">Question</p>
                  <p className="text-[var(--text-primary)] font-medium">What is the time complexity of binary search?</p>
                </div>
                <div className="flex gap-2">
                  {['Hard', 'Okay', 'Good', 'Easy'].map((label, i) => (
                    <div
                      key={i}
                      className="flex-1 py-2 text-center rounded-lg text-xs font-semibold border border-[var(--border)]"
                      style={{
                        background: i === 2 ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-elevated)',
                        color: i === 2 ? 'var(--success)' : 'var(--text-secondary)',
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Progress', value: '87%', sub: '↑ 12% this week', color: 'var(--accent)' },
                  { label: 'Streak', value: '7 Days', sub: '🔥', color: 'var(--warm)' },
                  { label: 'XP Today', value: '+120', sub: 'XP', color: 'var(--accent-light)' },
                ].map((stat, i) => (
                  <div key={i} className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 size={12} className="text-[var(--text-muted)]" />
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">{stat.label}</span>
                    </div>
                    <div className="font-mono text-xl font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    {stat.sub && <div className="text-xs text-[var(--success)] font-medium mt-0.5">{stat.sub}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social proof */}
      <section className="py-12 border-y border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['A', 'K', 'S', 'R'].map((l, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[var(--bg-base)] flex items-center justify-center text-xs font-bold"
                    style={{
                      background: ['var(--accent)', 'var(--accent-light)', '#A78BFA', 'var(--warm)'][i],
                      color: 'white',
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-[var(--text-secondary)]">1,200+ students</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-[var(--warm)] fill-[var(--warm)]" />
              ))}
              <span className="text-sm font-medium text-[var(--text-secondary)]">4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-[var(--success)]" />
              <span className="text-sm font-medium text-[var(--text-secondary)]">100% Free to start</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-[var(--accent)] font-semibold text-sm uppercase tracking-widest mb-3">How it works</p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Everything you need to ace your exams
            </h2>
            <p className="text-[var(--text-secondary)] text-lg font-medium">Three powerful tools, one seamless workflow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 glass-card p-8 rounded-2xl hover:border-[var(--border-accent)]"
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-[var(--accent)]/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[var(--border-accent)]">
                  <Zap size={28} className="text-[var(--accent-light)]" />
                </div>
                <div>
                  <div className="text-xs font-mono text-[var(--accent)] uppercase tracking-widest mb-2">Step 01</div>
                  <h3 className="font-heading text-2xl font-bold mb-2">Instant Generation</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Upload any PDF or paste your notes. Our AI transforms them into structured flashcards and quizzes in under 10 seconds.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: FileText, label: 'PDF Upload' },
                  { icon: Layers, label: 'Flashcards' },
                  { icon: BookOpen, label: 'Quiz' },
                ].map((item, i) => (
                  <div key={i} className="glass-card rounded-xl p-3 text-center">
                    <item.icon size={20} className="mx-auto text-[var(--text-muted)] mb-1" />
                    <span className="text-xs font-medium text-[var(--text-secondary)]">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 rounded-2xl hover:border-[var(--border-accent)] flex flex-col"
            >
              <div className="w-14 h-14 bg-[var(--accent)]/20 rounded-2xl flex items-center justify-center mb-5 border border-[var(--border-accent)]">
                <Brain size={28} className="text-[var(--accent-light)]" />
              </div>
              <div className="text-xs font-mono text-[var(--accent)] uppercase tracking-widest mb-2">Step 02</div>
              <h3 className="font-heading text-xl font-bold mb-2">Spaced Repetition</h3>
              <p className="text-[var(--text-secondary)] text-sm flex-1">
                Our SRS algorithm schedules reviews at the optimal time for long-term retention.
              </p>
              <div className="flex items-center gap-2 mt-5">
                <Clock size={14} className="text-[var(--accent)]" />
                <span className="text-xs font-semibold text-[var(--accent-light)]">Scientifically proven</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 rounded-2xl hover:border-[var(--border-accent)] flex flex-col"
            >
              <div className="w-14 h-14 bg-[var(--warm)]/20 rounded-2xl flex items-center justify-center mb-5 border border-[var(--warm)]/30">
                <Trophy size={28} className="text-[var(--warm)]" />
              </div>
              <div className="text-xs font-mono text-[var(--warm)] uppercase tracking-widest mb-2">Step 03</div>
              <h3 className="font-heading text-xl font-bold mb-2">Gamified Progress</h3>
              <p className="text-[var(--text-secondary)] text-sm flex-1">
                Earn XP, level up, and maintain study streaks. Learning feels rewarding.
              </p>
              <div className="flex items-center gap-2 mt-5">
                <Star size={14} className="text-[var(--warm)]" />
                <span className="text-xs font-semibold text-[var(--warm)]">Level up system</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 glass-card p-8 rounded-2xl hover:border-[var(--border-accent)]"
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-[var(--success)]/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[var(--success)]/30">
                  <ShieldCheck size={28} className="text-[var(--success)]" />
                </div>
                <div>
                  <div className="text-xs font-mono text-[var(--success)] uppercase tracking-widest mb-2">Built for you</div>
                  <h3 className="font-heading text-2xl font-bold mb-2">AI Tutor & Review Sheets</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Chat with an AI tutor that knows your material. Generate cheat sheets. Everything saved to your library.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[var(--bg-surface)] border-y border-[var(--border)]">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to ace your next exam?
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-10 font-medium max-w-xl mx-auto">
            Join thousands of students learning faster with MindFlow.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-[var(--accent)] text-white rounded-xl font-bold text-lg hover:bg-[var(--accent-light)] transition-mindflow glow-shadow"
          >
            Create Your Free Account <ArrowRight size={20} />
          </Link>
          <p className="text-[var(--text-muted)] text-sm font-medium mt-6">Setup takes less than 30 seconds</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[var(--accent)] font-bold">✦</span>
              <span className="font-heading font-bold">MindFlow</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] font-medium">
              © {new Date().getFullYear()} MindFlow. Built for optimal learning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
