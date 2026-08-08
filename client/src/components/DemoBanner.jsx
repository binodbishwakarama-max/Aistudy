import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';
import Button from './ui/Button';

const DemoBanner = () => (
  <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 pb-3 pt-[calc(0.75rem+var(--safe-area-top))] sm:px-6">
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Demo · {BRAND.examSprintLabel}</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)] sm:hidden">
          Try the sprint without signing up.
        </p>
      </div>
      <Link to="/register" className="flex-shrink-0">
        <Button size="sm" variant="secondary">Sign up</Button>
      </Link>
    </div>
  </div>
);

export default DemoBanner;
