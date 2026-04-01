import React, { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Mail, ShieldCheck, Sparkles, UserRound, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandMark from '../components/BrandMark';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import InputField from '../components/ui/InputField';

const validateName = (value) => {
  if (!value.trim()) return 'Full name is required.';
  if (value.trim().length < 2) return 'Enter at least 2 characters.';
  return '';
};

const validateEmail = (value) => {
  if (!value.trim()) return 'Email is required.';
  if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email address.';
  return '';
};

const validatePassword = (value) => {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Use at least 8 characters.';
  return '';
};

const highlights = [
  {
    title: 'Start from raw material',
    description: 'Upload lecture notes or PDFs and let the product structure the first revision pass for you.',
    icon: Zap,
  },
  {
    title: 'Create one reliable workflow',
    description: 'Study sessions, quizzes, and flashcards stay connected so there is less setup overhead.',
    icon: Sparkles,
  },
  {
    title: 'Build with confidence',
    description: 'Protected auth flow with room to extend into OAuth and deeper account settings later.',
    icon: ShieldCheck,
  },
];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { register, loginWithGoogle, authError, user, loading } = useAuth();
  const navigate = useNavigate();

  const fieldErrors = useMemo(
    () => ({
      name: touched.name ? validateName(name) : '',
      email: touched.email ? validateEmail(email) : '',
      password: touched.password ? validatePassword(password) : '',
    }),
    [name, email, password, touched],
  );

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextTouched = { name: true, email: true, password: true };
    setTouched(nextTouched);

    const nextErrors = [validateName(name), validateEmail(email), validatePassword(password)];
    if (nextErrors.some(Boolean)) return;

    setSubmitting(true);
    try {
      await register(name.trim(), email, password);
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="page-shell min-h-screen py-6 sm:py-8">
        <div className="grid min-h-[calc(100vh-3rem)] gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="flex items-center p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <Link to="/" className="inline-flex items-center gap-3">
                <BrandMark />
                <div>
                  <div className="font-heading text-lg font-bold tracking-tight">MindFlow</div>
                  <div className="text-sm text-[var(--text-muted)]">AI study workspace</div>
                </div>
              </Link>

              <div className="mt-8">
                <div className="pill-badge">
                  <Sparkles size={14} className="text-[var(--accent)]" />
                  Create account
                </div>
                <h1 className="font-heading mt-5 text-3xl font-bold tracking-tight sm:text-5xl">Set up your study workspace.</h1>
                <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
                  Create an account to upload notes, generate flashcards, and keep your revision system in one place.
                </p>
              </div>

              {authError && (
                <div className="mt-6 rounded-2xl border border-[rgba(217,48,37,0.2)] bg-[rgba(217,48,37,0.06)] px-4 py-3 text-sm text-[var(--danger)]">
                  {authError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <InputField
                  label="Full name"
                  value={name}
                  icon={UserRound}
                  placeholder="Alex Chen"
                  autoComplete="name"
                  onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                  onChange={(event) => setName(event.target.value)}
                  error={fieldErrors.name}
                />

                <InputField
                  label="Email"
                  type="email"
                  value={email}
                  icon={Mail}
                  placeholder="you@example.com"
                  autoComplete="email"
                  onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                  onChange={(event) => setEmail(event.target.value)}
                  error={fieldErrors.email}
                />

                <InputField
                  label="Password"
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  onChange={(event) => setPassword(event.target.value)}
                  error={fieldErrors.password}
                  helper={!fieldErrors.password ? 'Use at least 8 characters.' : ''}
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setPasswordVisible((prev) => !prev)}
                      className="rounded-full p-1 text-[var(--text-muted)] transition-mindflow hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                      aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                    >
                      {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />

                <Button type="submit" loading={submitting} rightIcon={ArrowRight} className="mt-2 w-full justify-center" size="lg">
                  Create account
                </Button>
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

                <Button
                  variant="secondary"
                  className="mt-4 w-full justify-center"
                  onClick={loginWithGoogle}
                  leftIcon={() => (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                >
                  Continue with Google
                </Button>
              </div>

              <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[var(--accent)]">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>

          <Card variant="accent" className="hidden p-8 lg:flex lg:flex-col lg:justify-between lg:p-10">
            <div>
              <div className="kicker">Why MindFlow</div>
              <h2 className="font-heading mt-4 text-4xl font-bold tracking-tight">Build a study setup that feels intentional from day one.</h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-[var(--text-secondary)]">
                Start with a calmer product surface that helps you upload, generate, and review instead of forcing you
                to assemble a workflow from scratch.
              </p>
            </div>

            <div className="mt-8 grid gap-4">
              {highlights.map((item) => (
                <Card key={item.title} className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-[var(--accent)]">
                    <item.icon size={20} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.description}</p>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
