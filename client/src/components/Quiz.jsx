import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

import confetti from 'canvas-confetti';

const Quiz = ({ questions }) => {
    // ... existing state ...
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const { updateStats } = useStudy();

    const currentQuestion = questions[currentIndex];

    const handleOptionClick = (index) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);

        const isCorrect = index === currentQuestion.correctIndex;
        if (isCorrect) {
            setScore(prev => prev + 1);
            updateStats({ correctAnswers: (prev) => (prev || 0) + 1 });
        }
        updateStats({ questionsAnswered: (prev) => (prev || 0) + 1 });
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
        }
    };

    const restartQuiz = () => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
    };

    if (showResults) {
        const percentage = Math.round((score / questions.length) * 100);

        if (percentage >= 50) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden text-center p-8 border border-indigo-50"
            >
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
                    <Trophy size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                <div className="text-6xl font-black text-indigo-600 mb-4">{percentage}%</div>
                <p className="text-gray-500 mb-8">You answered {score} out of {questions.length} questions correctly.</p>

                <button
                    onClick={restartQuiz}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                    <RefreshCw size={20} /> Restart Quiz
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Question {currentIndex + 1}/{questions.length}</span>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Score: {score}</span>
            </div>

            <motion.div
                key={currentIndex}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-6"
            >
                <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">{currentQuestion.question}</h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        let stateStyles = "border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50";
                        if (isAnswered) {
                            if (index === currentQuestion.correctIndex) {
                                stateStyles = "border-green-500 bg-green-50 text-green-800";
                            } else if (index === selectedOption) {
                                stateStyles = "border-red-500 bg-red-50 text-red-800";
                            } else {
                                stateStyles = "border-gray-100 opacity-50";
                            }
                        }

                        return (
                            <motion.button
                                key={index}
                                disabled={isAnswered}
                                onClick={() => handleOptionClick(index)}
                                whileHover={!isAnswered ? { scale: 1.02 } : {}}
                                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                animate={isAnswered && index === selectedOption && index !== currentQuestion.correctIndex ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                                transition={{ duration: 0.4 }}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center ${stateStyles}`}
                            >
                                <span>{option}</span>
                                {isAnswered && index === currentQuestion.correctIndex && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                        <Check size={20} className="text-green-600" />
                                    </motion.div>
                                )}
                                {isAnswered && index === selectedOption && index !== currentQuestion.correctIndex && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                        <X size={20} className="text-red-600" />
                                    </motion.div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 pt-6 border-t border-gray-100"
                    >
                        <p className="text-gray-600 text-sm">
                            <span className="font-bold text-gray-900">Explanation:</span> {currentQuestion.explanation}
                        </p>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={nextQuestion}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-bold"
                            >
                                {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'} <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default Quiz;

