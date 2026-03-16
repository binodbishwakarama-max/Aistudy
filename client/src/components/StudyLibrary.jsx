import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudyHistory, deleteDeck } from '../services/api';
import { useStudy } from '../context/StudyContext';
import { Clock, Book, Trash2, ArrowRight, FolderOpen } from 'lucide-react';
import { format } from 'date-fns';

const StudyLibrary = ({ onSelect }) => {
  const { loadDeck, refreshLibrary } = useStudy();
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [refreshLibrary]);

  const fetchHistory = async () => {
    try {
      const history = await getStudyHistory();
      setDecks(history || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async (id) => {
    await loadDeck(id);
    if (onSelect) onSelect('flashcards');
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this study set?')) {
      await deleteDeck(id);
      setDecks((prev) => prev.filter((d) => d.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-6 h-48 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="w-10 h-10 bg-[var(--bg-elevated)] rounded-xl" />
              <div className="w-8 h-8 bg-[var(--bg-elevated)] rounded-lg" />
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-[var(--bg-elevated)] rounded w-3/4" />
              <div className="h-4 bg-[var(--bg-elevated)] rounded w-full" />
              <div className="h-4 bg-[var(--bg-elevated)] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-2xl border-dashed max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-[var(--accent)]/20 rounded-2xl flex items-center justify-center mb-6 border border-[var(--border-accent)] relative">
          <FolderOpen size={40} className="text-[var(--accent-light)]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent)] rounded-full border-2 border-[var(--bg-base)] animate-pulse" />
        </div>
        <h3 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-3">Your Library is Empty</h3>
        <p className="text-[var(--text-secondary)] max-w-sm mx-auto mb-8">
          Upload a document or paste some text to generate your first AI-powered study set.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-xl font-semibold hover:bg-[var(--accent-light)] transition-mindflow glow-shadow"
        >
          Start Studying <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      {decks.map((deck) => (
        <div
          key={deck.id}
          className="glass-card rounded-2xl p-6 hover:border-[var(--border-accent)] transition-mindflow cursor-pointer group relative overflow-hidden"
          onClick={() => handleLoad(deck.id)}
        >
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[var(--accent)]/20 rounded-xl group-hover:bg-[var(--accent)]/30 transition-mindflow border border-[var(--border-accent)]/50">
              <Book size={24} className="text-[var(--accent-light)]" />
            </div>
            <button
              onClick={(e) => handleDelete(e, deck.id)}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-lg transition-mindflow z-10"
              title="Delete Deck"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-1 group-hover:text-[var(--accent-light)] transition-colors">
            {deck.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-6 h-10 leading-relaxed">
            {deck.description || 'No description provided.'}
          </p>

          <div className="flex justify-between items-center pt-4 border-t border-[var(--border)]">
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium bg-[var(--bg-elevated)] px-2 py-1 rounded-lg">
              <Clock size={12} />
              {format(new Date(deck.created_at), 'MMM d, yyyy')}
            </span>
            <span className="text-xs font-bold text-[var(--accent-light)] bg-[var(--accent)]/20 px-2.5 py-1 rounded-full font-mono">
              {deck.card_count ?? deck.flashcards?.length ?? 0} Cards
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudyLibrary;
