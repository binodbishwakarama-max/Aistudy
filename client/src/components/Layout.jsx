import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ChevronDown,
  Command,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings2,
  Sparkles,
  Trophy,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { workspaceHighlights, workspaceNavigation } from '../config/workspace';
import BrandMark from './BrandMark';
import Button from './ui/Button';
import Card from './ui/Card';
import InstallPrompt from './InstallPrompt';

const marketingRoutes = new Set(['/', '/login', '/register']);

const isPathActive = (pathname, path) => {
  if (path === '/analytics') return pathname === '/analytics' || pathname === '/stats';
  return pathname === path;
};

const getPageLabel = (pathname) => {
  if (pathname === '/dashboard') return 'Overview';
  if (pathname === '/upload') return 'Upload notes';
  if (pathname === '/flashcards') return 'Flashcards';
  if (pathname === '/quizzes') return 'Quizzes';
  if (pathname === '/analytics' || pathname === '/stats') return 'Analytics';
  if (pathname === '/settings') return 'Settings';
  return 'Workspace';
};

const MobileBottomNav = ({ onOpenSearch, onOpenMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const studyActive = ['/study', '/flashcards', '/quizzes'].includes(location.pathname);

  const items = [
    { label: 'Home', icon: LayoutDashboard, active: location.pathname === '/dashboard', action: () => navigate('/dashboard') },
    { label: 'Study', icon: Sparkles, active: studyActive, action: () => navigate('/study') },
    { label: 'Search', icon: Search, active: false, action: onOpenSearch },
    { label: 'Profile', icon: User, active: location.pathname === '/settings', action: () => navigate('/settings') },
    { label: 'More', icon: Menu, active: false, action: onOpenMenu },
  ];

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-[var(--border)] bg-[rgba(13,18,32,0.9)] px-1.5 py-1.5 shadow-[0_18px_48px_rgba(2,6,23,0.45)] backdrop-blur-xl xl:hidden" style={{ paddingBottom: 'calc(0.375rem + var(--safe-area-bottom))' }} aria-label="Mobile workspace navigation">
      {items.map(({ label, icon: Icon, active, action }) => (
        <button key={label} type="button" onClick={action} className={`flex min-h-12 min-w-12 flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[10px] font-medium transition-colors ${active ? 'bg-[var(--bg-strong)] text-[var(--accent-light)]' : 'text-[var(--text-muted)] hover:bg-white/[0.05] hover:text-white'}`}>
          <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
};

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, authError } = useAuth();
  const { gameState, showLevelUp } = useGamification();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [workspaceQuery, setWorkspaceQuery] = useState('');
  const searchInputRef = useRef(null);
  const isMarketing = marketingRoutes.has(location.pathname);

  const userName = useMemo(() => {
    const fullName = user?.user_metadata?.full_name?.trim();
    return fullName || user?.email?.split('@')[0] || 'Student';
  }, [user]);

  const userInitials = useMemo(() => {
    const initials = userName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
    return initials || 'MF';
  }, [userName]);

  useEffect(() => {
    if (!mobileSearchOpen) return undefined;
    const focusId = window.setTimeout(() => searchInputRef.current?.focus(), 80);
    return () => window.clearTimeout(focusId);
  }, [mobileSearchOpen]);

  const closeOverlays = () => {
    setMobileOpen(false);
    setMobileSearchOpen(false);
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

    const target = workspaceNavigation.find((item) => [item.label, item.description, ...(item.keywords || [])].join(' ').toLowerCase().includes(query));
    if (target) {
      handleNavigation(target.path);
      setWorkspaceQuery('');
    }
  };

  return (
    <div className={isMarketing ? 'min-h-screen text-[var(--text-primary)]' : 'workspace-shell text-[var(--text-primary)]'}>
      <div className="noise-overlay" />
      <div className="ambient-aurora-1" />
      <div className="ambient-aurora-2" />

      <AnimatePresence>
        {showLevelUp && (
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-md">
            <Motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}>
              <Card className="w-full max-w-sm p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--warm-soft)] text-[var(--warm)]"><Trophy size={26} /></div>
                <p className="kicker mt-5">Level up</p>
                <h2 className="font-heading mt-2 text-3xl font-bold">Level {gameState.level}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Your study habit is becoming a repeatable system.</p>
              </Card>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {isMarketing ? children : (
        <>
          <aside className="workspace-sidebar hidden xl:flex">
            <div className="flex h-full flex-col">
              <Link to="/dashboard" className="flex items-center gap-3" aria-label="MindFlow dashboard">
                <BrandMark />
                <div>
                  <div className="font-heading text-base font-bold tracking-tight">MindFlow</div>
                  <div className="text-[11px] text-[var(--text-muted)]">AI study workspace</div>
                </div>
              </Link>

              <Card variant="accent" className="mt-8 p-4">
                <div className="flex items-center gap-3">
                  <span className="workspace-avatar">{userInitials}</span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{userName}</div>
                    <div className="truncate text-[11px] text-[var(--text-muted)]">{user?.email || 'Signed in'}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3 text-xs">
                  <span className="text-[var(--text-muted)]">Current streak</span>
                  <span className="font-semibold text-[var(--warm)]">{gameState.streak} days</span>
                </div>
              </Card>

              <div className="mt-8 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-faint)]">Workspace</div>
              <nav className="mt-3 space-y-1.5" aria-label="Workspace navigation">
                {workspaceNavigation.map((item) => {
                  const active = isPathActive(location.pathname, item.path);
                  return (
                    <button key={item.path} type="button" onClick={() => handleNavigation(item.path)} className={`workspace-nav-item ${active ? 'workspace-nav-item--active' : ''}`}>
                      <span className="workspace-nav-icon"><item.icon size={16} /></span>
                      <span className="min-w-0"><span className="block text-sm font-semibold">{item.label}</span><span className="block truncate text-[10px] text-[var(--text-faint)]">{item.description}</span></span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto space-y-3 pt-8">
                {workspaceHighlights.map((highlight) => (
                  <div key={highlight.label} className="rounded-xl border border-[var(--border)] bg-white/[0.025] p-3">
                    <div className="flex items-start gap-2.5"><highlight.icon size={15} className="mt-0.5 text-[var(--accent-light)]" /><div><div className="text-xs font-semibold">{highlight.label}</div><p className="mt-1 text-[10px] leading-5 text-[var(--text-muted)]">{highlight.value}</p></div></div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full justify-start" leftIcon={LogOut} onClick={handleLogout}>Log out</Button>
              </div>
            </div>
          </aside>

          <div className="workspace-content">
            <header className="workspace-topbar">
              <div className="workspace-topbar-inner">
                <div className="flex items-center gap-3 xl:hidden">
                  <Link to="/dashboard" aria-label="MindFlow dashboard"><BrandMark className="h-9 w-9 rounded-xl" /></Link>
                  <div><div className="text-sm font-bold">{getPageLabel(location.pathname)}</div><div className="text-[10px] text-[var(--text-faint)]">MindFlow workspace</div></div>
                </div>
                <div className="hidden min-w-0 flex-1 items-center gap-4 xl:flex">
                  <div><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-light)]">{getPageLabel(location.pathname)}</div><div className="mt-1 text-sm text-[var(--text-muted)]">Keep your next study step visible.</div></div>
                  <form onSubmit={handleSearchSubmit} className="workspace-search ml-6"><Search size={15} className="text-[var(--text-faint)]" /><input value={workspaceQuery} onChange={(event) => setWorkspaceQuery(event.target.value)} className="workspace-search-input" placeholder="Jump to a workspace area..." aria-label="Search workspace" /><span className="hidden items-center gap-1 rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--text-faint)] 2xl:flex"><Command size={10} /> K</span></form>
                </div>

                <div className="workspace-topbar-actions">
                  <div className="hidden items-center gap-2 lg:flex"><span className="info-chip"><Sparkles size={13} className="text-[var(--accent-light)]" /> XP {gameState.xp}</span><span className="info-chip"><Trophy size={13} className="text-[var(--warm)]" /> Level {gameState.level}</span></div>
                  <button type="button" onClick={() => setProfileOpen((prev) => !prev)} className="workspace-profile-trigger" aria-expanded={profileOpen} aria-label="Open profile menu">
                    <span className="workspace-avatar workspace-avatar--small">{userInitials}</span>
                    <span className="hidden max-w-28 text-left md:block"><span className="block truncate text-xs font-semibold">{userName}</span><span className="block truncate text-[10px] text-[var(--text-faint)]">{user?.email || 'Workspace member'}</span></span>
                    <ChevronDown size={14} className="text-[var(--text-muted)]" />
                  </button>
                  <AnimatePresence>
                    {profileOpen && <Motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute right-4 top-[calc(100%+0.75rem)] z-50 w-64"><Card className="p-3"><div className="flex items-center gap-3 border-b border-[var(--border)] pb-3"><span className="workspace-avatar">{userInitials}</span><div className="min-w-0"><div className="truncate text-sm font-semibold">{userName}</div><div className="truncate text-[11px] text-[var(--text-muted)]">{user?.email || 'Signed in'}</div></div></div><div className="mt-2 space-y-1"><button type="button" onClick={() => handleNavigation('/settings')} className="workspace-dropdown-item"><Settings2 size={14} className="mr-2 inline" /> Settings</button><button type="button" onClick={handleLogout} className="workspace-dropdown-item text-[var(--danger)]"><LogOut size={14} className="mr-2 inline" /> Log out</button></div></Card></Motion.div>}
                  </AnimatePresence>
                </div>
              </div>
            </header>

            <AnimatePresence>
              {mobileSearchOpen && <Motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="fixed inset-0 z-[120] flex flex-col bg-[var(--bg-base)] xl:hidden"><div className="flex items-center gap-2 border-b border-[var(--border)] p-3"><form onSubmit={handleSearchSubmit} className="workspace-search flex-1"><Search size={16} className="text-[var(--text-faint)]" /><input ref={searchInputRef} value={workspaceQuery} onChange={(event) => setWorkspaceQuery(event.target.value)} className="workspace-search-input" placeholder="Search workspace..." aria-label="Search workspace" /></form><Button variant="ghost" size="icon" onClick={closeOverlays} aria-label="Close search"><X size={18} /></Button></div><div className="flex-1 overflow-y-auto p-4"><div className="kicker mb-3">Quick navigation</div><div className="grid gap-2">{workspaceNavigation.filter((item) => !workspaceQuery || [item.label, item.description, ...(item.keywords || [])].join(' ').toLowerCase().includes(workspaceQuery.toLowerCase())).map((item) => <button key={item.path} type="button" onClick={() => handleNavigation(item.path)} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-white/[0.025] p-3 text-left hover:border-[var(--border-accent)]"><span className="workspace-nav-icon"><item.icon size={16} /></span><span><span className="block text-sm font-semibold">{item.label}</span><span className="text-xs text-[var(--text-muted)]">{item.description}</span></span></button>)}</div></div></Motion.div>}
            </AnimatePresence>

            <AnimatePresence>
              {mobileOpen && <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-slate-950/65 backdrop-blur-sm xl:hidden" onClick={closeOverlays}><Motion.div initial={{ x: -18, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -18, opacity: 0 }} className="h-full w-[min(21rem,calc(100vw-1rem))] border-r border-[var(--border)] bg-[var(--bg-surface)] p-5" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><Link to="/dashboard" className="flex items-center gap-3"><BrandMark className="h-9 w-9 rounded-xl" /><div><div className="text-sm font-bold">MindFlow</div><div className="text-[10px] text-[var(--text-faint)]">AI study workspace</div></div></Link><Button variant="ghost" size="icon" onClick={closeOverlays} aria-label="Close menu"><X size={18} /></Button></div><nav className="mt-8 space-y-1.5">{workspaceNavigation.map((item) => <button key={item.path} type="button" onClick={() => handleNavigation(item.path)} className={`workspace-nav-item ${isPathActive(location.pathname, item.path) ? 'workspace-nav-item--active' : ''}`}><span className="workspace-nav-icon"><item.icon size={16} /></span><span><span className="block text-sm font-semibold">{item.label}</span><span className="text-[10px] text-[var(--text-faint)]">{item.description}</span></span></button>)}</nav><Card variant="accent" className="mt-8 p-4"><div className="flex items-center gap-3"><span className="workspace-avatar">{userInitials}</span><div className="min-w-0"><div className="truncate text-sm font-semibold">{userName}</div><div className="truncate text-[11px] text-[var(--text-muted)]">{user?.email || 'Signed in'}</div></div></div><Button variant="secondary" className="mt-4 w-full justify-center" leftIcon={LogOut} onClick={handleLogout}>Log out</Button></Card></Motion.div></Motion.div>}
            </AnimatePresence>

            <main className="workspace-main">
              <div className="workspace-main-inner">
                {authError && <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-300/20 bg-rose-400/[0.07] px-4 py-3 text-sm text-[var(--text-secondary)]"><AlertTriangle size={17} className="mt-0.5 shrink-0 text-[var(--danger)]" /><span>{authError}</span></div>}
                {children}
              </div>
            </main>
            <MobileBottomNav onOpenSearch={() => setMobileSearchOpen(true)} onOpenMenu={() => setMobileOpen(true)} />
            <InstallPrompt />
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
