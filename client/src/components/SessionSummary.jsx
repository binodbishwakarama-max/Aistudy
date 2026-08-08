import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Home, RefreshCw, Trophy } from 'lucide-react';
import Button from './ui/Button';

const SessionSummary = ({
  title,
  subtitle,
  stats = [],
  dueTomorrow = null,
  onRestart,
  restartLabel = 'Review again',
}) => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-md text-center">
      <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--warm-soft)] text-[var(--warm)]">
          <Trophy size={28} />
        </div>
        <h2 className="font-heading mt-5 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{subtitle}</p>}

        {stats.length > 0 && (
          <div className="mt-6 space-y-3 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] p-4 text-left">
            {stats.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">{item.label}</span>
                <span className="font-semibold text-[var(--text-primary)]">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {dueTomorrow !== null && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--bg-strong)] px-4 py-2 text-sm font-medium text-[var(--accent)]">
            <Clock size={14} />
            {dueTomorrow > 0
              ? `${dueTomorrow} card${dueTomorrow === 1 ? '' : 's'} due tomorrow`
              : 'Spaced review scheduled — check back tomorrow'}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {onRestart && (
            <Button variant="secondary" leftIcon={RefreshCw} onClick={onRestart}>
              {restartLabel}
            </Button>
          )}
          <Button leftIcon={Home} onClick={() => navigate('/dashboard')}>
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionSummary;
