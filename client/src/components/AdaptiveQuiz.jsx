import React, { useEffect, useRef, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  ChevronDown,
  Clock,
  RefreshCw,
  Sparkles,
  Tag,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateAdaptiveQuiz, submitAdaptiveResults } from '../services/api';
import { toast } from 'react-hot-toast';

const DIFFICULTY_COLORS = {
  foundational: { bg: 'rgba(24,128,56,0.08)', border: 'rgba(24,128,56,0.25)', text: 'var(--success)', label: 'Foundational' },
  balanced: { bg: 'rgba(66,133,244,0.08)', border: 'rgba(66,133,244,0.25)', text: 'var(--accent)', label: 'Balanced' },
  advanced: { bg: 'rgba(234,134,0,0.08)', border: 'rgba(234,134,0,0.25)', text: 'var(--warm)', label: 'Advanced' },
};

const CONSECUTIVE_WRONG_THRESHOLD = 3;

const AdaptiveQuiz = () => {
  // Quiz state
  const [phase, setPhase] = useState('idle'); // idle | loading | playing | adapting | results
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]); // { topic, correct, difficulty }

  // Adaptation state
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [difficultyShifts, setDifficultyShifts] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState('balanced');

  // Metadata
  const [submissionResult, setSubmissionResult] = useState(null);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionTimes, setQuestionTimes] = useState([]);
  const startTimeRef = useRef(null);

  const { addXP, updateStreak } = useGamification();
  const currentQuestion = questions[currentIndex];

  // Timer effect
  useEffect(() => {
    if (phase !== 'playing') return;
    startTimeRef.current = Date.now();
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, phase]);

  // --- Actions ---

  const startQuiz = async () => {
    setPhase('loading');
    try {
      const data = await generateAdaptiveQuiz(10);
      setQuestions(data.questions);
      setCurrentIndex(0);
      setScore(0);
      setAnswers([]);
      setConsecutiveWrong(0);
      setDifficultyShifts(0);
      setCurrentDifficulty('balanced');
      setQuestionTimes([]);
      setPhase('playing');
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message || 'Failed to generate adaptive quiz.');
      setPhase('idle');
    }
  };

  const handleOptionClick = (index) => {
    if (isAnswered) return;

    const timeTaken = elapsedSeconds;
    const isCorrect = index === currentQuestion.correctIndex;

    setQuestionTimes((prev) => [...prev, timeTaken]);
    setSelectedOption(index);
    setIsAnswered(true);

    const answer = {
      topic: currentQuestion.topic || 'General',
      correct: isCorrect,
      difficulty: currentQuestion.difficulty || 'balanced',
    };
    setAnswers((prev) => [...prev, answer]);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setConsecutiveWrong(0);
      addXP(15);
    } else {
      addXP(3);
      const newStreak = consecutiveWrong + 1;
      setConsecutiveWrong(newStreak);

      // Trigger difficulty downshift
      if (newStreak >= CONSECUTIVE_WRONG_THRESHOLD && currentDifficulty !== 'foundational') {
        setDifficultyShifts((prev) => prev + 1);
        setCurrentDifficulty((prev) =>
          prev === 'advanced' ? 'balanced' : 'foundational'
        );
        // Show adaptation animation
        setPhase('adapting');
        setTimeout(() => setPhase('playing'), 1800);
      }
    }
  };

  const nextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setElapsedSeconds(0);
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      return;
    }

    // Quiz complete
    setPhase('loading');
    updateStreak();

    try {
      const result = await submitAdaptiveResults(answers);
      setSubmissionResult(result);
      addXP(result.xpEarned || 50);

      if (result.accuracy >= 70) {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      }
    } catch {
      toast.error('Failed to save quiz results, but your answers were recorded locally.');
      setSubmissionResult({
        accuracy: Math.round((score / questions.length) * 100),
        xpEarned: 50,
        topicScores: [],
        summary: {
          totalQuestions: questions.length,
          correctAnswers: score,
          topicsUpdated: 0,
        },
      });
    }
    setPhase('results');
  };

  // --- Renders ---

  // IDLE: Start screen
  if (phase === 'idle') {
    return (
      <Motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[420px] flex-col items-center justify-center text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(66,133,244,0.1)]">
          <Brain size={30} className="text-[var(--accent)]" />
        </div>
        <h2 className="font-heading mt-6 text-3xl font-bold tracking-tight">Adaptive Quiz Engine</h2>
        <p className="mt-4 max-w-lg text-base leading-8 text-[var(--text-secondary)]">
          The AI analyzes your flashcard library and tailors questions to your weak spots.
          Difficulty adjusts in real-time as you answer.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {Object.entries(DIFFICULTY_COLORS).map(([key, val]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: val.bg, border: `1px solid ${val.border}`, color: val.text }}
            >
              {val.label}
            </span>
          ))}
        </div>
        <button onClick={startQuiz} className="primary-button mt-8 justify-center px-8">
          <Zap size={18} />
          Start adaptive quiz
        </button>
      </Motion.div>
    );
  }

  // LOADING
  if (phase === 'loading') {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
        <div className="relative mx-auto mb-4 h-14 w-14">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
        </div>
        <p className="mt-2 text-sm font-medium text-[var(--text-muted)]">
          Analyzing your knowledge base and generating questions…
        </p>
      </div>
    );
  }

  // ADAPTING: Brief animation when difficulty shifts
  if (phase === 'adapting') {
    return (
      <Motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-[420px] flex-col items-center justify-center text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(234,134,0,0.1)]">
          <ChevronDown size={32} className="animate-bounce text-[var(--warm)]" />
        </div>
        <h3 className="font-heading mt-5 text-2xl font-bold">Adjusting difficulty…</h3>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          Switching to <strong>{currentDifficulty}</strong> mode based on your recent answers.
        </p>
      </Motion.div>
    );
  }

  // RESULTS
  if (phase === 'results' && submissionResult) {
    const { accuracy, xpEarned, topicScores, summary } = submissionResult;
    const totalTime = questionTimes.reduce((sum, v) => sum + v, 0);
    const avgTime = questionTimes.length ? Math.floor(totalTime / questionTimes.length) : 0;

    return (
      <Motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto max-w-lg">
        <div className="space-y-5">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--warm-soft)] text-[var(--warm)]">
              <Trophy size={30} />
            </div>
            <h2 className="font-heading mt-5 text-2xl font-bold">Adaptive quiz complete</h2>
            <div className="mt-3 text-5xl font-semibold tracking-tight text-[var(--accent)]">{accuracy}%</div>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {summary.correctAnswers} of {summary.totalQuestions} correct · +{xpEarned} XP earned
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-[var(--bg-elevated)] p-3 text-center">
              <div className="text-xs text-[var(--text-muted)]">Time</div>
              <div className="mt-1 text-sm font-semibold">{Math.floor(totalTime / 60)}m {totalTime % 60}s</div>
            </div>
            <div className="rounded-2xl bg-[var(--bg-elevated)] p-3 text-center">
              <div className="text-xs text-[var(--text-muted)]">Avg/Q</div>
              <div className="mt-1 text-sm font-semibold">{avgTime}s</div>
            </div>
            <div className="rounded-2xl bg-[var(--bg-elevated)] p-3 text-center">
              <div className="text-xs text-[var(--text-muted)]">Shifts</div>
              <div className="mt-1 text-sm font-semibold">{difficultyShifts}</div>
            </div>
          </div>

          {/* Topic breakdown */}
          {topicScores && topicScores.length > 0 && (
            <div className="rounded-2xl bg-[var(--bg-elevated)] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <BarChart3 size={16} className="text-[var(--accent)]" />
                Topic mastery
              </div>
              <div className="mt-3 space-y-2.5">
                {topicScores.map((ts) => (
                  <div key={ts.topic}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-secondary)]">{ts.topic}</span>
                      <span className="font-mono font-medium text-[var(--text-primary)]">
                        {Math.round(ts.score * 100)}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.round(ts.score * 100)}%`,
                          background: ts.score >= 0.7
                            ? 'var(--success)'
                            : ts.score >= 0.4
                              ? 'var(--accent)'
                              : 'var(--danger)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => { setPhase('idle'); setSubmissionResult(null); }} className="primary-button w-full justify-center">
            <RefreshCw size={18} />
            Take another adaptive quiz
          </button>
        </div>
      </Motion.div>
    );
  }

  // PLAYING
  if (!currentQuestion) return null;

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const diffStyle = DIFFICULTY_COLORS[currentQuestion.difficulty] || DIFFICULTY_COLORS.balanced;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-5 flex-1 flex flex-col justify-center">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: diffStyle.bg, border: `1px solid ${diffStyle.border}`, color: diffStyle.text }}
          >
            <Sparkles size={12} />
            {diffStyle.label}
          </span>
          {currentQuestion.topic && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
              <Tag size={12} />
              {currentQuestion.topic}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="info-chip font-mono">
            {currentIndex + 1} / {questions.length}
          </div>
          <div className="info-chip">
            <Clock size={14} className="text-[var(--accent)]" />
            <span className="font-mono">{elapsedSeconds}s</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
        <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Consecutive wrong indicator */}
      {consecutiveWrong > 0 && consecutiveWrong < CONSECUTIVE_WRONG_THRESHOLD && (
        <Motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl border border-[rgba(234,134,0,0.2)] bg-[rgba(234,134,0,0.05)] px-3 py-2 text-xs text-[var(--warm)]"
        >
          <Zap size={14} />
          {CONSECUTIVE_WRONG_THRESHOLD - consecutiveWrong} more wrong answer{CONSECUTIVE_WRONG_THRESHOLD - consecutiveWrong > 1 ? 's' : ''} will trigger difficulty adjustment
        </Motion.div>
      )}

      {/* Question card */}
      <AnimatePresence mode="wait">
        <Motion.div key={currentIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          <h3 className="font-heading text-xl font-bold leading-8 text-[var(--text-primary)] sm:text-2xl sm:leading-10">
            {currentQuestion.question}
          </h3>

          <div className="mt-5 space-y-3">
            {currentQuestion.options.map((option, index) => {
              let stateStyles = 'border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]';

              if (isAnswered) {
                if (index === currentQuestion.correctIndex) {
                  stateStyles = 'border-[rgba(24,128,56,0.3)] bg-[rgba(24,128,56,0.08)] text-[var(--success)]';
                } else if (index === selectedOption) {
                  stateStyles = 'border-[rgba(217,48,37,0.3)] bg-[rgba(217,48,37,0.08)] text-[var(--danger)]';
                } else {
                  stateStyles = 'border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-muted)] opacity-60';
                }
              }

              return (
                <Motion.button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={isAnswered}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  className={`w-full min-h-[44px] rounded-2xl border px-4 py-3 text-left transition-mindflow sm:py-4 ${stateStyles}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{option}</span>
                    {isAnswered && index === currentQuestion.correctIndex && <Check className="text-[var(--success)]" size={18} />}
                    {isAnswered && index === selectedOption && index !== currentQuestion.correctIndex && (
                      <X className="text-[var(--danger)]" size={18} />
                    )}
                  </div>
                </Motion.button>
              );
            })}
          </div>

          {isAnswered && currentQuestion.explanation && (
            <Motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl bg-[var(--bg-elevated)] p-4">
              <p className="text-sm leading-7 text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text-primary)]">Explanation:</span> {currentQuestion.explanation}
              </p>
            </Motion.div>
          )}
        </Motion.div>
      </AnimatePresence>

      {isAnswered && (
        <Motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
          <Motion.button 
            onClick={nextQuestion} 
            className="primary-button w-full justify-center px-6 sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentIndex < questions.length - 1 ? 'Next question' : 'See results'}
            <ArrowRight size={18} />
          </Motion.button>
        </Motion.div>
      )}
    </div>
  );
};

export default AdaptiveQuiz;
