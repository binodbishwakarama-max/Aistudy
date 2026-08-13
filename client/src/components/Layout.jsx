import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ChevronDown,
  HelpCircle,
  Layers,
  LogOut,
  Menu,
  Search,
  Trophy,
  LayoutDashboard,
  BookOpen,
  Upload,
  BarChart3,
  X,
} from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { workspaceNavigation } from '../config/workspace';
import { BRAND } from '../config/brand';
import BrandMark from './BrandMark';
import Button from './ui/Button';
import Card from './ui/Card';
import InstallPrompt from './InstallPrompt';
import DemoBanner from './DemoBanner';

const marketingRoutes = new Set(['/', '/login', '/register']);

const isDemoPath = (pathname) => pathname.startsWith('/demo');

const isPathActive = (pathname, path) => {
  if (path === '/analytics') {
    return pathname === '/analytics' || pathname === '/stats';
  }
  if (path === '/study') {
    return ['/study', '/flashcards', '/quizzes'].includes(pathname);
  }
  return pathname === path;
};

const MobileBottomNav = ({ items, onOpenMenu, showMore = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mobile-bottom-nav xl:hidden" aria-label="Primary navigation">
      {items.map((item) => {
        const active = item.match(location.pathname);
        return (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
            className={`mobile-bottom-nav__item ${active ? 'mobile-bottom-nav__item--active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            {item.icon ? <item.icon size={20} strokeWidth={active ? 2.25 : 2} /> : null}
            <span>{item.label}</span>
          </button>
        );
      })}
      {showMore && onOpenMenu ? (
        <button
          type="button"
          onClick={onOpenMenu}
          className="mobile-bottom-nav__item"
          aria-label="Open menu"
        >
          <Menu size={20} />
          <span>More</span>
        </button>
      ) : null}
    </nav>
  );
};

const MobileWorkspaceHeader = ({ onOpenMenu, onOpenSearch }) => (
  <header className="mobile-workspace-header xl:hidden">
    <div className="mobile-workspace-header__inner">
      <button
        type="button"
        onClick={onOpenMenu}
        className="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-mindflow hover:bg-[rgba(0,0,0,0.04)]"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
      <Link to="/dashboard" className="flex min-w-0 flex-1 items-center justify-center gap-2">
        <BrandMark />
        <span className="truncate font-heading text-base font-bold tracking-tight">MindFlow</span>
      </Link>
      <button
        type="button"
        onClick={onOpenSearch}
        className="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-mindflow hover:bg-[rgba(0,0,0,0.04)]"
        aria-label="Search workspace"
      >
        <Search size={22} />
      </button>
    </div>
  </header>
);

const workspaceNavItems = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard, match: (p) => p === '/dashboard' },
  { path: '/study', label: 'Study', icon: BookOpen, match: (p) => ['/study', '/flashcards', '/quizzes'].includes(p) },
  { path: '/upload', label: 'Upload', icon: Upload, match: (p) => p === '/upload' },
  { path: '/analytics', label: 'Progress', icon: BarChart3, match: (p) => p === '/analytics' || p === '/stats' },
];

const demoNavItems = [
  { path: '/demo/flashcards', label: 'Cards', icon: Layers, match: (p) => p === '/demo/flashcards' },
  { path: '/demo/quizzes', label: 'Quiz', icon: HelpCircle, match: (p) => p === '/demo/quizzes' },
  { path: '/register', label: 'Sign up', icon: null, match: (p) => p === '/register' },
];

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, authError } = useAuth();
  const { gameState, showLevelUp } = useGamification();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [workspaceQuery, setWorkspaceQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const isMarketing = marketingRoutes.has(location.pathname);
  const isDemo = isDemoPath(location.pathname);

  const userName = useMemo(() => {
    const fullName = user?.user_metadata?.full_name?.trim();
    if (fullName) return fullName;
    if (user?.email) return user.email.split('@')[0];
    return 'Student';
  }, [user]);

  const userInitials = useMemo(() => {
    const words = userName.split(' ').filter(Boolean);
    return words.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'MF';
  }, [userName]);

  const closeOverlays = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const handleNavigation = (path) => {
    closeOverlays();
    navigate(path);
  };

  const handleLogout = async () => {
    closeOverlays();
    await logout();
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = workspaceQuery.trim().toLowerCase();
    if (!query) return;

    const target = workspaceNavigation.find((item) => {
      const haystack = [item.label, item.description, ...(item.keywords || [])].join(' ').toLowerCase();
      return haystack.includes(query);
    });

    if (target) {
      handleNavigation(target.path);
      setWorkspaceQuery('');
      setMobileSearchOpen(false);
    }
  };

  useEffect(() => {
    if (mobileSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [mobileSearchOpen]);

  return (
    <div
      className={
        isMarketing || isDemo
          ? 'relative min-h-screen overflow-hidden text-[var(--text-primary)]'
          : 'workspace-shell relative overflow-hidden text-[var(--text-primary)]'
      }
    >
      <AnimatePresence>
        {showLevelUp && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(29,29,31,0.35)] px-4 backdrop-blur-md"
          >
            <Motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}>
              <Card className="w-full max-w-sm p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--warm-soft)] text-[var(--warm)]">
                  <Trophy className="h-7 w-7" />
                </div>
                <p className="kicker mt-5">Level up</p>
                <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">Level {gameState.level}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Your study habit is compounding. Keep the streak going.
                </p>
              </Card>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {isMarketing ? (
        children
      ) : isDemo ? (
        <div className="relative min-h-screen bg-[var(--bg-base)]">
          <DemoBanner />
          <main className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 sm:py-8 pb-[var(--bottom-nav-offset)]">{children}</main>
          <MobileBottomNav items={demoNavItems} showMore={false} />
        </div>
      ) : (
        <>
          <aside className="workspace-sidebar hidden xl:flex">
            <div className="flex h-full w-full min-w-0 flex-col gap-4 overflow-hidden">
              <Link to="/dashboard" className="flex items-center gap-3">
                <BrandMark />
                <div>
                  <div className="font-heading text-lg font-bold tracking-tight">MindFlow</div>
                  <div className="text-xs text-[var(--text-muted)]">{BRAND.wedge}</div>
                </div>
              </Link>

              <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
                <div className="flex items-center gap-3">
                  <div className="workspace-avatar">{userInitials}</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-[var(--text-primary)]">{userName}</div>
                    <div className="truncate text-xs text-[var(--text-muted)]">
                      Level {gameState.level} · {gameState.streak}d streak
                    </div>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {workspaceNavigation.map((item) => {
                  const active = isPathActive(location.pathname, item.path);
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => handleNavigation(item.path)}
                      className={`workspace-nav-item ${active ? 'workspace-nav-item--active' : ''}`}
                    >
                      <span className="workspace-nav-icon">
                        <item.icon size={18} />
                      </span>
                      <span className="min-w-0 text-left">
                        <span className="block text-sm font-semibold">{item.label}</span>
                        <span className="block truncate text-xs text-[var(--text-muted)]">{item.description}</span>
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto">
                <Button variant="secondary" className="w-full justify-center" leftIcon={LogOut} onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            </div>
          </aside>

          <div className="workspace-content">
            <MobileWorkspaceHeader
              onOpenMenu={() => setMobileOpen(true)}
              onOpenSearch={() => setMobileSearchOpen(true)}
            />

            <header className="workspace-topbar hidden xl:flex">
              <div className="workspace-topbar-inner">
                <div className="workspace-topbar-search-row">
                  <form onSubmit={handleSearchSubmit} className="workspace-search">
                    <Search size={16} className="text-[var(--text-muted)]" />
                    <input
                      value={workspaceQuery}
                      onChange={(event) => setWorkspaceQuery(event.target.value)}
                      className="workspace-search-input"
                      placeholder="Jump to study, upload, progress..."
                    />
                  </form>
                </div>

                <div className="workspace-topbar-actions">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setProfileOpen((prev) => !prev)}
                      className="workspace-profile-trigger"
                    >
                      <span className="workspace-avatar workspace-avatar--small">{userInitials}</span>
                      <span className="hidden min-w-0 text-left md:block">
                        <span className="block truncate text-sm font-semibold">{userName}</span>
                        <span className="block truncate text-xs text-[var(--text-muted)]">{user?.email || 'Workspace'}</span>
                      </span>
                      <ChevronDown size={16} className="text-[var(--text-muted)]" />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <Motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(18rem,calc(100vw-1rem))]"
                        >
                          <Card className="p-4">
                            <div className="flex items-center gap-3">
                              <span className="workspace-avatar">{userInitials}</span>
                              <div className="min-w-0">
                                <div className="truncate text-sm font-semibold">{userName}</div>
                                <div className="truncate text-xs text-[var(--text-muted)]">{user?.email || 'Signed in'}</div>
                              </div>
                            </div>
                            <div className="mt-4 space-y-1">
                              <button type="button" onClick={() => handleNavigation('/settings')} className="workspace-dropdown-item">
                                Open settings
                              </button>
                              <button type="button" onClick={handleLogout} className="workspace-dropdown-item text-[var(--danger)]">
                                Log out
                              </button>
                            </div>
                          </Card>
                        </Motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </header>

            <AnimatePresence>
              {mobileSearchOpen && (
                <Motion.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="fixed inset-0 z-[120] flex flex-col bg-[var(--bg-surface)] xl:hidden"
                >
                  <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-elevated)] p-4 pt-safe">
                    <form onSubmit={handleSearchSubmit} className="workspace-search m-0 flex-1">
                      <Search size={18} className="text-[var(--text-muted)]" />
                      <input
                        ref={searchInputRef}
                        value={workspaceQuery}
                        onChange={(event) => setWorkspaceQuery(event.target.value)}
                        className="workspace-search-input h-8 text-base"
                        placeholder="Jump to study, upload, progress..."
                      />
                    </form>
                    <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => setMobileSearchOpen(false)}>
                      <X size={22} />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="kicker mb-3">Quick navigation</div>
                    <div className="grid gap-2">
                      {workspaceNavigation
                        .filter((item) =>
                          workspaceQuery
                            ? [item.label, item.description, ...(item.keywords || [])]
                                .join(' ')
                                .toLowerCase()
                                .includes(workspaceQuery.toLowerCase())
                            : true,
                        )
                        .map((item) => (
                          <button
                            key={item.path}
                            type="button"
                            onClick={() => {
                              handleNavigation(item.path);
                              setMobileSearchOpen(false);
                              setWorkspaceQuery('');
                            }}
                            className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-left transition-colors hover:border-[var(--border-strong)]"
                          >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-strong)] text-[var(--accent)]">
                              <item.icon size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-base font-semibold text-[var(--text-primary)]">{item.label}</div>
                              <div className="truncate text-sm text-[var(--text-secondary)]">{item.description}</div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {mobileOpen && (
                <Motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[110] bg-[rgba(29,29,31,0.32)] backdrop-blur-sm xl:hidden"
                  onClick={closeOverlays}
                >
                  <Motion.div
                    initial={{ x: -24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -24, opacity: 0 }}
                    className="flex h-full w-full max-w-[min(22rem,calc(100vw-0.75rem))] flex-col"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Card
                      className="flex h-full flex-col overflow-y-auto rounded-none border-y-0 border-l-0 p-6 sm:rounded-r-[28px] sm:border sm:border-l-0"
                      style={{ paddingBottom: 'calc(var(--bottom-nav-h) + var(--safe-area-bottom) + 1.5rem)' }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <BrandMark />
                          <div>
                            <div className="font-heading text-lg font-bold">MindFlow</div>
                            <div className="text-sm text-[var(--text-muted)]">Study workspace</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={closeOverlays} aria-label="Close menu">
                          <X size={18} />
                        </Button>
                      </div>

                      <div className="mt-6 space-y-1">
                        {workspaceNavigation.map((item) => {
                          const active = isPathActive(location.pathname, item.path);
                          return (
                            <button
                              key={item.path}
                              type="button"
                              onClick={() => handleNavigation(item.path)}
                              className={`workspace-nav-item ${active ? 'workspace-nav-item--active' : ''}`}
                            >
                              <span className="workspace-nav-icon">
                                <item.icon size={18} />
                              </span>
                              <span className="min-w-0 text-left">
                                <span className="block text-sm font-semibold">{item.label}</span>
                                <span className="block truncate text-xs text-[var(--text-muted)]">{item.description}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-4">
                        <div className="flex items-center gap-3">
                          <span className="workspace-avatar">{userInitials}</span>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">{userName}</div>
                            <div className="truncate text-xs text-[var(--text-muted)]">{user?.email || 'Signed in'}</div>
                          </div>
                        </div>
                        <Button variant="secondary" className="mt-4 w-full justify-center" leftIcon={LogOut} onClick={handleLogout}>
                          Log out
                        </Button>
                      </div>
                    </Card>
                  </Motion.div>
                </Motion.div>
              )}
            </AnimatePresence>

            <main className="workspace-main">
              <div className="workspace-main-inner">
                {authError && (
                  <div className="mb-5 flex items-start gap-3 rounded-[var(--radius-md)] border border-[rgba(215,0,21,0.2)] bg-[var(--danger-soft)] px-4 py-3 text-sm">
                    <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-[var(--danger)]" />
                    <span>{authError}</span>
                  </div>
                )}
                {children}
              </div>
            </main>
            <MobileBottomNav items={workspaceNavItems} onOpenMenu={() => setMobileOpen(true)} />
            <InstallPrompt />
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
