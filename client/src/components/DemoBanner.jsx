import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Sparkles } from 'lucide-react';
import { BRAND } from '../config/brand';
import Button from './ui/Button';

const DemoBanner = () => (
  <div className="sticky top-0 z-30 border-b border-[var(--border-accent)] bg-[var(--bg-strong)] px-4 pb-3 pt-[calc(0.75rem+var(--safe-area-top))] sm:px-6">
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Sparkles size={16} className="text-[var(--accent)]" />
          <span className="font-semibold text-[var(--text-primary)]">Demo mode</span>
          <span className="info-chip py-1 text-xs">
            <Clock size={12} />
            {BRAND.examSprintLabel}
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--text-secondary)] sm:hidden">
          Try the sprint without signing up.
        </p>
      </div>
      <Link to="/register" className="flex-shrink-0">
        <Button size="sm">Sign up</Button>
      </Link>
    </div>
  </div>
);

export default DemoBanner;
