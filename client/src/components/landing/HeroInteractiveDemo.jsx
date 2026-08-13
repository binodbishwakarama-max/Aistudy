import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Brain, Check, BarChart3, RotateCw } from 'lucide-react';
import { playSound } from '../../utils/soundEngine';

const SAMPLE_CARD = {
  question: "What is the CAP Theorem in Distributed Systems?",
  answer: "The CAP Theorem states that any distributed data store can simultaneously provide at most TWO of three guarantees: Consistency (every read receives the most recent write), Availability (every request receives a non-error response), and Partition Tolerance (the system operates despite network dropouts).",
  explanation: "In a network partition, you must choose between Consistency (refusing writes) or Availability (accepting writes that may diverge)."
};

const SAMPLE_QUIZ = {
  question: "In database systems, which ACID property guarantees that all operations within a transaction complete or none do?",
  options: [
    "Atomicity",
    "Consistency",
    "Isolation",
    "Durability"
  ],
  correctIndex: 0,
  explanation: "Atomicity ensures that a transaction is treated as a single 'all-or-nothing' unit of work."
};

const HeroInteractiveDemo = () => {
  const [activeTab, setActiveTab] = useState('flashcard'); // 'flashcard' | 'quiz' | 'heatmap'
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    playSound('cardFlip');
  };

  const handleRate = (type) => {
    playSound(type === 'easy' || type === 'good' ? 'correct' : 'click');
    setTimeout(() => {
      setIsFlipped(false);
    }, 800);
  };

  const handleQuizOption = (idx) => {
    setSelectedOption(idx);
    playSound(idx === SAMPLE_QUIZ.correctIndex ? 'correct' : 'incorrect');
  };

  return (
    <div className="w-full overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.6)] bg-white/70 backdrop-blur-[20px] saturate-[180%] shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all">
      {/* Apple-style Translucent Window Header */}
      <div className="flex flex-col gap-2.5 border-b border-[var(--border)] bg-white/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-3.5 backdrop-blur-[12px]">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#FF5F56] shadow-inner" />
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E] shadow-inner" />
          <div className="h-3 w-3 rounded-full bg-[#27C93F] shadow-inner" />
          <span className="ml-3 hidden font-mono text-[11px] font-medium tracking-tight text-[var(--text-muted)] sm:inline">
            mindflow.app / fluid-demo
          </span>
        </div>

        {/* Fluid Pill Tab Switcher */}
        <div className="relative flex items-center self-start rounded-full border border-[var(--border)] bg-[var(--bg-surface)] p-1 sm:self-auto">
          {['flashcard', 'quiz', 'heatmap'].map((tab) => {
            const isActive = activeTab === tab;
            const labels = { flashcard: 'Cards', quiz: 'Quiz', heatmap: 'Heatmap' };
            const Icons = { flashcard: BookOpen, quiz: Brain, heatmap: BarChart3 };
            const Icon = Icons[tab];

            return (
              <button
                key={tab}
                type="button"
                onPointerDown={() => {
                  setActiveTab(tab);
                  playSound('click');
                }}
                className={`relative flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-tight transition-colors z-10 sm:gap-1.5 sm:px-3.5 sm:text-xs ${
                  isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {isActive && (
                  <Motion.div
                    layoutId="activeTabPill"
                    transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                    className="absolute inset-0 rounded-full bg-white shadow-sm border border-[var(--border)] -z-10"
                  />
                )}
                <Icon size={12} />
                <span>{labels[tab]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Motion Body */}
      <div className="p-4 sm:p-6 md:p-8 min-h-[260px] sm:min-h-[300px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* TAB 1: FLASHCARD FLUID INTERACTION */}
          {activeTab === 'flashcard' && (
            <Motion.div
              key="flashcard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="w-full max-w-lg"
            >
              <Motion.div
                onPointerDown={handleFlip}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
                className="group relative cursor-pointer rounded-[20px] border border-[var(--border-strong)] bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-1 text-xs font-mono text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
                  <span className="tracking-tight">CARD 1 OF 12 · DISTRIBUTED SYSTEMS</span>
                  <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                    <RotateCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                    Tap to flip
                  </span>
                </div>

                <div className="my-6 min-h-[90px]">
                  {!isFlipped ? (
                    <div>
                      <h4 className="text-base font-bold tracking-tight text-[var(--text-primary)] sm:text-lg">
                        {SAMPLE_CARD.question}
                      </h4>
                      <p className="mt-2 text-xs text-[var(--text-muted)] font-mono">
                        Tap anywhere to reveal active recall answer.
                      </p>
                    </div>
                  ) : (
                    <Motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                    >
                      <p className="text-xs font-mono font-semibold uppercase text-[var(--accent)] tracking-wider">Answer</p>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--text-primary)] sm:text-sm">
                        {SAMPLE_CARD.answer}
                      </p>
                    </Motion.div>
                  )}
                </div>

                {/* Instant Active Rating Buttons */}
                {isFlipped && (
                  <Motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                    className="border-t border-[var(--border)] pt-4 flex items-center justify-between gap-2"
                  >
                    <span className="text-[11px] text-[var(--text-muted)] font-mono tracking-tight">RATE RECALL:</span>
                    <div className="flex gap-2">
                      {[
                        { label: 'Hard', type: 'hard', class: 'border-[rgba(217,48,37,0.3)] bg-[rgba(217,48,37,0.06)] text-[var(--danger)]' },
                        { label: 'Good', type: 'good', class: 'border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)]' },
                        { label: 'Easy', type: 'easy', class: 'border-[rgba(24,128,56,0.3)] bg-[rgba(24,128,56,0.06)] text-[var(--success)]' },
                      ].map((item) => (
                        <Motion.button
                          key={item.label}
                          type="button"
                          whileTap={{ scale: 0.94 }}
                          onPointerDown={() => handleRate(item.type)}
                          className={`rounded-full border px-3.5 py-1 text-xs font-semibold transition-colors ${item.class}`}
                        >
                          {item.label}
                        </Motion.button>
                      ))}
                    </div>
                  </Motion.div>
                )}
              </Motion.div>
            </Motion.div>
          )}

          {/* TAB 2: ADAPTIVE QUIZ FLUID INTERACTION */}
          {activeTab === 'quiz' && (
            <Motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="w-full max-w-lg space-y-4 text-left"
            >
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                <span>QUIZ PREVIEW · QUESTION 1/1</span>
                <span className="text-[var(--text-primary)] font-semibold">ADAPTIVE MODE</span>
              </div>

              <h4 className="text-sm font-bold tracking-tight text-[var(--text-primary)] sm:text-base leading-snug">
                {SAMPLE_QUIZ.question}
              </h4>

              <div className="space-y-2">
                {SAMPLE_QUIZ.options.map((option, idx) => {
                  let stateStyle = "border-[var(--border)] bg-white text-[var(--text-primary)] hover:border-[var(--text-secondary)]";
                  if (selectedOption !== null) {
                    if (idx === SAMPLE_QUIZ.correctIndex) {
                      stateStyle = "border-[rgba(24,128,56,0.3)] bg-[rgba(24,128,56,0.08)] text-[var(--success)] font-semibold";
                    } else if (idx === selectedOption) {
                      stateStyle = "border-[rgba(217,48,37,0.3)] bg-[rgba(217,48,37,0.08)] text-[var(--danger)]";
                    } else {
                      stateStyle = "border-[var(--border)] bg-white text-[var(--text-muted)] opacity-50";
                    }
                  }

                  return (
                    <Motion.button
                      key={option}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onPointerDown={() => handleQuizOption(idx)}
                      className={`w-full rounded-2xl border px-4 py-3 text-xs text-left transition-colors flex items-center justify-between ${stateStyle}`}
                    >
                      <span>{option}</span>
                      {selectedOption !== null && idx === SAMPLE_QUIZ.correctIndex && (
                        <Check size={14} className="text-[var(--success)]" />
                      )}
                    </Motion.button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <Motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-[var(--text-secondary)] leading-relaxed"
                >
                  Explanation: {SAMPLE_QUIZ.explanation}
                </Motion.p>
              )}
            </Motion.div>
          )}

          {/* TAB 3: HEATMAP FLUID INTERACTION */}
          {activeTab === 'heatmap' && (
            <Motion.div
              key="heatmap"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="w-full max-w-lg text-left space-y-4"
            >
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                <span>STUDY STREAK HEATMAP · LAST 84 DAYS</span>
                <span className="text-[var(--text-primary)] font-bold">14 DAY STREAK</span>
              </div>

              <div className="grid grid-cols-7 gap-1 sm:grid-cols-12 sm:gap-1.5">
                {Array.from({ length: 84 }).map((_, i) => {
                  const intensity = (i % 7 === 0 || i % 5 === 0) ? 3 : (i % 3 === 0) ? 2 : (i % 2 === 0) ? 1 : 0;
                  const bgMap = [
                    'bg-[var(--bg-surface)] border border-[var(--border)]',
                    'bg-[rgba(0,113,227,0.2)]',
                    'bg-[rgba(0,113,227,0.5)]',
                    'bg-[var(--text-primary)]',
                  ];
                  return (
                    <Motion.div
                      key={i}
                      whileHover={{ scale: 1.3 }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
                      className={`h-4 w-full rounded-sm ${bgMap[intensity]}`}
                      title={`Day ${i + 1}: ${intensity * 15} cards reviewed`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono border-t border-[var(--border)] pt-3">
                <span>Less active</span>
                <div className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[var(--bg-surface)] border border-[var(--border)]" />
                  <span className="h-2.5 w-2.5 rounded-sm bg-[rgba(0,113,227,0.2)]" />
                  <span className="h-2.5 w-2.5 rounded-sm bg-[rgba(0,113,227,0.5)]" />
                  <span className="h-2.5 w-2.5 rounded-sm bg-[var(--text-primary)]" />
                </div>
                <span>More active</span>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeroInteractiveDemo;
