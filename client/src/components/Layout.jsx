import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BarChart3, Trophy, Flame, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { gameState, getXpToNextLevel, showLevelUp } = useGamification();
  const xpNeeded = getXpToNextLevel(gameState.level);
  const xpProgress = Math.min(100, (gameState.xp / xpNeeded) * 100);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/study', label: 'Study', icon: BookOpen },
    { to: '/stats', label: 'Stats', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] relative grain-overlay">
      {/* Level Up Overlay */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 rounded-2xl border-[var(--border-accent)] glow-shadow text-center max-w-sm"
            >
              <Trophy className="w-16 h-16 text-[var(--warm)] mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">LEVEL UP!</h2>
              <p className="text-[var(--text-secondary)] mt-2 font-medium">
                You reached Level {gameState.level}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isAuthPage && (
        <>
          {/* Fixed Sidebar — 240px */}
          <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[var(--bg-surface)] border-r border-[var(--border)] z-40 hidden lg:flex flex-col">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 px-6 h-16 border-b border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-mindflow"
            >
              <span className="text-[var(--accent)] text-xl font-bold">✦</span>
              <span className="font-heading font-bold text-lg tracking-tight">MindFlow</span>
            </Link>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-mindflow ${
                    isActive(link.to)
                      ? 'bg-[var(--accent)]/20 text-[var(--accent-light)] border border-[var(--border-accent)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  <link.icon size={18} strokeWidth={2} />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Gamification + User */}
            <div className="p-4 border-t border-[var(--border)] space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)] font-medium">Level {gameState.level}</span>
                  <span className="font-mono text-[var(--text-secondary)]">{gameState.xp} / {xpNeeded}</span>
                </div>
                <div className="h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-elevated)]">
                <Flame size={16} className="text-[var(--warm)]" />
                <span className="font-mono text-sm font-semibold text-[var(--text-primary)]">{gameState.streak}d</span>
                <span className="text-xs text-[var(--text-muted)]">streak</span>
              </div>
              {user && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--text-secondary)] truncate max-w-[120px]">
                    {user.user?.name || user?.user_metadata?.full_name || 'Student'}
                  </span>
                  <button
                    onClick={logout}
                    className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Top Bar — sticky, 64px */}
          <header className="sticky top-0 z-30 h-16 bg-[var(--bg-surface)]/80 backdrop-blur-xl border-b border-[var(--border)] lg:pl-60">
            <div className="h-full px-4 lg:px-8 flex items-center justify-between">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link to="/" className="lg:hidden flex items-center gap-2">
                <span className="text-[var(--accent)] font-bold">✦</span>
                <span className="font-heading font-bold">MindFlow</span>
              </Link>

              <div className="hidden lg:block flex-1" />

              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)]">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Lvl</span>
                    <span className="font-mono font-semibold text-[var(--text-primary)]">{gameState.level}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)]">
                    <Flame size={14} className="text-[var(--warm)]" />
                    <span className="font-mono text-sm font-semibold">{gameState.streak}d</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                  onClick={() => setMobileOpen(false)}
                />
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 bottom-0 w-[280px] bg-[var(--bg-surface)] border-r border-[var(--border)] z-50 lg:hidden flex flex-col"
                >
                  <div className="px-6 py-6 border-b border-[var(--border)]">
                    <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                      <span className="text-[var(--accent)] text-xl font-bold">✦</span>
                      <span className="font-heading font-bold text-lg">MindFlow</span>
                    </Link>
                  </div>
                  <nav className="flex-1 px-3 py-4 space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${
                          isActive(link.to)
                            ? 'bg-[var(--accent)]/20 text-[var(--accent-light)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                        }`}
                      >
                        <link.icon size={18} />
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="p-4 border-t border-[var(--border)]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[var(--text-secondary)]">{user?.user?.name || 'Student'}</span>
                      <button onClick={logout} className="text-xs text-[var(--danger)] hover:underline">Logout</button>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${xpProgress}%` }} />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Main content */}
      <main
        className={`transition-mindflow ${
          !isAuthPage ? 'lg:pl-60 pt-16 min-h-screen' : ''
        }`}
      >
        <div className={!isAuthPage ? 'p-8' : ''}>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
