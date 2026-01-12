import React from 'react';
import FileUpload from '../components/FileUpload';
import { motion } from 'framer-motion';
import { Sparkles, Zap, BarChart2 } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] gap-12 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center space-y-4 max-w-3xl px-4 z-10"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-4">
                    <Sparkles size={14} />
                    <span>AI-Powered Learning Revolution</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">Smarter</span>, <br />
                    Not Harder.
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Upload your lecture notes and let our AI instantly create interactive flashcards and quizzes. Master any subject in minutes.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full max-w-3xl z-10"
            >
                <FileUpload />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4 z-10"
            >
                {[
                    {
                        icon: <Sparkles className="w-6 h-6 text-purple-600" />,
                        title: 'Instant AI Generation',
                        desc: 'Turn messy PDFs into structured Quizzes in seconds using Llama 3.'
                    },
                    {
                        icon: <Zap className="w-6 h-6 text-yellow-500" />,
                        title: 'Active Recall',
                        desc: 'Scientific study methods built-in via interactive flashcards.'
                    },
                    {
                        icon: <BarChart2 className="w-6 h-6 text-indigo-500" />,
                        title: 'Progress Tracking',
                        desc: 'Save your sessions and watch your knowledge grow over time.'
                    },
                ].map((feature, i) => (
                    <div key={i} className="group bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 border border-gray-100 group-hover:scale-110 transition-transform">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                        <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default Home;
