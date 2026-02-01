import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, RefreshCw, Trophy, Shuffle, Clock, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportToPDF } from '../utils/exportUtils';

const Quiz = ({ questions }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [shuffledQuestions, setShuffledQuestions] = useState(questions);
    const [isShuffled, setIsShuffled] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());
    const [timeSpent, setTimeSpent] = useState(0);
    const [questionTimes, setQuestionTimes] = useState([]);

    const currentQuestion = shuffledQuestions[currentIndex];

    useEffect(() => {
        setStartTime(Date.now());
    }, [currentIndex]);

    const shuffleQuestions = () => {
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        setShuffledQuestions(shuffled);
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

        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        setQuestionTimes([...questionTimes, timeTaken]);

        setSelectedOption(index);
        setIsAnswered(true);

        const isCorrect = index === currentQuestion.correctIndex;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        // Save statistics to localStorage
        const stats = JSON.parse(localStorage.getItem('quiz_stats') || '{}');
        stats.totalQuestions = (stats.totalQuestions || 0) + 1;
        stats.correctAnswers = (stats.correctAnswers || 0) + (isCorrect ? 1 : 0);
        stats.totalTimeSpent = (stats.totalTimeSpent || 0) + timeTaken;
        localStorage.setItem('quiz_stats', JSON.stringify(stats));
    };

    const nextQuestion = () => {
        if (currentIndex < shuffledQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            const totalTime = questionTimes.reduce((a, b) => a + b, 0);
            setTimeSpent(totalTime);
            setShowResults(true);

            if (score / shuffledQuestions.length >= 0.7) {
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 }
                });
            }
        }
    };

    const restartQuiz = () => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
        setQuestionTimes([]);
        setStartTime(Date.now());
    };

    if (showResults) {
        const percentage = Math.round((score / shuffledQuestions.length) * 100);
        const avgTime = Math.floor(timeSpent / shuffledQuestions.length);

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
                <p className="text-gray-600 mb-4">You answered {score} out of {shuffledQuestions.length} questions correctly.</p>

                <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Time:</span>
                        <span className="font-bold text-gray-900">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Avg per Question:</span>
                        <span className="font-bold text-gray-900">{avgTime}s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Accuracy:</span>
                        <span className={`font-bold ${percentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                            {percentage}%
                        </span>
                    </div>
                </div>

                <button
                    onClick={restartQuiz}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                    <RefreshCw size={20} /> Try Again
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Controls Bar */}
            <div className="flex justify-between items-center">
                <button
                    onClick={isShuffled ? resetOrder : shuffleQuestions}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${isShuffled
                        ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    <Shuffle size={18} />
                    {isShuffled ? 'Reset Order' : 'Shuffle'}
                </button>
                <button
                    onClick={() => exportToPDF(questions, 'quiz')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-indigo-600 transition ml-2 mr-auto"
                    title="Download Quiz as PDF"
                >
                    <Download size={18} />
                    Export PDF
                </button>
                <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-gray-600">
                        Question {currentIndex + 1} / {shuffledQuestions.length}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock size={16} />
                        <span>{Math.floor((Date.now() - startTime) / 1000)}s</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / shuffledQuestions.length) * 100}%` }}
                />
            </div>

            {/* Question Card */}
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8"
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
                            <button
                                key={index}
                                onClick={() => handleOptionClick(index)}
                                disabled={isAnswered}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${stateStyles} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{option}</span>
                                    {isAnswered && index === currentQuestion.correctIndex && (
                                        <Check className="text-green-600" size={20} />
                                    )}
                                    {isAnswered && index === selectedOption && index !== currentQuestion.correctIndex && (
                                        <X className="text-red-600" size={20} />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {isAnswered && currentQuestion.explanation && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 pt-6 border-t border-gray-200"
                    >
                        <p className="text-gray-700 text-sm">
                            <span className="font-bold text-gray-900">Explanation:</span> {currentQuestion.explanation}
                        </p>
                    </motion.div>
                )}
            </motion.div>

            {/* Next Button */}
            {isAnswered && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                >
                    <button
                        onClick={nextQuestion}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-200"
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
