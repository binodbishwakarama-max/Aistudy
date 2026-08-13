import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, HelpCircle, UserPlus } from 'lucide-react';
import { BRAND } from '../config/brand';
import BrandMark from './BrandMark';
import Button from './ui/Button';

const DemoBanner = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-elevated)]/90 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        {/* Left: Brand & Demo Indicator */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <BrandMark />
            <span className="font-heading text-base font-bold tracking-tight text-[var(--text-primary)]">
              MindFlow
            </span>
          </Link>
          <span className="hidden rounded-full bg-[var(--bg-strong)] px-2.5 py-0.5 text-xs font-bold text-[var(--accent)] sm:inline-block">
            DEMO MODE
          </span>
        </div>

        {/* Center/Right Desktop Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/demo/flashcards"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              location.pathname === '/demo/flashcards'
                ? 'bg-[var(--bg-strong)] text-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
            }`}
          >
            <Layers size={14} />
            <span>Cards</span>
          </Link>

          <Link
            to="/demo/quizzes"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              location.pathname === '/demo/quizzes'
                ? 'bg-[var(--bg-strong)] text-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
            }`}
          >
            <HelpCircle size={14} />
            <span>Quiz</span>
          </Link>

          <Link to="/register" className="ml-2">
            <Button size="sm" rightIcon={UserPlus} className="shadow-sm">
              Sign up
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default DemoBanner;
