import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw, Trophy, RefreshCw, CheckCircle, Shuffle, Star, Smile, Meh, Frown } from 'lucide-react';
import confetti from 'canvas-confetti';

const Flashcard = ({ cards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [shuffledCards, setShuffledCards] = useState(cards);
    const [isShuffled, setIsShuffled] = useState(false);
    const [favorites, setFavorites] = useState(new Set());
    const [difficulty, setDifficulty] = useState({});

    const currentCard = shuffledCards[currentIndex];

    useEffect(() => {
        const savedFavorites = localStorage.getItem('flashcard_favorites');
        const savedDifficulty = localStorage.getItem('flashcard_difficulty');
        if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)));
        if (savedDifficulty) setDifficulty(JSON.parse(savedDifficulty));
    }, []);

    const saveFavorites = (newFavorites) => {
        localStorage.setItem('flashcard_favorites', JSON.stringify([...newFavorites]));
    };

    const saveDifficulty = (newDifficulty) => {
        localStorage.setItem('flashcard_difficulty', JSON.stringify(newDifficulty));
    };

    const toggleFavorite = () => {
        const cardId = currentCard.question;
        const newFavorites = new Set(favorites);
        if (newFavorites.has(cardId)) {
            newFavorites.delete(cardId);
        } else {
            newFavorites.add(cardId);
        }
        setFavorites(newFavorites);
        saveFavorites(newFavorites);
    };

    const markDifficulty = (level) => {
        const cardId = currentCard.question;
        const newDifficulty = { ...difficulty, [cardId]: level };
        setDifficulty(newDifficulty);
        saveDifficulty(newDifficulty);
        nextCard();
    };

    const shuffleCards = () => {
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        setShuffledCards(shuffled);
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
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsCompleted(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
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
            setCurrentIndex(prev => prev - 1);
        }
    };

    if (isCompleted) {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden text-center p-8 border border-indigo-50"
            >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Well Done!</h2>
                <p className="text-gray-600 mb-8">You've reviewed all {shuffledCards.length} flashcards.</p>

                <button
                    onClick={restart}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                    <RefreshCw size={20} /> Review Again
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Controls Bar */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <button
                        onClick={isShuffled ? resetOrder : shuffleCards}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${isShuffled
                            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        title={isShuffled ? "Reset to original order" : "Shuffle cards"}
                    >
                        <Shuffle size={18} />
                        {isShuffled ? 'Reset Order' : 'Shuffle'}
                    </button>
                </div>
                <div className="text-sm font-medium text-gray-600">
                    {currentIndex + 1} / {shuffledCards.length}
                </div>
            </div>

            {/* Flashcard */}
            <div className="relative h-96">
                <motion.div
                    className="w-full h-full cursor-pointer perspective-1000"
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <motion.div
                        className="relative w-full h-full"
                        initial={false}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front */}
                        <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50 flex flex-col items-center justify-center p-8 text-center">
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
                            >
                                <Star
                                    size={24}
                                    className={favorites.has(currentCard.question) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
                                />
                            </button>
                            <span className="text-indigo-500 text-xs font-bold uppercase tracking-wider mb-6 bg-indigo-50 px-3 py-1 rounded-full">Question</span>
                            <h3 className="text-2xl font-bold text-gray-900 leading-snug">{currentCard.question}</h3>
                        </div>

                        {/* Back */}
                        <div
                            className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center"
                            style={{ transform: 'rotateY(180deg)' }}
                        >
                            <span className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-6 bg-white/20 px-3 py-1 rounded-full">Answer</span>
                            <p className="text-xl text-white leading-relaxed">{currentCard.answer}</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Difficulty Rating */}
            {isFlipped && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center gap-3"
                >
                    <button
                        onClick={() => markDifficulty('easy')}
                        className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition font-medium"
                    >
                        <Smile size={20} />
                        Easy
                    </button>
                    <button
                        onClick={() => markDifficulty('medium')}
                        className="flex items-center gap-2 px-6 py-3 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 transition font-medium"
                    >
                        <Meh size={20} />
                        Medium
                    </button>
                    <button
                        onClick={() => markDifficulty('hard')}
                        className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition font-medium"
                    >
                        <Frown size={20} />
                        Hard
                    </button>
                </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={prevCard}
                    disabled={currentIndex === 0}
                    className="p-4 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 hover:text-indigo-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="p-4 rounded-full bg-indigo-600 shadow-lg shadow-indigo-200 text-white hover:bg-indigo-700 hover:scale-110 transition-all"
                >
                    <RotateCw size={24} />
                </button>
                <button
                    onClick={nextCard}
                    className="p-4 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 hover:text-indigo-600 hover:shadow-md transition-all"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default Flashcard;
