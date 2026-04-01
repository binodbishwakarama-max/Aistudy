import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, BookOpen, Sparkles, Trophy, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandMark from '../components/BrandMark';

const features = [
  {
    icon: Zap,
    title: 'Start from raw notes',
    description: 'Upload a source and let MindFlow create flashcards, quizzes, and review sheets for you.',
  },
  {
    icon: BookOpen,
    title: 'Keep one tidy workspace',
    description: 'Your sessions stay connected so it is easy to return later and continue.',
  },
  {
    icon: Trophy,
    title: 'Build momentum over time',
    description: 'Track streaks, XP, and progress without a dashboard that feels overloaded.',
  },
];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loginWithGoogle, authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.message || 'Failed to register.');
    }
  };

  return (
    <div className="app-shell">
      <div className="page-shell min-h-screen py-6 sm:py-8">
        <div className="grid min-h-[calc(100vh-3rem)] gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="section-shell hidden p-8 lg:flex lg:flex-col lg:justify-between lg:p-10">
            <div>
              <div className="kicker">Get started</div>
              <h2 className="font-heading mt-3 text-4xl font-bold tracking-tight">
                Build a study setup that feels simple from day one.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-[var(--text-secondary)]">
                MindFlow is built to reduce friction early so you can focus on learning instead of managing tools.
              </p>
            </div>

            <div className="mt-8 grid gap-4">
              {features.map((item) => (
                <div key={item.title} className="glass-card p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-[var(--accent)]">
                    <item.icon size={20} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-shell flex items-center p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <Link to="/" className="inline-flex items-center gap-3">
                <BrandMark />
                <div>
                  <div className="font-heading text-lg font-bold tracking-tight">MindFlow</div>
                  <div className="text-sm text-[var(--text-muted)]">Study workspace</div>
                </div>
              </Link>

              <div className="mt-8">
                <div className="pill-badge">
                  <Sparkles size={14} className="text-[var(--accent)]" />
                  Create your account
                </div>
                <h1 className="font-heading mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                  Start with a cleaner study workflow.
                </h1>
                <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
                  Set up your workspace, upload your material, and let the product handle the repetitive parts.
                </p>
              </div>

              {(authError || error) && (
                <div className="mt-6 space-y-3">
                  {authError && (
                    <div className="flex items-start gap-3 rounded-2xl border border-[rgba(217,48,37,0.22)] bg-[rgba(217,48,37,0.06)] px-4 py-3 text-sm">
                      <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-[var(--danger)]" />
                      <span>{authError}</span>
                    </div>
                  )}
                  {error && (
                    <div className="flex items-start gap-3 rounded-2xl border border-[rgba(217,48,37,0.22)] bg-[rgba(217,48,37,0.06)] px-4 py-3 text-sm">
                      <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-[var(--danger)]" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Full name</label>
                  <input
                    type="text"
                    required
                    className="input-shell"
                    placeholder="Alex Chen"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Email</label>
                  <input
                    type="email"
                    required
                    className="input-shell"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Password</label>
                  <input
                    type="password"
                    required
                    className="input-shell"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>

                <button type="submit" className="primary-button mt-2 w-full justify-center text-base">
                  Create account
                  <ArrowRight size={18} />
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border)]" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-[var(--bg-card)] px-3 text-[var(--text-muted)]">Or continue with</span>
                  </div>
                </div>

                <button onClick={loginWithGoogle} type="button" className="secondary-button mt-4 w-full justify-center text-sm">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[var(--accent)]">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
