import React, { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Mail, ShieldCheck, Sparkles, TimerReset } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandMark from '../components/BrandMark';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import InputField from '../components/ui/InputField';

const emailError = (value) => {
  if (!value.trim()) return 'Email is required.';
  if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email address.';
  return '';
};

const passwordError = (value) => {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password should be at least 8 characters.';
  return '';
};

const valueOrEmpty = (value) => (value ? value : '');

const benefits = [
  {
    title: 'Resume active sessions',
    description: 'Return to your latest uploads, flashcards, quizzes, and progress without rebuilding context.',
    icon: TimerReset,
  },
  {
    title: 'Keep the workflow clean',
    description: 'One workspace for import, generation, review, and analytics instead of scattered tools.',
    icon: Sparkles,
  },
  {
    title: 'Protected account access',
    description: 'Email and password flow with OAuth entry points ready when you want them.',
    icon: ShieldCheck,
  },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login, loginWithGoogle, authError, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fieldErrors = useMemo(
    () => ({
      email: touched.email ? emailError(email) : '',
      password: touched.password ? passwordError(password) : '',
    }),
    [email, password, touched],
  );

  const formError = authError || fieldErrors.email || fieldErrors.password;

  if (!loading && user) {
    return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextTouched = { email: true, password: true };
    setTouched(nextTouched);

    const nextEmailError = emailError(email);
    const nextPasswordError = passwordError(password);

    if (nextEmailError || nextPasswordError) return;

    setSubmitting(true);
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || '/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="page-shell min-h-screen py-6 sm:py-8">
        <div className="grid min-h-[calc(100vh-3rem)] gap-6 lg:grid-cols-[1fr_1.02fr]">
          <Card variant="dark" className="relative hidden overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.24),transparent_65%)]" />
            <div className="relative">
              <Link to="/" className="inline-flex items-center gap-3 text-white">
                <BrandMark className="border-white/20 bg-white/10 text-white" />
                <div>
                  <div className="font-heading text-lg font-bold tracking-tight">MindFlow</div>
                  <div className="text-sm text-white/70">AI study workspace</div>
                </div>
              </Link>

              <div className="mt-10 max-w-xl">
                <div className="pill-badge border-white/12 bg-white/10 text-white/90">
                  <Sparkles size={14} />
                  Welcome back
                </div>
                <h1 className="font-heading mt-5 text-5xl font-bold tracking-tight text-white">
                  Pick up the exact study flow you left behind.
                </h1>
                <p className="mt-5 text-base leading-8 text-white/78">
                  Sign in to continue reviewing flashcards, running quizzes, and managing your library from one clean
                  dashboard.
                </p>
              </div>
            </div>

            <div className="relative grid gap-4">
              {benefits.map((item) => (
                <Card key={item.title} className="border-white/10 bg-white/8 p-6 text-white shadow-none">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <item.icon size={20} />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/74">{item.description}</p>
                </Card>
              ))}
            </div>
          </Card>

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
                  Log in
                </div>
                <h1 className="font-heading mt-5 text-3xl font-bold tracking-tight sm:text-5xl">Sign in to your workspace.</h1>
                <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
                  Continue from your latest uploads, flashcards, quiz sessions, and saved library items.
                </p>
              </div>

              {valueOrEmpty(formError) && touched.email && touched.password && (
                <div className="mt-6 rounded-2xl border border-[rgba(217,48,37,0.2)] bg-[rgba(217,48,37,0.06)] px-4 py-3 text-sm text-[var(--danger)]">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  onChange={(event) => setPassword(event.target.value)}
                  error={fieldErrors.password}
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
                  Sign in
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
                New here?{' '}
                <Link to="/register" className="font-semibold text-[var(--accent)]">
                  Create an account
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
