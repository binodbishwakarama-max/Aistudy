import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Sparkles,
  Target,
  Trophy,
  User,
  LayoutDashboard,
  BookOpen,
  X,
} from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { workspaceHighlights, workspaceNavigation } from '../config/workspace';
import BrandMark from './BrandMark';
import Button from './ui/Button';
import Card from './ui/Card';
import InstallPrompt from './InstallPrompt';

const marketingRoutes = new Set(['/', '/login', '/register']);

const isPathActive = (pathname, path) => {
  if (path === '/analytics') {
    return pathname === '/analytics' || pathname === '/stats';
  }

  return pathname === path;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, authError } = useAuth();
  const { gameState, showLevelUp } = useGamification();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [workspaceQuery, setWorkspaceQuery] = useState('');

  const searchInputRef = useRef(null);

  const isMarketing = marketingRoutes.has(location.pathname);

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

  const MobileBottomNav = () => {
    return (
      <nav className="fixed bottom-0 inset-x-0 bg-[rgba(249,251,255,0.95)] backdrop-blur-md border-t border-[var(--border)] z-[100] pb-safe xl:hidden flex justify-around items-center h-16 px-2 shadow-[0_-4px_24px_rgba(15,23,42,0.04)]">
        <button onClick={() => navigate('/dashboard')} className={`flex flex-col items-center justify-center w-[52px] h-[52px] rounded-xl transition-colors ${location.pathname === '/dashboard' || location.pathname === '/' ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]'}`}>
          <LayoutDashboard size={22} className={location.pathname === '/dashboard' || location.pathname === '/' ? 'fill-[var(--accent-glow)]' : ''} />
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button onClick={() => navigate('/study')} className={`flex flex-col items-center justify-center w-[52px] h-[52px] rounded-xl transition-colors ${['/study', '/flashcards', '/quizzes'].includes(location.pathname) ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]'}`}>
          <BookOpen size={22} className={['/study', '/flashcards', '/quizzes'].includes(location.pathname) ? 'fill-[var(--accent-glow)]' : ''} />
          <span className="text-[10px] mt-1">Study</span>
        </button>
        <button onClick={() => { window.scrollTo(0, 0); setMobileSearchOpen(true); }} className="flex flex-col items-center justify-center w-[52px] h-[52px] rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] transition-colors">
          <Search size={22} />
          <span className="text-[10px] mt-1">Search</span>
        </button>
        <button onClick={() => navigate('/settings')} className={`flex flex-col items-center justify-center w-[52px] h-[52px] rounded-xl transition-colors ${location.pathname === '/settings' ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]'}`}>
          <User size={22} className={location.pathname === '/settings' ? 'fill-[var(--accent-glow)]' : ''} />
          <span className="text-[10px] mt-1">Profile</span>
        </button>
        <button onClick={() => setMobileOpen(true)} className="flex flex-col items-center justify-center w-[52px] h-[52px] rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] transition-colors">
          <Menu size={22} />
          <span className="text-[10px] mt-1">More</span>
        </button>
      </nav>
    );
  };

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  useEffect(() => {
    if (mobileSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [mobileSearchOpen]);

  return (
    <div className={isMarketing ? 'min-h-screen text-[var(--text-primary)]' : 'workspace-shell text-[var(--text-primary)]'}>
      <AnimatePresence>
        {showLevelUp && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(15,23,42,0.36)] px-4 backdrop-blur-md"
          >
            <Motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}>
              <Card className="w-full max-w-sm p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--warm-soft)] text-[var(--warm)]">
                  <Trophy className="h-8 w-8" />
                </div>
                <p className="kicker mt-5">Level up</p>
                <h2 className="font-heading mt-2 text-3xl font-bold">You reached Level {gameState.level}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Nice work. Your study habit is turning into a repeatable system.
                </p>
              </Card>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {isMarketing ? (
        children
      ) : (
        <>
          <aside className="workspace-sidebar hidden xl:flex">
            <div className="flex h-full flex-col gap-6">
              <Link to="/" className="flex items-center gap-3">
                <BrandMark />
                <div>
                  <div className="font-heading text-lg font-bold tracking-tight">MindFlow</div>
                  <div className="text-sm text-[var(--text-muted)]">AI study workspace</div>
                </div>
              </Link>

              <Card variant="accent" className="p-5">
                <div className="flex items-center gap-3">
                  <div className="workspace-avatar">{userInitials}</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-[var(--text-primary)]">{userName}</div>
                    <div className="truncate text-xs text-[var(--text-muted)]">{user?.email || 'Signed in'}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-3">
                    <div className="text-xs text-[var(--text-muted)]">Level</div>
                    <div className="mt-1 text-lg font-semibold">{gameState.level}</div>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-3">
                    <div className="text-xs text-[var(--text-muted)]">Streak</div>
                    <div className="mt-1 text-lg font-semibold">{gameState.streak}d</div>
                  </div>
                </div>
              </Card>

              <nav className="space-y-2">
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

              <div className="mt-auto space-y-3">
                {workspaceHighlights.map((highlight) => (
                  <Card key={highlight.label} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-[var(--accent)]">
                        <highlight.icon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{highlight.label}</div>
                        <p className="mt-1 text-xs leading-6 text-[var(--text-secondary)]">{highlight.value}</p>
                      </div>
                    </div>
                  </Card>
                ))}

                <Button variant="secondary" className="w-full justify-center" leftIcon={LogOut} onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            </div>
          </aside>

          <div className="workspace-content">
            <header className="workspace-topbar hidden xl:flex">
              <div className="workspace-topbar-inner">
                <div className="workspace-topbar-search-row">
                  <form onSubmit={handleSearchSubmit} className="workspace-search">
                    <Search size={16} className="text-[var(--text-muted)]" />
                    <input
                      value={workspaceQuery}
                      onChange={(event) => setWorkspaceQuery(event.target.value)}
                      className="workspace-search-input"
                      placeholder="Jump to upload, flashcards, analytics..."
                    />
                  </form>
                </div>

                <div className="workspace-topbar-actions">
                  <div className="hidden items-center gap-2 lg:flex">
                    <span className="info-chip">
                      <Sparkles size={14} className="text-[var(--accent)]" />
                      <span>XP {gameState.xp}</span>
                    </span>
                    <span className="info-chip">
                      <Trophy size={14} className="text-[var(--warm)]" />
                      <span>Level {gameState.level}</span>
                    </span>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setProfileOpen((prev) => !prev)}
                      className="workspace-profile-trigger"
                    >
                      <span className="workspace-avatar workspace-avatar--small">{userInitials}</span>
                      <span className="hidden min-w-0 text-left md:block">
                        <span className="block truncate text-sm font-semibold">{userName}</span>
                        <span className="block truncate text-xs text-[var(--text-muted)]">{user?.email || 'Workspace member'}</span>
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
                            <div className="mt-4 space-y-2">
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
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 z-[120] bg-[var(--bg-base)] xl:hidden flex flex-col"
                >
                  <div className="flex items-center gap-2 p-4 border-b border-[var(--border)] bg-[var(--bg-card)] pb-safe-top pt-safe-top">
                    <form onSubmit={handleSearchSubmit} className="workspace-search flex-1 m-0 shadow-none border-[var(--border-strong)]">
                      <Search size={18} className="text-[var(--text-muted)]" />
                      <input
                        ref={searchInputRef}
                        value={workspaceQuery}
                        onChange={(event) => setWorkspaceQuery(event.target.value)}
                        className="workspace-search-input text-base h-8"
                        placeholder="Jump to upload, flashcards, analytics..."
                      />
                    </form>
                    <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => setMobileSearchOpen(false)}>
                      <X size={24} />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg-base)]">
                    <div className="kicker mb-3">Quick Navigation Navigation</div>
                    <div className="grid gap-2">
                       {workspaceNavigation.filter(item => 
                          workspaceQuery ? 
                            [item.label, item.description, ...(item.keywords || [])].join(' ').toLowerCase().includes(workspaceQuery.toLowerCase()) 
                            : true
                        ).map((item) => (
                           <button
                             key={item.path}
                             onClick={() => {
                               handleNavigation(item.path);
                               setMobileSearchOpen(false);
                               setWorkspaceQuery('');
                             }}
                             className="flex items-center gap-4 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] transition-mindflow hover:border-[var(--accent)]"
                           >
                             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-[var(--accent)]">
                               <item.icon size={20} />
                             </div>
                             <div className="text-left flex-1 min-w-0">
                               <div className="text-base font-semibold text-[var(--text-primary)]">{item.label}</div>
                               <div className="text-sm text-[var(--text-secondary)] truncate">{item.description}</div>
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
                  className="fixed inset-0 z-[110] bg-[rgba(15,23,42,0.38)] backdrop-blur-sm xl:hidden"
                  onClick={closeOverlays}
                >
                  <Motion.div
                    initial={{ x: -24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -24, opacity: 0 }}
                    className="flex h-full w-full max-w-[min(22rem,calc(100vw-0.75rem))] flex-col"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Card className="flex h-full flex-col rounded-none border-y-0 border-l-0 p-6 sm:rounded-r-[32px] sm:border sm:border-l-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <BrandMark />
                          <div>
                            <div className="font-heading text-lg font-bold">MindFlow</div>
                            <div className="text-sm text-[var(--text-muted)]">AI study workspace</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={closeOverlays} aria-label="Close menu">
                          <X size={18} />
                        </Button>
                      </div>

                      <div className="mt-6 space-y-2">
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

                      <Card variant="accent" className="mt-auto p-5">
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
                      </Card>
                    </Card>
                  </Motion.div>
                </Motion.div>
              )}
            </AnimatePresence>

            <main className="workspace-main">
              <div className="workspace-main-inner">
                {authError && (
                  <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[rgba(217,48,37,0.22)] bg-[rgba(217,48,37,0.06)] px-4 py-3 text-sm">
                    <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-[var(--danger)]" />
                    <span>{authError}</span>
                  </div>
                )}
                {children}
              </div>
            </main>
            <MobileBottomNav />
            <InstallPrompt />
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
