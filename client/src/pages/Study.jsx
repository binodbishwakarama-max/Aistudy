import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { useAuth } from '../context/AuthContext';
import { Layers, HelpCircle, AlertTriangle, CheckCircle, FileText, BarChart, BookOpen, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Flashcard from '../components/Flashcard';
import Quiz from '../components/Quiz';
import ReviewSheet from '../components/ReviewSheet';
import StatsDashboard from '../components/StatsDashboard';
import ChatInterface from '../components/ChatInterface';
import SRSDashboard from '../components/SRSDashboard';
import StudyLibrary from '../components/StudyLibrary';

const Study = () => {
  const { text, flashcards, quiz, generateFlashcards, generateQuiz, saveSession, loading, error } = useStudy();
  const { user } = useAuth();
  const [mode, setMode] = useState(() => (text ? 'flashcards' : 'library'));
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user) {
      alert('Please login to save your progress!');
      return;
    }
    setSaving(true);
    const success = await saveSession(
      'Study Session ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    );
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (!text && mode !== 'library') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-20 h-20 bg-[var(--bg-elevated)] rounded-2xl flex items-center justify-center mb-6 border border-[var(--border)]">
          <BookOpen size={40} className="text-[var(--text-muted)]" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-3">Time to Study!</h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-md font-medium">
          Your workspace is empty. Upload a document to generate flashcards or open your library to review past sessions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-xl font-semibold hover:bg-[var(--accent-light)] transition-mindflow glow-shadow"
          >
            Upload Document
          </button>
          <button
            onClick={() => setMode('library')}
            className="px-6 py-2.5 glass-card text-[var(--text-primary)] rounded-xl font-semibold hover:border-[var(--border-accent)] transition-mindflow"
          >
            Open Library
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'review', label: 'Review Sheet', icon: FileText },
    { id: 'stats', label: 'Stats', icon: BarChart },
    { id: 'library', label: 'Library', icon: BookOpen },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="font-heading text-4xl font-bold text-[var(--text-primary)] tracking-tight">
            {mode === 'library' ? 'My Library' : 'Study Session'}
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-lg">
            {mode === 'library' ? 'Select a deck to review' : 'Master your material with AI-powered tools'}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {text && (
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-mindflow ${
                saved
                  ? 'bg-[var(--success)]/20 text-[var(--success)] border border-[var(--success)]/30'
                  : 'glass-card text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]'
              }`}
            >
              {saved ? <CheckCircle size={16} /> : <Save size={16} />}
              {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Session'}
            </button>
          )}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2.5 glass-card text-[var(--text-secondary)] rounded-xl font-semibold hover:border-[var(--border-accent)] hover:text-[var(--text-primary)] transition-mindflow"
          >
            <ArrowLeft size={16} />
            New Document
          </button>
        </div>
      </div>

      {error && (
        <div
          className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)]"
          role="alert"
        >
          <AlertTriangle size={20} className="flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="flex flex-col gap-2 p-4 glass-card rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-mindflow ${
                  mode === tab.id
                    ? 'bg-[var(--accent)]/20 text-[var(--accent-light)] border border-[var(--border-accent)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-8">
            <SRSDashboard />
          </div>
        </div>

        <div className="lg:col-span-3 min-h-[500px]">
          <AnimatePresence mode="wait">
            {mode === 'flashcards' && (
              <motion.div
                key="flashcards"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {flashcards.length === 0 ? (
                  <div className="text-center py-20 glass-card rounded-xl border-dashed">
                    <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-2">
                      Generate Flashcards?
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-6 text-sm">AI will create study cards from your notes.</p>
                    <button
                      onClick={generateFlashcards}
                      disabled={loading}
                      className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-xl font-semibold hover:bg-[var(--accent-light)] transition-mindflow disabled:opacity-50 glow-shadow"
                    >
                      {loading ? 'Generating...' : 'Generate with AI'}
                    </button>
                  </div>
                ) : (
                  <Flashcard cards={flashcards} />
                )}
              </motion.div>
            )}

            {mode === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {quiz.length === 0 ? (
                  <div className="text-center py-20 glass-card rounded-xl border-dashed">
                    <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-2">Ready for a quiz?</h3>
                    <p className="text-[var(--text-secondary)] mb-6 text-sm">Test your knowledge with an AI-generated quiz.</p>
                    <button
                      onClick={generateQuiz}
                      disabled={loading}
                      className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-xl font-semibold hover:bg-[var(--accent-light)] transition-mindflow disabled:opacity-50 glow-shadow"
                    >
                      {loading ? 'Generating...' : 'Generate Quiz'}
                    </button>
                  </div>
                ) : (
                  <Quiz questions={quiz} />
                )}
              </motion.div>
            )}

            {mode === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <ReviewSheet flashcards={flashcards} />
              </motion.div>
            )}

            {mode === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StatsDashboard />
              </motion.div>
            )}

            {mode === 'library' && (
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StudyLibrary onSelect={setMode} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ChatInterface />
    </div>
  );
};

export default Study;
