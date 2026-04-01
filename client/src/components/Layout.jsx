import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Flame,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import BrandMark from './BrandMark';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/study', label: 'Study', icon: BookOpen },
  { to: '/stats', label: 'Stats', icon: BarChart3 },
];

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout, authError } = useAuth();
  const { gameState, showLevelUp } = useGamification();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

  const userName = useMemo(() => {
    const fullName = user?.user_metadata?.full_name?.trim();
    if (fullName) {
      return fullName;
    }

    if (user?.email) {
      return user.email.split('@')[0];
    }

    return 'Student';
  }, [user]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className={isAuthPage ? 'min-h-screen text-[var(--text-primary)]' : 'app-shell text-[var(--text-primary)]'}>
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(32,33,36,0.24)] px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="section-shell w-full max-w-sm p-8 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--warm-soft)] text-[var(--warm)]">
                <Trophy className="h-8 w-8" />
              </div>
              <p className="kicker mt-5">Level up</p>
              <h2 className="font-heading mt-2 text-3xl font-bold">You reached Level {gameState.level}</h2>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                Nice work. Your study habit is starting to compound.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isAuthPage && (
        <>
          <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/88 backdrop-blur-sm">
            <div className="page-shell flex items-center justify-between gap-4 py-4">
              <div className="flex min-w-0 items-center gap-4 sm:gap-8">
                <Link to="/" className="flex items-center gap-3">
                  <BrandMark />
                  <div className="min-w-0">
                    <div className="font-heading text-lg font-bold tracking-tight">MindFlow</div>
                    <div className="text-sm text-[var(--text-muted)]">Study workspace</div>
                  </div>
                </Link>

                <nav className="hidden items-center gap-2 md:flex">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.to;

                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        aria-current={isActive ? 'page' : undefined}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-mindflow ${
                          isActive
                            ? 'border border-[var(--border-accent)] bg-[var(--bg-strong)] text-[var(--accent)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                        }`}
                      >
                        <link.icon size={16} />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="hidden items-center gap-3 sm:flex">
                <div className="info-chip">
                  <Sparkles size={14} className="text-[var(--accent)]" />
                  <span>Level {gameState.level}</span>
                </div>
                <div className="info-chip">
                  <Flame size={14} className="text-[var(--warm)]" />
                  <span>{gameState.streak} day streak</span>
                </div>
                <div className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm">
                  <div className="font-medium text-[var(--text-primary)]">{userName}</div>
                  <div className="text-xs text-[var(--text-muted)]">XP {gameState.xp}</div>
                </div>
                <button onClick={logout} className="secondary-button px-4 py-2 text-sm">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>

              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="secondary-button flex h-11 w-11 items-center justify-center p-0 sm:hidden"
                aria-label="Toggle navigation"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>

            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-[var(--border)] sm:hidden"
                >
                  <div className="page-shell space-y-3 py-4">
                    <nav className="grid gap-2">
                      {navLinks.map((link) => {
                        const isActive = location.pathname === link.to;

                        return (
                          <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
                              isActive
                                ? 'border-[var(--border-accent)] bg-[var(--bg-strong)] text-[var(--accent)]'
                                : 'border-[var(--border)] bg-white text-[var(--text-secondary)]'
                            }`}
                          >
                            <link.icon size={16} />
                            {link.label}
                          </Link>
                        );
                      })}
                    </nav>

                    <div className="section-shell p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-[var(--text-primary)]">{userName}</div>
                          <div className="text-xs text-[var(--text-muted)]">
                            Level {gameState.level} · {gameState.streak} day streak
                          </div>
                        </div>
                        <button onClick={logout} className="secondary-button px-4 py-2 text-sm">
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {authError && (
            <div className="page-shell pt-4">
              <div className="flex items-start gap-3 rounded-2xl border border-[rgba(217,48,37,0.22)] bg-[rgba(217,48,37,0.06)] px-4 py-3 text-sm">
                <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-[var(--danger)]" />
                <span>{authError}</span>
              </div>
            </div>
          )}
        </>
      )}

      <main className={!isAuthPage ? 'page-shell py-6 sm:py-8' : ''}>{children}</main>
    </div>
  );
};

export default Layout;
