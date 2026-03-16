import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { ChevronLeft, ChevronRight, RotateCw, RefreshCw, CheckCircle, Shuffle, Star, Smile, Meh, Frown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { reviewFlashcard } from '../services/api';

const Flashcard = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [shuffledCards, setShuffledCards] = useState(cards);
  const [isShuffled, setIsShuffled] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('flashcard_favorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const { addXP, updateStreak } = useGamification();
  const currentCard = shuffledCards[currentIndex];

  const saveFavorites = (newFavorites) => {
    localStorage.setItem('flashcard_favorites', JSON.stringify([...newFavorites]));
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
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md mx-auto glass-card rounded-2xl overflow-hidden text-center p-8"
      >
        <div className="w-16 h-16 bg-[var(--success)]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--success)]/30">
          <CheckCircle size={32} className="text-[var(--success)]" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-2">Well Done!</h2>
        <p className="text-[var(--text-secondary)] mb-8 font-medium">
          You&apos;ve reviewed all {shuffledCards.length} flashcards.
        </p>
        <button
          onClick={restart}
          className="w-full py-3 bg-[var(--accent)] text-white rounded-xl font-bold hover:bg-[var(--accent-light)] transition-mindflow flex items-center justify-center gap-2 glow-shadow"
        >
          <RefreshCw size={18} /> Review Again
        </button>
      </motion.div>
    );
  }

  const ratingButtons = [
    { rating: 1, icon: Frown, label: 'Hard', color: 'var(--danger)' },
    { rating: 2, icon: Meh, label: 'Okay', color: 'var(--warm)' },
    { rating: 3, icon: Smile, label: 'Good', color: 'var(--success)' },
    { rating: 4, icon: CheckCircle, label: 'Easy', color: 'var(--accent)' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={isShuffled ? resetOrder : shuffleCards}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-mindflow ${
            isShuffled
              ? 'bg-[var(--accent)]/20 text-[var(--accent-light)] border border-[var(--border-accent)]'
              : 'glass-card text-[var(--text-secondary)] hover:border-[var(--border-accent)]'
          }`}
        >
          <Shuffle size={16} />
          {isShuffled ? 'Reset' : 'Shuffle'}
        </button>
        <span className="font-mono text-sm text-[var(--text-secondary)]">
          {currentIndex + 1} / {shuffledCards.length}
        </span>
      </div>

      <div className="relative h-96">
        <motion.div
          className="w-full h-full cursor-pointer perspective-1000"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <motion.div
            className="relative w-full h-full"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute w-full h-full backface-hidden glass-card rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-[var(--border-accent)] transition-mindflow">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite();
                }}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] transition-mindflow"
              >
                <Star
                  size={20}
                  className={favorites.has(currentCard?.question) ? 'fill-[var(--warm)] text-[var(--warm)]' : ''}
                />
              </button>
              <span className="text-[var(--text-muted)] text-xs font-mono uppercase tracking-wider mb-6">Question</span>
              <h3 className="font-heading text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-snug">
                {currentCard?.question}
              </h3>
            </div>

            <div
              className="absolute w-full h-full backface-hidden bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)] flex flex-col items-center justify-center p-8 text-center cursor-pointer"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <span className="text-[var(--text-muted)] text-xs font-mono uppercase tracking-wider mb-6">Answer</span>
              <p className="text-lg text-[var(--text-primary)] leading-relaxed font-medium">{currentCard?.answer}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-3 mt-8"
        >
          {ratingButtons.map(({ rating, icon: Icon, label, color }) => (
            <button
              key={rating}
              onClick={() => handleReview(rating)}
              className="flex flex-col items-center justify-center py-3 px-2 glass-card rounded-xl hover:border-[var(--border-accent)] transition-mindflow"
              style={{ borderColor: `${color}40` }}
            >
              <Icon size={20} className="mb-1" style={{ color }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
                {label}
              </span>
            </button>
          ))}
        </motion.div>
      )}

      <div className="flex justify-center gap-4">
        <button
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="p-4 rounded-xl glass-card text-[var(--text-primary)] hover:border-[var(--border-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-mindflow"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="p-4 rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-light)] transition-mindflow glow-shadow"
        >
          <RotateCw size={24} />
        </button>
        <button
          onClick={nextCard}
          className="p-4 rounded-xl glass-card text-[var(--text-primary)] hover:border-[var(--border-accent)] transition-mindflow"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
