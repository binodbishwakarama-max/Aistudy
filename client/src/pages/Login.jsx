import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Brain, BookOpen, Layers } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
    }
  };

  const highlights = [
    { icon: Brain, text: '48 Cards Mastered', sub: 'Just now', badge: '+120 XP' },
    { icon: BookOpen, text: 'Quiz Score: 95%', sub: '5 min ago', badge: '🔥 7 Day Streak' },
    { icon: Layers, text: 'Level 5 Reached!', sub: 'Today', badge: '🏆' },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--bg-base)]">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8 group">
            <span className="text-[var(--accent)] text-xl font-bold">✦</span>
            <span className="font-heading font-bold text-lg tracking-tight">MindFlow</span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-[var(--text-primary)] tracking-tight">Welcome back</h1>
          <p className="text-[var(--text-secondary)] mt-2 font-medium">Sign in to continue your learning journey.</p>

          {error && (
            <div className="mt-4 p-3 text-sm text-[var(--danger)] bg-[var(--danger)]/10 rounded-lg border border-[var(--danger)]/30 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] outline-none transition-mindflow placeholder:text-[var(--text-muted)]"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] outline-none transition-mindflow placeholder:text-[var(--text-muted)]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 bg-[var(--accent)] text-white rounded-xl font-semibold hover:bg-[var(--accent-light)] transition-mindflow glow-shadow flex justify-center items-center gap-2"
            >
              Log In <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-[var(--bg-base)] text-[var(--text-muted)] font-medium">Or continue with</span>
              </div>
            </div>
            <button
              onClick={loginWithGoogle}
              type="button"
              className="w-full mt-4 flex justify-center items-center gap-3 py-2.5 px-4 border border-[var(--border)] rounded-xl bg-[var(--bg-surface)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-accent)] transition-mindflow"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Log in with Google
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-[var(--text-muted)] font-medium">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-[var(--accent-light)] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right — Dark panel */}
      <div className="hidden md:flex md:w-1/2 bg-[var(--bg-surface)] items-center justify-center relative overflow-hidden border-l border-[var(--border)]">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-[var(--accent)]/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-md px-8 space-y-8">
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="glass-card rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-[var(--accent)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <item.icon size={20} className="text-[var(--accent-light)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[var(--text-primary)] text-sm font-semibold">{item.text}</div>
                <div className="text-[var(--text-muted)] text-xs font-medium">{item.sub}</div>
              </div>
              <div className="text-xs font-bold text-[var(--success)]">{item.badge}</div>
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
              Master your subjects in half the time.
            </h2>
            <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
              Join students who use AI-powered tools to study smarter and retain more.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
