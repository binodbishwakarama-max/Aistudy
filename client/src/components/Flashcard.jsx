import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { ChevronLeft, ChevronRight, CheckCircle, RefreshCw, RotateCw, Shuffle, Smile, Meh, Frown, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { reviewFlashcard } from '../services/api';
import { readJSONStorage, writeJSONStorage } from '../utils/storage';

const Flashcard = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [shuffledCards, setShuffledCards] = useState(cards);
  const [isShuffled, setIsShuffled] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = readJSONStorage('flashcard_favorites', []);
    return Array.isArray(saved) ? new Set(saved) : new Set();
  });

  const { addXP, updateStreak } = useGamification();
  const currentCard = shuffledCards[currentIndex];

  const saveFavorites = (newFavorites) => {
    writeJSONStorage('flashcard_favorites', [...newFavorites]);
  };

  const toggleFavorite = () => {
    const cardId = currentCard.question;
    const newFavorites = new Set(favorites);
    if (newFavorites.has(cardId)) newFavorites.delete(cardId);
    else newFavorites.add(cardId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const handleReview = async (rating) => {
    if (currentCard?.id) {
      try {
        await reviewFlashcard(currentCard.id, rating);
      } catch (err) {
        console.error('Failed to save review:', err);
      }
    }

    const xpMap = { 1: 1, 2: 3, 3: 5, 4: 8 };
    addXP(xpMap[rating] || 5);
    updateStreak();
    nextCard();
  };

  const shuffleCards = () => {
    setShuffledCards([...cards].sort(() => Math.random() - 0.5));
    setIsShuffled(true);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const resetOrder = () => {
    setShuffledCards(cards);
    setIsShuffled(false);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const restart = () => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (isCompleted) {
    return (
      <Motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto max-w-md text-center">
        <div className="section-shell p-6 sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(24,128,56,0.12)] text-[var(--success)]">
            <CheckCircle size={30} />
          </div>
          <h2 className="font-heading mt-6 text-2xl font-bold">Deck complete</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            You reviewed all {shuffledCards.length} flashcards.
          </p>
          <button onClick={restart} className="primary-button mt-8 w-full justify-center">
            <RefreshCw size={18} />
            Review again
          </button>
        </div>
      </Motion.div>
    );
  }

  const ratingButtons = [
    { rating: 1, icon: Frown, label: 'Hard', color: 'var(--danger)' },
    { rating: 2, icon: Meh, label: 'Okay', color: 'var(--warm)' },
    { rating: 3, icon: Smile, label: 'Good', color: 'var(--success)' },
    { rating: 4, icon: CheckCircle, label: 'Easy', color: 'var(--accent)' },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={isShuffled ? resetOrder : shuffleCards} className="secondary-button px-4 py-2 text-sm">
          <Shuffle size={16} />
          {isShuffled ? 'Reset order' : 'Shuffle'}
        </button>
        <div className="info-chip font-mono">
          {currentIndex + 1} / {shuffledCards.length}
        </div>
      </div>

      <div className="relative h-[22rem] sm:h-[26rem] lg:h-[28rem]">
        <Motion.div className="h-full w-full cursor-pointer perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
          <Motion.div
            className="relative h-full w-full"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.45 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute flex h-full w-full flex-col justify-between rounded-[28px] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-soft)] backface-hidden sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-[var(--text-muted)]">Question</div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavorite();
                  }}
                  className="rounded-full p-2 text-[var(--text-muted)] transition-mindflow hover:bg-[var(--bg-elevated)]"
                >
                  <Star size={18} className={favorites.has(currentCard?.question) ? 'fill-[var(--warm)] text-[var(--warm)]' : ''} />
                </button>
              </div>

              <div className="flex flex-1 items-center justify-center text-center">
                <h3 className="font-heading text-xl font-bold leading-8 text-[var(--text-primary)] sm:text-2xl sm:leading-10 md:text-3xl">
                  {currentCard?.question}
                </h3>
              </div>

              <div className="text-sm text-[var(--text-muted)]">Tap to flip</div>
            </div>

            <div
              className="absolute flex h-full w-full flex-col justify-between rounded-[28px] border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow-soft)] backface-hidden sm:p-8"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <div className="text-sm font-medium text-[var(--text-muted)]">Answer</div>
              <div className="flex flex-1 items-center justify-center text-center">
                <p className="text-base leading-7 text-[var(--text-primary)] sm:text-lg sm:leading-9">{currentCard?.answer}</p>
              </div>
              <div className="text-sm text-[var(--text-muted)]">Rate how well you knew it</div>
            </div>
          </Motion.div>
        </Motion.div>
      </div>

      {isFlipped && (
        <Motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ratingButtons.map(({ rating, icon: Icon, label, color }) => (
            <button
              key={rating}
              onClick={() => handleReview(rating)}
              className="glass-card flex flex-col items-center justify-center gap-2 px-3 py-4"
              style={{ borderColor: `${color}30` }}
            >
              <Icon size={20} style={{ color }} />
              <span className="text-sm font-medium" style={{ color }}>
                {label}
              </span>
            </button>
          ))}
        </Motion.div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="secondary-button h-12 w-12 p-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => setIsFlipped(!isFlipped)} className="primary-button h-12 w-12 p-0">
          <RotateCw size={20} />
        </button>
        <button onClick={nextCard} className="secondary-button h-12 w-12 p-0">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
