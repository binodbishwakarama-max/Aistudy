import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

const FileUpload = () => {
    const navigate = useNavigate();
    const { handleFileUpload, loading, text, error } = useStudy();
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState('');

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) processFile(files[0]);
    };

    const onFileSelect = (e) => {
        if (e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file) => {
        setFileName(file.name);
        handleFileUpload(file);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-xl shadow-indigo-100 overflow-hidden border border-indigo-50"
            >
                <div className="p-8 sm:p-12">
                    <div className="text-center mb-8">
                        <div className="inline-flex p-3 bg-indigo-50 rounded-2xl mb-4 text-indigo-600">
                            <Sparkles size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Start Your Study Session</h2>
                        <p className="text-gray-500">Upload your lecture notes or PDF to instantly generate flashcards and quizzes.</p>
                    </div>

                    <div
                        className={`relative border-3 border-dashed rounded-3xl p-10 transition-all duration-300 ease-in-out cursor-pointer group
              ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50'}
              ${loading ? 'pointer-events-none opacity-50' : ''}
              ${text ? 'border-green-400 bg-green-50' : ''}
            `}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.txt"
                            onChange={onFileSelect}
                        />

                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="flex flex-col items-center"
                                    >
                                        <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
                                        <p className="text-indigo-600 font-medium animate-pulse">Analyzing text...</p>
                                    </motion.div>
                                ) : text ? (
                                    <motion.div
                                        key="success"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200 mb-4">
                                            <CheckCircle size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">{fileName}</h3>
                                        <p className="text-green-600 font-medium">Ready for generation!</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="upload"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <Upload size={32} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            Click to upload or drag and drop
                                        </h3>
                                        <p className="text-gray-500 mt-2">PDF or TXT files (max 1GB)</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 p-4 mt-6 bg-red-50 text-red-700 rounded-xl border border-red-100"
                        >
                            <AlertCircle size={20} />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    {text && !loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-8 flex justify-center"
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/study');
                                }}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1"
                            >
                                Confirm & Go to Study Mode
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default FileUpload;

