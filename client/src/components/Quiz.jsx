import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { ArrowRight, Check, Clock, Shuffle, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getDueSummary, recordStudySession } from '../services/api';
import { playSound } from '../utils/soundEngine';
import SessionSummary from './SessionSummary';

const Quiz = ({ questions, deckId = null, isDemoMode = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [resultScore, setResultScore] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState(questions);
  const [isShuffled, setIsShuffled] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionTimes, setQuestionTimes] = useState([]);
  const [dueTomorrow, setDueTomorrow] = useState(null);
  const [sessionStartTime] = useState(() => Date.now());
  const startTimeRef = useRef(sessionStartTime);
  const sessionStartRef = useRef(sessionStartTime);
  const sessionRecordedRef = useRef(false);
  const correctCountRef = useRef(0);

  const currentQuestion = shuffledQuestions[currentIndex];
  const { addXP, updateStreak } = useGamification();

  useEffect(() => {
    startTimeRef.current = Date.now();
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const recordSession = useCallback(async (finalScore, totalQuestions) => {
    if (sessionRecordedRef.current) return;
    sessionRecordedRef.current = true;

    const durationSeconds = Math.max(1, Math.floor((Date.now() - sessionStartRef.current) / 1000));

    try {
      if (!isDemoMode) {
        await recordStudySession({
          deckId,
          mode: 'quiz',
          durationSeconds,
          cardsReviewed: totalQuestions,
          correctCount: finalScore,
          xpEarned: finalScore * 10,
        });
      }
    } catch (error) {
      console.error('Failed to record quiz session:', error);
    }

    try {
      const due = await getDueSummary();
      setDueTomorrow(due.dueTomorrow ?? 0);
    } catch {
      setDueTomorrow(0);
    }
  }, [deckId, isDemoMode]);

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setResultScore(null);
    setShowResults(false);
    setQuestionTimes([]);
    startTimeRef.current = Date.now();
    sessionStartRef.current = Date.now();
    sessionRecordedRef.current = false;
    correctCountRef.current = 0;
    setElapsedSeconds(0);
  };

  const shuffleQuestions = () => {
    setShuffledQuestions([...questions].sort(() => Math.random() - 0.5));
    setIsShuffled(true);
    restartQuiz();
  };

  const resetOrder = () => {
    setShuffledQuestions(questions);
    setIsShuffled(false);
    restartQuiz();
  };

  const handleOptionClick = useCallback((index) => {
    if (isAnswered) return;

    const timeTaken = elapsedSeconds;
    const isCorrect = index === currentQuestion.correctIndex;

    setQuestionTimes((prev) => [...prev, timeTaken]);
    setSelectedOption(index);
    setIsAnswered(true);
    if (isCorrect) {
      correctCountRef.current += 1;
      setScore((prev) => prev + 1);
      addXP(10);
      playSound('correct');
    } else {
      addXP(2);
      playSound('incorrect');
    }
  }, [isAnswered, elapsedSeconds, currentQuestion, addXP]);

  const nextQuestion = useCallback(() => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setElapsedSeconds(0);
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      playSound('click');
      return;
    }

    const finalScore = correctCountRef.current;
    setResultScore(finalScore);
    setShowResults(true);
    updateStreak();
    addXP(50);
    recordSession(finalScore, shuffledQuestions.length);

    if (finalScore / shuffledQuestions.length >= 0.7) {
      addXP(100);
      playSound('achievement');
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    } else {
      playSound('click');
    }
  }, [currentIndex, shuffledQuestions.length, updateStreak, addXP, recordSession]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (showResults) return;
      const target = event.target;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;

      if (!isAnswered && event.key >= '1' && event.key <= '4') {
        const optionIndex = Number(event.key) - 1;
        if (optionIndex < (currentQuestion?.options?.length || 0)) {
          event.preventDefault();
          handleOptionClick(optionIndex);
        }
        return;
      }

      if (isAnswered && (event.key === 'Enter' || event.key === 'ArrowRight')) {
        event.preventDefault();
        nextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResults, isAnswered, currentQuestion, handleOptionClick, nextQuestion]);

  if (showResults) {
    const displayScore = resultScore ?? score;
    const percentage = Math.round((displayScore / shuffledQuestions.length) * 100);
    const totalTime = questionTimes.reduce((sum, value) => sum + value, 0);
    const avgTime = Math.floor(questionTimes.length ? totalTime / shuffledQuestions.length : 0);

    return (
      <SessionSummary
        title="Quiz complete"
        subtitle={`You answered ${displayScore} out of ${shuffledQuestions.length} questions correctly.`}
        stats={[
          { label: 'Score', value: `${percentage}%` },
          { label: 'Total time', value: `${Math.floor(totalTime / 60)}m ${totalTime % 60}s` },
          { label: 'Avg per question', value: `${avgTime}s` },
        ]}
        dueTomorrow={dueTomorrow}
        onRestart={restartQuiz}
        restartLabel="Try again"
      />
    );
  }

  const progress = ((currentIndex + 1) / shuffledQuestions.length) * 100;

  return (
    <div className="study-session mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={isShuffled ? resetOrder : shuffleQuestions} className="secondary-button px-4 py-2 text-sm">
          <Shuffle size={16} />
          {isShuffled ? 'Reset order' : 'Shuffle'}
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <div className="info-chip font-mono">
            Question {currentIndex + 1} / {shuffledQuestions.length}
          </div>
          <div className="info-chip">
            <Clock size={14} className="text-[var(--accent)]" />
            <span className="font-mono">{elapsedSeconds}s</span>
          </div>
          <div className="hidden text-xs text-[var(--text-muted)] sm:block">
            1–4 answer · Enter next
          </div>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
        <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <Motion.div key={currentIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="section-shell p-5 sm:p-8">
        <h3 data-testid="quiz-question" className="font-heading text-xl font-bold leading-8 text-[var(--text-primary)] sm:text-2xl sm:leading-10">
          {currentQuestion?.question}
        </h3>

        <div className="mt-6 space-y-3">
          {currentQuestion?.options?.map((option, index) => {
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
                  <span className="font-medium">
                    <span className="mr-2 text-[var(--text-muted)]">{index + 1}.</span>
                    {option}
                  </span>
                  {isAnswered && index === currentQuestion.correctIndex && <Check className="text-[var(--success)]" size={18} />}
                  {isAnswered && index === selectedOption && index !== currentQuestion.correctIndex && (
                    <X className="text-[var(--danger)]" size={18} />
                  )}
                </div>
              </Motion.button>
            );
          })}
        </div>

        {isAnswered && currentQuestion?.explanation && (
          <Motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl bg-[var(--bg-elevated)] p-4">
            <p className="text-sm leading-7 text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">Explanation:</span> {currentQuestion.explanation}
            </p>
          </Motion.div>
        )}
      </Motion.div>

      {isAnswered && (
        <Motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
          <Motion.button
            onClick={nextQuestion}
            className="primary-button w-full justify-center px-6 sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentIndex < shuffledQuestions.length - 1 ? 'Next question' : 'See results'}
            <ArrowRight size={18} />
          </Motion.button>
        </Motion.div>
      )}
    </div>
  );
};

export default Quiz;
