import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';

const STUDY_TIPS = [
  "Active recall improves long-term memory retention by up to 150% compared to re-reading.",
  "Testing yourself right before sleep accelerates memory consolidation during REM cycles.",
  "Dynamic difficulty adaptation keeps your brain in optimal cognitive flow without burnout.",
  "Spaced repetition leverages the forgetting curve to schedule reviews right when memory fades.",
  "Explaining concepts in your own words creates stronger neural pathways for exam recall.",
];

const ProgressiveLoader = ({
  title = "Generating Quiz",
  steps = [
    "Analyzing study notes and memory weights...",
    "Extracting key concepts & definitions...",
    "Drafting active-recall question items...",
    "Finalizing adaptive assessment set...",
  ],
  estimatedTimeMs = 8000,
  children,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(10);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Step rotation timer
    const stepIntervalMs = Math.max(1200, Math.floor(estimatedTimeMs / steps.length));
    const stepTimer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, stepIntervalMs);

    // Progress bar animation
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          const delta = Math.floor(Math.random() * 8) + 4;
          return Math.min(90, prev + delta);
        }
        return prev;
      });
    }, 400);

    // Tip rotation timer
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % STUDY_TIPS.length);
    }, 4000);

    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
      clearInterval(tipTimer);
    };
  }, [steps, estimatedTimeMs]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center space-y-6 py-8">
      {/* Header & Progress Bar */}
      <div className="w-full text-center">
        <div className="mb-2 flex items-center justify-between text-xs font-mono font-semibold text-[var(--text-muted)]">
          <span className="uppercase tracking-wider">{title}</span>
          <span>{progress}%</span>
        </div>

        {/* Sleek Linear Progress Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-surface)] border border-[var(--border)]">
          <Motion.div
            className="h-full bg-[var(--text-primary)] rounded-full"
            initial={{ width: '10%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Active Step Indicator */}
      <div className="h-6 flex items-center justify-center text-center">
        <Motion.p
          key={currentStepIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-sm font-medium text-[var(--text-primary)]"
        >
          {steps[currentStepIndex]}
        </Motion.p>
      </div>

      {/* Skeleton View Preview (Layout Preservation) */}
      <div className="w-full rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-soft)] space-y-4">
        {children || (
          <>
            {/* Question Text Skeleton */}
            <div className="space-y-2">
              <div className="h-5 w-3/4 animate-pulse rounded bg-[var(--border)]" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--border)] opacity-60" />
            </div>

            {/* Options Skeleton */}
            <div className="mt-6 space-y-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 w-full animate-pulse rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)]"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Rotating Psychology Study Tip */}
      <div className="w-full text-center px-4">
        <Motion.p
          key={tipIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-xs text-[var(--text-muted)] italic leading-relaxed"
        >
          "{STUDY_TIPS[tipIndex]}"
        </Motion.p>
      </div>
    </div>
  );
};

export default ProgressiveLoader;
