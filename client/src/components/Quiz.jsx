import React, { useEffect, useRef, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { ArrowRight, Check, Clock, RefreshCw, Shuffle, Trophy, X } from 'lucide-react';
import confetti from 'canvas-confetti';

const Quiz = ({ questions }) => {
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
  const startTimeRef = useRef(null);

  const currentQuestion = shuffledQuestions[currentIndex];
  const { addXP, updateStreak } = useGamification();

  useEffect(() => {
    startTimeRef.current = Date.now();
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setResultScore(null);
    setShowResults(false);
    setQuestionTimes([]);
    startTimeRef.current = Date.now();
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

  const handleOptionClick = (index) => {
    if (isAnswered) return;

    const timeTaken = elapsedSeconds;
    const isCorrect = index === currentQuestion.correctIndex;

    setQuestionTimes((prev) => [...prev, timeTaken]);
    setSelectedOption(index);
    setIsAnswered(true);
    if (isCorrect) {
      setScore((prev) => prev + 1);
      addXP(10);
    } else {
      addXP(2);
    }

    try {
      const stats = JSON.parse(localStorage.getItem('quiz_stats') || '{}');
      stats.totalQuestions = (stats.totalQuestions || 0) + 1;
      stats.correctAnswers = (stats.correctAnswers || 0) + (isCorrect ? 1 : 0);
      stats.totalTimeSpent = (stats.totalTimeSpent || 0) + timeTaken;
      localStorage.setItem('quiz_stats', JSON.stringify(stats));
    } catch (error) {
      console.error(error);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setElapsedSeconds(0);
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      return;
    }

    const finalScore = score;
    setResultScore(finalScore);
    setShowResults(true);
    updateStreak();
    addXP(50);
    if (finalScore / shuffledQuestions.length >= 0.7) {
      addXP(100);
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    }
  };

  if (showResults) {
    const displayScore = resultScore ?? score;
    const percentage = Math.round((displayScore / shuffledQuestions.length) * 100);
    const totalTime = questionTimes.reduce((sum, value) => sum + value, 0);
    const avgTime = Math.floor(questionTimes.length ? totalTime / shuffledQuestions.length : 0);

    return (
      <Motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto max-w-md">
        <div className="section-shell p-6 text-center sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--warm-soft)] text-[var(--warm)]">
            <Trophy size={30} />
          </div>
          <h2 className="font-heading mt-6 text-2xl font-bold sm:text-3xl">Quiz complete</h2>
          <div className="mt-4 text-5xl font-semibold tracking-tight text-[var(--accent)] sm:text-6xl">{percentage}%</div>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            You answered {displayScore} out of {shuffledQuestions.length} questions correctly.
          </p>

          <div className="mt-6 rounded-2xl bg-[var(--bg-elevated)] p-4 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Total time</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {Math.floor(totalTime / 60)}m {totalTime % 60}s
              </span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Average per question</span>
              <span className="font-semibold text-[var(--text-primary)]">{avgTime}s</span>
            </div>
          </div>

          <button onClick={restartQuiz} className="primary-button mt-8 w-full justify-center">
            <RefreshCw size={18} />
            Try again
          </button>
        </div>
      </Motion.div>
    );
  }

  const progress = ((currentIndex + 1) / shuffledQuestions.length) * 100;

  return (
    <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
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
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
        <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <Motion.div key={currentIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="section-shell p-5 sm:p-8">
        <h3 className="font-heading text-xl font-bold leading-8 text-[var(--text-primary)] sm:text-2xl sm:leading-10">
          {currentQuestion?.question}
        </h3>

        <div className="mt-6 space-y-3">
          {currentQuestion?.options?.map((option, index) => {
            let stateStyles = 'border-[var(--border)] bg-white text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]';

            if (isAnswered) {
              if (index === currentQuestion.correctIndex) {
                stateStyles = 'border-[rgba(24,128,56,0.3)] bg-[rgba(24,128,56,0.08)] text-[var(--success)]';
              } else if (index === selectedOption) {
                stateStyles = 'border-[rgba(217,48,37,0.3)] bg-[rgba(217,48,37,0.08)] text-[var(--danger)]';
              } else {
                stateStyles = 'border-[var(--border)] bg-white text-[var(--text-muted)] opacity-60';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isAnswered}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition-mindflow sm:py-4 ${stateStyles}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{option}</span>
                  {isAnswered && index === currentQuestion.correctIndex && <Check className="text-[var(--success)]" size={18} />}
                  {isAnswered && index === selectedOption && index !== currentQuestion.correctIndex && (
                    <X className="text-[var(--danger)]" size={18} />
                  )}
                </div>
              </button>
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
          <button onClick={nextQuestion} className="primary-button w-full justify-center px-6 sm:w-auto">
            {currentIndex < shuffledQuestions.length - 1 ? 'Next question' : 'See results'}
            <ArrowRight size={18} />
          </button>
        </Motion.div>
      )}
    </div>
  );
};

export default Quiz;
