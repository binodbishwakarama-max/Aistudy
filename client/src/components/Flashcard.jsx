import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

const Flashcard = ({ cards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentCard = cards[currentIndex];

    const nextCard = () => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
            <div className="w-full mb-4 flex justify-between text-gray-500 font-medium">
                <span>Card {currentIndex + 1} of {cards.length}</span>
                <span>{Math.round(((currentIndex + 1) / cards.length) * 100)}% Completed</span>
            </div>

            <div className="w-full aspect-[3/2] perspective-1000 group">
                <motion.div
                    className="w-full h-full relative preserve-3d cursor-pointer"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50 flex flex-col items-center justify-center p-8 text-center"
                        style={{ backfaceVisibility: 'hidden' }}>
                        <span className="text-indigo-500 text-xs font-bold uppercase tracking-wider mb-6 bg-indigo-50 px-3 py-1 rounded-full">Question</span>
                        <h3 className="text-2xl font-bold text-gray-800 leading-snug">{currentCard.question}</h3>
                        <div className="absolute bottom-6 text-gray-400 text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <RotateCw size={14} /> Click to flip
                        </div>
                    </div>

                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl shadow-xl shadow-indigo-200 flex flex-col items-center justify-center p-8 text-center text-white"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <span className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-6 bg-white/10 px-3 py-1 rounded-full">Answer</span>
                        <h3 className="text-xl font-medium leading-relaxed">{currentCard.answer}</h3>
                    </div>
                </motion.div>
            </div>

            <div className="flex items-center gap-6 mt-8">
                <button
                    onClick={prevCard}
                    disabled={currentIndex === 0}
                    className="p-4 rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 hover:text-indigo-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextCard}
                    disabled={currentIndex === cards.length - 1}
                    className="p-4 rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 hover:text-indigo-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default Flashcard;
