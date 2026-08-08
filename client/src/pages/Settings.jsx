import React, { useMemo, useState } from 'react';
import { Bell, MoonStar, ShieldCheck, UserRound } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';

const ToggleRow = ({ icon: Icon, title, description, enabled, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex w-full items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-4 text-left transition-colors hover:border-[var(--border-strong)] sm:items-center"
  >
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-[var(--accent)]">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-sm font-semibold text-[var(--text-primary)]">{title}</div>
        <p className="mt-1 text-sm leading-7 text-[var(--text-secondary)]">{description}</p>
      </div>
    </div>
    <span
      className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors ${
        enabled ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </span>
  </button>
);

const Settings = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    notifications: true,
    focusMode: true,
    extraVerification: false,
  });

  const userName = useMemo(() => {
    const fullName = user?.user_metadata?.full_name?.trim();
    if (fullName) return fullName;
    return user?.email?.split('@')[0] || 'Student';
  }, [user]);

  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      <Motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="kicker">Settings</p>
        <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Preferences
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-[var(--text-secondary)]">
          Account details and calm defaults for how MindFlow behaves while you study.
        </p>
      </Motion.header>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-strong)] text-[var(--accent)]">
                <UserRound size={24} />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-semibold text-[var(--text-primary)]">{userName}</div>
                <div className="truncate text-sm text-[var(--text-muted)]">{user?.email || 'Account connected'}</div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { label: 'Workspace plan', value: 'MindFlow Starter' },
                { label: 'Default mode', value: 'Flashcards + Quiz' },
                { label: 'Appearance', value: 'Apple Study Desk (light)' },
              ].map((item) => (
                <div key={item.label} className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{item.label}</div>
                  <div className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{item.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </Motion.section>

        <Motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Card className="p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold tracking-tight">Workspace controls</h2>
            <div className="mt-6 space-y-3">
              <ToggleRow
                icon={Bell}
                title="Study reminders"
                description="Light reminders so it is easier to return to active sessions."
                enabled={preferences.notifications}
                onToggle={() => togglePreference('notifications')}
              />
              <ToggleRow
                icon={MoonStar}
                title="Focus mode defaults"
                description="Prefer calmer chrome while reviewing flashcards and quizzes."
                enabled={preferences.focusMode}
                onToggle={() => togglePreference('focusMode')}
              />
              <ToggleRow
                icon={ShieldCheck}
                title="Extra verification"
                description="Require confirmation for sensitive account changes when supported."
                enabled={preferences.extraVerification}
                onToggle={() => togglePreference('extraVerification')}
              />
            </div>
          </Card>
        </Motion.section>
      </div>
    </div>
  );
};

export default Settings;
