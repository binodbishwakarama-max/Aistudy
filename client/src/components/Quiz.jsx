import React, { useState, useEffect, useRef } from 'react';
import { useGamification } from '../context/GamificationContext';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, RefreshCw, Trophy, Shuffle, Clock } from 'lucide-react';
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
  const startTimeRef = useRef(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionTimes, setQuestionTimes] = useState([]);

  const currentQuestion = shuffledQuestions[currentIndex];
  const { addXP, updateStreak } = useGamification();

  useEffect(() => {
    startTimeRef.current = Date.now();
    setElapsedSeconds(0);
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);

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
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setQuestionTimes([...questionTimes, timeTaken]);
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) addXP(10);
    else addXP(2);

    try {
      const stats = JSON.parse(localStorage.getItem('quiz_stats') || '{}');
      stats.totalQuestions = (stats.totalQuestions || 0) + 1;
      stats.correctAnswers = (stats.correctAnswers || 0) + (isCorrect ? 1 : 0);
      stats.totalTimeSpent = (stats.totalTimeSpent || 0) + timeTaken;
      localStorage.setItem('quiz_stats', JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const isLastCorrect = selectedOption === currentQuestion?.correctIndex;
      const total = isLastCorrect ? score + 1 : score;
      setResultScore(total);
      setTimeSpent(questionTimes.reduce((a, b) => a + b, 0));
      setShowResults(true);
      updateStreak();
      addXP(50);
      if (total / shuffledQuestions.length >= 0.7) {
        addXP(100);
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      }
    }
  };

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

  if (showResults) {
    const displayScore = resultScore ?? score;
    const percentage = Math.round((displayScore / shuffledQuestions.length) * 100);
    const avgTime = Math.floor(
      questionTimes.length ? questionTimes.reduce((a, b) => a + b, 0) / shuffledQuestions.length : 0
    );
    const totalTime = questionTimes.reduce((a, b) => a + b, 0);

    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md mx-auto glass-card rounded-2xl overflow-hidden text-center p-8"
      >
        <div className="w-16 h-16 bg-[var(--warm)]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--warm)]/30">
          <Trophy size={32} className="text-[var(--warm)]" />
        </div>
        <h2 className="font-heading text-3xl font-bold text-[var(--text-primary)] mb-2">Quiz Completed!</h2>
        <div className="font-mono text-6xl font-black text-[var(--accent-light)] mb-4">{percentage}%</div>
        <p className="text-[var(--text-secondary)] mb-4">
          You answered {displayScore} out of {shuffledQuestions.length} questions correctly.
        </p>

        <div className="glass-card rounded-xl p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Total Time:</span>
            <span className="font-mono font-bold text-[var(--text-primary)]">
              {Math.floor(totalTime / 60)}m {totalTime % 60}s
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Avg per Question:</span>
            <span className="font-mono font-bold text-[var(--text-primary)]">{avgTime}s</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Accuracy:</span>
            <span
              className="font-mono font-bold"
              style={{ color: percentage >= 70 ? 'var(--success)' : 'var(--danger)' }}
            >
              {percentage}%
            </span>
          </div>
        </div>

        <button
          onClick={restartQuiz}
          className="w-full py-3 bg-[var(--accent)] text-white rounded-xl font-bold hover:bg-[var(--accent-light)] transition-mindflow flex items-center justify-center gap-2 glow-shadow"
        >
          <RefreshCw size={18} /> Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={isShuffled ? resetOrder : shuffleQuestions}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-mindflow ${
            isShuffled
              ? 'bg-[var(--accent)]/20 text-[var(--accent-light)] border border-[var(--border-accent)]'
              : 'glass-card text-[var(--text-secondary)] hover:border-[var(--border-accent)]'
          }`}
        >
          <Shuffle size={16} />
          {isShuffled ? 'Reset' : 'Shuffle'}
        </button>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-[var(--text-secondary)]">
            Question {currentIndex + 1} / {shuffledQuestions.length}
          </span>
          <div className="flex items-center gap-1 text-sm text-[var(--text-muted)]">
            <Clock size={16} />
            <span className="font-mono">{elapsedSeconds}s</span>
          </div>
        </div>
      </div>

      <div className="w-full h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / shuffledQuestions.length) * 100}%` }}
        />
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card rounded-2xl p-8"
      >
        <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-6 leading-relaxed">
          {currentQuestion?.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion?.options?.map((option, index) => {
            let stateStyles = 'border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5';
            if (isAnswered) {
              if (index === currentQuestion.correctIndex)
                stateStyles = 'border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]';
              else if (index === selectedOption)
                stateStyles = 'border-[var(--danger)] bg-[var(--danger)]/10 text-[var(--danger)]';
              else stateStyles = 'border-[var(--border)] opacity-40';
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-mindflow font-medium ${stateStyles} ${
                  !isAnswered ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && index === currentQuestion.correctIndex && <Check className="text-[var(--success)]" size={20} />}
                  {isAnswered && index === selectedOption && index !== currentQuestion.correctIndex && (
                    <X className="text-[var(--danger)]" size={20} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && currentQuestion?.explanation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t border-[var(--border)]"
          >
            <p className="text-[var(--text-secondary)] text-sm">
              <span className="font-semibold text-[var(--text-primary)]">Explanation:</span> {currentQuestion.explanation}
            </p>
          </motion.div>
        )}
      </motion.div>

      {isAnswered && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
          <button
            onClick={nextQuestion}
            className="flex items-center gap-2 px-8 py-3 bg-[var(--accent)] text-white rounded-xl hover:bg-[var(--accent-light)] font-bold transition-mindflow glow-shadow"
          >
            {currentIndex < shuffledQuestions.length - 1 ? 'Next Question' : 'See Results'}
            <ArrowRight size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Quiz;
