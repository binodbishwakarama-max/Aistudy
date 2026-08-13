import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Brain, RotateCcw, Zap } from 'lucide-react';
import { playSound } from '../../utils/soundEngine';

const RetentionSimulator = () => {
  const [days, setDays] = useState(7);
  const [reviewCount, setReviewCount] = useState(1);

  // Ebbinghaus forgetting curve formula: R = e^(-t / S)
  const passiveRetention = Math.round(100 * Math.exp(-days / 4));
  const srsRetention = Math.min(98, Math.round(100 * Math.exp(-days / (15 * (reviewCount + 1)))) + (reviewCount * 5));

  const handleSimulateReview = () => {
    setReviewCount((prev) => prev + 1);
    playSound('correct');
  };

  const handleReset = () => {
    setDays(7);
    setReviewCount(1);
    playSound('click');
  };

  return (
    <div className="w-full rounded-[20px] sm:rounded-[24px] border border-[rgba(255,255,255,0.6)] bg-white/70 backdrop-blur-[20px] saturate-[180%] p-4 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-5 sm:space-y-6 text-left">
      <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-[var(--text-primary)]" />
            <h3 className="font-heading text-base font-bold tracking-tight text-[var(--text-primary)] sm:text-lg">
              Interactive Ebbinghaus Memory Simulator
            </h3>
          </div>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Test memory decay rate: passive cramming vs. Leitner spaced repetition.
          </p>
        </div>

        <Motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onPointerDown={handleReset}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-4 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors self-start sm:self-auto shadow-sm"
        >
          <RotateCcw size={12} />
          Reset Simulation
        </Motion.button>
      </div>

      {/* Interactive Range Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-semibold text-[var(--text-muted)] tracking-tight uppercase">
            Time Elapsed: {days} Days
          </span>
          <span className="text-[var(--accent)] font-bold">
            {reviewCount} SRS Reviews Completed
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="30"
          value={days}
          onChange={(e) => {
            setDays(parseInt(e.target.value, 10));
            playSound('click');
          }}
          className="w-full cursor-pointer accent-[var(--text-primary)]"
        />

        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
          <span>Day 1 (Immediate)</span>
          <span>Day 15 (Midterm)</span>
          <span>Day 30 (Final Exam)</span>
        </div>
      </div>

      {/* Retention Metrics Comparison */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 pt-2">
        {/* Passive Cramming Card */}
        <div className="rounded-[16px] sm:rounded-[20px] border border-[rgba(217,48,37,0.2)] bg-[rgba(217,48,37,0.04)] p-4 sm:p-5 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--danger)] font-mono">
            Passive Cramming (No Reviews)
          </div>
          <div className="font-heading text-3xl font-extrabold tracking-tight text-[var(--danger)] sm:text-4xl">
            {passiveRetention}% <span className="text-xs font-normal text-[var(--text-muted)]">retained</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            By Day {days}, over {100 - passiveRetention}% of lecture content is forgotten without active recall.
          </p>
        </div>

        {/* MindFlow Leitner SRS Card */}
        <div className="rounded-[16px] sm:rounded-[20px] border border-[rgba(24,128,56,0.2)] bg-[rgba(24,128,56,0.04)] p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--success)] font-mono">
              MindFlow Leitner SRS
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
          </div>
          <div className="font-heading text-3xl font-extrabold tracking-tight text-[var(--success)] sm:text-4xl">
            {srsRetention}% <span className="text-xs font-normal text-[var(--text-muted)]">retained</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Scheduled active recall reviews reinforce neural pathways for long-term retention.
          </p>
        </div>
      </div>

      {/* Action Trigger Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border)] pt-4">
        <p className="text-xs text-[var(--text-muted)] font-mono">
          Simulate a Leitner review session:
        </p>

        <Motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onPointerDown={handleSimulateReview}
          className="flex items-center gap-2 rounded-full bg-[var(--text-primary)] px-6 py-2.5 text-xs font-bold text-white transition-all hover:opacity-90 shadow-md"
        >
          <Zap size={14} className="text-[var(--accent)]" />
          <span>Execute SRS Review Session</span>
        </Motion.button>
      </div>
    </div>
  );
};

export default RetentionSimulator;
