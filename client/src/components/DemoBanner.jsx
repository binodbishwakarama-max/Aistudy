import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Sparkles } from 'lucide-react';
import { BRAND } from '../config/brand';
import Button from './ui/Button';

const DemoBanner = () => (
  <div className="sticky top-0 z-30 border-b border-[var(--border-accent)] bg-[var(--bg-strong)] px-4 py-3 sm:px-6">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm">
        <Sparkles size={16} className="text-[var(--accent)]" />
        <span className="font-semibold text-[var(--text-primary)]">Demo mode</span>
        <span className="hidden text-[var(--text-secondary)] sm:inline">· {BRAND.examSprintLabel}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-elevated)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
          <Clock size={12} />
          ~45 min
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/register">
          <Button size="sm">Sign up to save progress</Button>
        </Link>
      </div>
    </div>
  </div>
);

export default DemoBanner;
