import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { useStudy } from '../context/StudyContext';
import { ChevronLeft, ChevronRight, RotateCw, Shuffle, Smile, Meh, Frown, Star, CheckCircle, Pencil, RefreshCw, Quote } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'react-hot-toast';
import { getDueSummary, recordStudySession, reviewFlashcard } from '../services/api';
import { readJSONStorage, writeJSONStorage } from '../utils/storage';
import SessionSummary from './SessionSummary';
import Button from './ui/Button';

const Flashcard = ({ cards, deckId = null, isDemoMode = false }) => {
  const { updateFlashcardInDeck, regenerateFlashcard } = useStudy();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [shuffledCards, setShuffledCards] = useState(cards);
  const [isShuffled, setIsShuffled] = useState(false);
  const [dueTomorrow, setDueTomorrow] = useState(null);
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, easy: 0, hard: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState({ question: '', answer: '', explanation: '' });
  const [regenerating, setRegenerating] = useState(false);
  const [useSimpleFlip, setUseSimpleFlip] = useState(false);
  const [sessionDurationMs, setSessionDurationMs] = useState(0);
  const [sessionStartTime] = useState(() => Date.now());
  const startTimeRef = useRef(sessionStartTime);
  const sessionRecordedRef = useRef(false);
  const resolvedDeckId = deckId || cards[0]?.deckId || null;

  const [favorites, setFavorites] = useState(() => {
    const saved = readJSONStorage('flashcard_favorites', []);
    return Array.isArray(saved) ? new Set(saved) : new Set();
  });

  const { addXP, updateStreak } = useGamification();
  const currentCard = shuffledCards[currentIndex];

  useEffect(() => {
    setShuffledCards(cards);
  }, [cards]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setUseSimpleFlip(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (currentCard) {
      setEditDraft({
        question: currentCard.question || '',
        answer: currentCard.answer || '',
        explanation: currentCard.explanation || '',
      });
      setIsEditing(false);
    }
  }, [currentCard?.id, currentIndex]);

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

  const recordSession = useCallback(async (reviewedCount) => {
    if (sessionRecordedRef.current) return;
    sessionRecordedRef.current = true;

    const durationSeconds = Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000));

    try {
      if (!isDemoMode) {
        await recordStudySession({
          deckId: resolvedDeckId,
          mode: 'flashcard',
          durationSeconds,
          cardsReviewed: reviewedCount,
          correctCount: 0,
          xpEarned: reviewedCount * 5,
        });
      }
    } catch (err) {
      console.error('Failed to record session:', err);
    }

    if (!isDemoMode) {
      try {
        const due = await getDueSummary();
        setDueTomorrow(due.dueTomorrow ?? 0);
      } catch {
        setDueTomorrow(0);
      }
    }
  }, [resolvedDeckId, isDemoMode]);

  const nextCard = useCallback(() => {
    if (currentIndex < shuffledCards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionDurationMs(Date.now() - startTimeRef.current);
      setIsCompleted(true);
      recordSession(shuffledCards.length);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [currentIndex, shuffledCards.length, recordSession]);

  const handleReview = useCallback(async (rating) => {
    if (currentCard?.id && !isDemoMode) {
      try {
        await reviewFlashcard(currentCard.id, rating);
      } catch (err) {
        console.error('Failed to save review:', err);
      }
    }

    const xpMap = { 1: 1, 2: 3, 3: 5, 4: 8 };
    addXP(xpMap[rating] || 5);
    updateStreak();

    setSessionStats((prev) => ({
      reviewed: prev.reviewed + 1,
      easy: prev.easy + (rating >= 3 ? 1 : 0),
      hard: prev.hard + (rating === 1 ? 1 : 0),
    }));

    nextCard();
  }, [currentCard, addXP, updateStreak, nextCard, isDemoMode]);

  const handleSaveEdit = async () => {
    if (!currentCard?.id) return;

    const result = await updateFlashcardInDeck(currentCard.id, {
      front: editDraft.question,
      back: editDraft.answer,
      explanation: editDraft.explanation,
    });

    if (result.ok) {
      setShuffledCards((prev) => prev.map((card) => (
        card.id === currentCard.id
          ? { ...card, question: editDraft.question, answer: editDraft.answer, explanation: editDraft.explanation }
          : card
      )));
      setIsEditing(false);
      toast.success('Card updated.');
    } else {
      toast.error(result.error || 'Could not save changes.');
    }
  };

  const handleRegenerate = async () => {
    if (!currentCard?.id || regenerating) return;

    setRegenerating(true);
    const result = await regenerateFlashcard(currentCard.id, 'This card felt inaccurate or unclear.');
    if (result.ok && result.card) {
      setShuffledCards((prev) => prev.map((card) => (
        card.id === currentCard.id ? { ...card, ...result.card } : card
      )));
      setIsFlipped(false);
    }
    setRegenerating(false);
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const shuffleCards = () => {
    setShuffledCards([...cards].sort(() => Math.random() - 0.5));
    setIsShuffled(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    sessionRecordedRef.current = false;
    startTimeRef.current = Date.now();
  };

  const resetOrder = () => {
    setShuffledCards(cards);
    setIsShuffled(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    sessionRecordedRef.current = false;
    startTimeRef.current = Date.now();
  };

  const restart = () => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ reviewed: 0, easy: 0, hard: 0 });
    setSessionDurationMs(0);
    sessionRecordedRef.current = false;
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isCompleted) return;
      const target = event.target;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;

      if (event.code === 'Space') {
        event.preventDefault();
        setIsFlipped((prev) => !prev);
        return;
      }

      if (isFlipped) {
        if (event.key >= '1' && event.key <= '4') {
          event.preventDefault();
          handleReview(Number(event.key));
        }
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextCard();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCompleted, isFlipped, handleReview, nextCard]);

  if (isCompleted) {
    const durationMinutes = Math.max(1, Math.round(sessionDurationMs / 60000));
    const cardsPerMin = (shuffledCards.length / durationMinutes).toFixed(1);

    return (
      <SessionSummary
        title="Deck complete"
        subtitle={`You reviewed all ${shuffledCards.length} flashcards.`}
        stats={[
          { label: 'Cards reviewed', value: shuffledCards.length },
          { label: 'Marked easy', value: sessionStats.easy },
          { label: 'Marked hard', value: sessionStats.hard },
          { label: 'Pace', value: `${cardsPerMin}/min` },
        ]}
        dueTomorrow={dueTomorrow}
        onRestart={restart}
        restartLabel="Review again"
      />
    );
  }

  const ratingButtons = [
    { rating: 1, icon: Frown, label: 'Hard', color: 'var(--danger)', key: '1' },
    { rating: 2, icon: Meh, label: 'Okay', color: 'var(--warm)', key: '2' },
    { rating: 3, icon: Smile, label: 'Good', color: 'var(--success)', key: '3' },
    { rating: 4, icon: CheckCircle, label: 'Easy', color: 'var(--accent)', key: '4' },
  ];

  return (
    <div className={`study-session mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center space-y-4 sm:space-y-6 ${isFlipped ? 'study-session--rated' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Motion.button
          onClick={isShuffled ? resetOrder : shuffleCards}
          className="secondary-button px-4 py-2 text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Shuffle size={16} />
          {isShuffled ? 'Reset order' : 'Shuffle'}
        </Motion.button>
        <div className="flex items-center gap-3">
          <div className="info-chip font-mono">
            {currentIndex + 1} / {shuffledCards.length}
          </div>
          <div className="text-xs text-[var(--text-muted)] sm:hidden">
            Tap card to flip
          </div>
        </div>
      </div>

      <div className="relative min-h-[18rem] flex-1 sm:min-h-[22rem] sm:h-[26rem] md:flex-none lg:h-[28rem]">
        {useSimpleFlip ? (
          <div className="flashcard-simple h-full">
            {!isFlipped ? (
              <div
                role="button"
                tabIndex={0}
                className="flashcard-simple__panel h-full w-full text-left"
                onClick={() => setIsFlipped(true)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setIsFlipped(true);
                  }
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flashcard-simple__label">
                    Card {currentIndex + 1} of {shuffledCards.length}
                  </span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFavorite();
                    }}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--text-muted)]"
                    aria-label="Favorite card"
                  >
                    <Star size={18} className={favorites.has(currentCard?.question) ? 'fill-[var(--warm)] text-[var(--warm)]' : ''} />
                  </button>
                </div>

                <div className="flashcard-simple__question">
                  {isEditing ? (
                    <div className="w-full space-y-3" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        value={editDraft.question}
                        onChange={(e) => setEditDraft((prev) => ({ ...prev, question: e.target.value }))}
                        className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-3 text-sm"
                        rows={3}
                      />
                      <textarea
                        value={editDraft.answer}
                        onChange={(e) => setEditDraft((prev) => ({ ...prev, answer: e.target.value }))}
                        className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-3 text-sm"
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <h3 data-testid="flashcard-question" className="font-heading text-xl font-bold leading-8 text-[var(--text-primary)]">
                      {currentCard?.question}
                    </h3>
                  )}
                </div>

                <div className="flashcard-simple__meta flex items-center justify-between gap-2">
                  <span>{isEditing ? 'Editing card' : 'Tap to reveal answer'}</span>
                  {currentCard?.id && !isEditing && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                      className="inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-[var(--accent)]"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flashcard-simple__panel h-full">
                <span className="flashcard-simple__label">Answer</span>
                <div className="flashcard-simple__question">
                  <p className="text-base leading-7 text-[var(--text-primary)] sm:text-lg sm:leading-9">{currentCard?.answer}</p>
                </div>

                {(currentCard?.sourceExcerpt || currentCard?.sourceSection) && (
                  <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]">
                      <Quote size={12} />
                      {currentCard.sourceSection ? `From ${currentCard.sourceSection}` : 'From your notes'}
                    </div>
                    {currentCard.sourceExcerpt && (
                      <p className="mt-1 line-clamp-2 text-xs italic leading-5 text-[var(--text-secondary)]">
                        “{currentCard.sourceExcerpt}”
                      </p>
                    )}
                  </div>
                )}

                <div className="flashcard-simple__meta flex items-center justify-between gap-2">
                  <span>Rate how well you knew it</span>
                  {currentCard?.id && (
                    <button
                      type="button"
                      onClick={handleRegenerate}
                      disabled={regenerating}
                      className="inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-[var(--warm)] disabled:opacity-50"
                    >
                      <RefreshCw size={14} className={regenerating ? 'animate-spin' : ''} />
                      {regenerating ? 'Remaking…' : 'Remake'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
        <Motion.div className="perspective-1000 h-full w-full cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
          <Motion.div
            className="flashcard-flipper relative h-full w-full"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flashcard-face backface-hidden absolute flex h-full w-full flex-col justify-between rounded-[var(--radius-xl)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow-soft)] sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-[var(--text-muted)]">Question</div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavorite();
                  }}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--text-muted)] transition-mindflow hover:bg-[var(--bg-elevated)]"
                >
                  <Star size={18} className={favorites.has(currentCard?.question) ? 'fill-[var(--warm)] text-[var(--warm)]' : ''} />
                </button>
              </div>

              <div className="flex flex-1 items-center justify-center text-center">
                {isEditing ? (
                  <div className="w-full space-y-3 text-left" onClick={(e) => e.stopPropagation()}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Question</label>
                    <textarea
                      value={editDraft.question}
                      onChange={(e) => setEditDraft((prev) => ({ ...prev, question: e.target.value }))}
                      className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-3 text-sm"
                      rows={3}
                    />
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Answer</label>
                    <textarea
                      value={editDraft.answer}
                      onChange={(e) => setEditDraft((prev) => ({ ...prev, answer: e.target.value }))}
                      className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-3 text-sm"
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <h3 data-testid="flashcard-question" className="font-heading text-xl font-bold leading-8 text-[var(--text-primary)] sm:text-2xl sm:leading-10 md:text-3xl">
                    {currentCard?.question}
                  </h3>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
                <span>{isEditing ? 'Editing card' : 'Tap or press Space to flip'}</span>
                {currentCard?.id && !isEditing && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setIsEditing(true); setIsFlipped(false); }}
                    className="inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-[var(--accent)]"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                )}
              </div>
            </div>

            <div
              className="flashcard-face backface-hidden absolute flex h-full w-full flex-col justify-between rounded-[var(--radius-xl)] border border-[var(--border-strong)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-soft)] sm:p-8"
              style={{ transform: 'rotateY(180deg) translateZ(1px)' }}
            >
              <div className="text-sm font-medium text-[var(--text-muted)]">Answer</div>
              <div className="flex flex-1 items-center justify-center text-center">
                <p className="text-base leading-7 text-[var(--text-primary)] sm:text-lg sm:leading-9">{currentCard?.answer}</p>
              </div>

              {(currentCard?.sourceExcerpt || currentCard?.sourceSection) && (
                <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-left">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]">
                    <Quote size={12} />
                    {currentCard.sourceSection ? `From ${currentCard.sourceSection}` : 'From your notes'}
                  </div>
                  {currentCard.sourceExcerpt && (
                    <p className="mt-1 text-xs italic leading-6 text-[var(--text-secondary)]">
                      “{currentCard.sourceExcerpt}”
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--text-muted)]">
                <span>Rate how well you knew it (1–4)</span>
                {currentCard?.id && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRegenerate(); }}
                    disabled={regenerating}
                    className="inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-[var(--warm)] disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={regenerating ? 'animate-spin' : ''} />
                    {regenerating ? 'Remaking…' : 'Remake card'}
                  </button>
                )}
              </div>
            </div>
          </Motion.div>
        </Motion.div>
        )}
      </div>

      {isFlipped && (
        <>
          <Motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden grid-cols-2 gap-3 sm:grid sm:grid-cols-4"
          >
            {ratingButtons.map(({ rating, icon: Icon, label, color, key }) => (
              <Motion.button
                key={rating}
                onClick={() => handleReview(rating)}
                className="glass-card flex min-h-[64px] flex-col items-center justify-center gap-2 px-3 py-4"
                style={{ borderColor: `${color}30` }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={20} style={{ color }} />
                <span className="text-sm font-medium" style={{ color }}>{label}</span>
                <span className="text-[10px] text-[var(--text-muted)]">({key})</span>
              </Motion.button>
            ))}
          </Motion.div>

          <div className="study-thumb-dock fixed inset-x-0 z-20 hidden border-t border-[var(--border)] bg-[rgba(255,255,255,0.96)] px-3 py-3 backdrop-blur-xl max-sm:block">
            <div className="mx-auto grid max-w-lg grid-cols-4 gap-2">
              {ratingButtons.map(({ rating, icon: Icon, label, color }) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleReview(rating)}
                  className="flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] active:scale-95"
                >
                  <Icon size={18} style={{ color }} />
                  <span className="text-[10px] font-semibold" style={{ color }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex justify-center gap-3 sm:hidden">
        <button
          type="button"
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="study-nav-control"
          aria-label="Previous card"
        >
          <ChevronLeft size={22} strokeWidth={2.25} />
        </button>
        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="primary-button h-12 min-w-[7rem] px-4"
        >
          {isFlipped ? 'Question' : 'Flip'}
        </button>
        <button
          type="button"
          onClick={nextCard}
          disabled={currentIndex === shuffledCards.length - 1}
          className="study-nav-control"
          aria-label="Next card"
        >
          <ChevronRight size={22} strokeWidth={2.25} />
        </button>
      </div>

      <div className="hidden flex-wrap justify-center gap-3 sm:flex">
        <Motion.button
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="secondary-button h-12 w-12 p-0 disabled:cursor-not-allowed disabled:opacity-50"
          whileHover={currentIndex !== 0 ? { scale: 1.05 } : {}}
          whileTap={currentIndex !== 0 ? { scale: 0.95 } : {}}
        >
          <ChevronLeft size={20} />
        </Motion.button>
        <Motion.button
          onClick={() => setIsFlipped(!isFlipped)}
          className="primary-button h-12 w-12 p-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCw size={20} />
        </Motion.button>
        <Motion.button
          onClick={nextCard}
          className="secondary-button h-12 w-12 p-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} />
        </Motion.button>
      </div>
    </div>
  );
};

export default Flashcard;
