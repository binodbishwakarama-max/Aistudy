import React from 'react';
import { FileText } from 'lucide-react';

const ReviewSheet = ({ flashcards }) => {
    if (!flashcards || flashcards.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-3xl border border-gray-200">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No content to review</h3>
                <p className="text-gray-600">Generate flashcards first to see your cheat sheet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mb-6">
                <h3 className="text-indigo-900 font-bold text-lg mb-2 flex items-center gap-2">
                    <FileText size={20} />
                    Quick Review Cheat Sheet
                </h3>
                <p className="text-indigo-700">
                    Review all key points at a glance before starting your quiz or flashcards.
                </p>
            </div>

            <div className="grid gap-3">
                {flashcards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex gap-4 items-start">
                            <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                            </span>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-base mb-2">{card.question}</h4>
                                <div className="text-gray-700 leading-relaxed pl-4 border-l-2 border-indigo-200">
                                    {card.answer}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewSheet;
