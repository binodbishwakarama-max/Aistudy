import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudyHistory, deleteDeck } from '../services/api';
import { useStudy } from '../context/StudyContext';
import { ArrowRight, Book, Clock, FolderOpen, Trash2 } from 'lucide-react';
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

  const handleDelete = async (event, id) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this study set?')) {
      await deleteDeck(id);
      setDecks((prev) => prev.filter((deck) => deck.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="glass-card h-44 animate-pulse p-6">
            <div className="h-10 w-10 rounded-2xl bg-[var(--bg-elevated)]" />
            <div className="mt-6 h-5 w-3/4 rounded bg-[var(--bg-elevated)]" />
            <div className="mt-3 h-4 w-full rounded bg-[var(--bg-elevated)]" />
            <div className="mt-2 h-4 w-1/2 rounded bg-[var(--bg-elevated)]" />
          </div>
        ))}
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="section-shell mx-auto flex max-w-2xl flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-strong)] text-[var(--accent)]">
          <FolderOpen size={28} />
        </div>
        <h3 className="mt-6 text-2xl font-semibold">Your library is empty</h3>
        <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--text-secondary)]">
          Upload a document or paste notes from the dashboard to create your first study set.
        </p>
        <button onClick={() => navigate('/dashboard')} className="primary-button mt-8 px-5 py-3">
          Start studying
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {decks.map((deck) => (
        <div
          key={deck.id}
          onClick={() => handleLoad(deck.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleLoad(deck.id);
            }
          }}
          tabIndex={0}
          role="button"
          className="glass-card group relative cursor-pointer p-6 text-left"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-elevated)] text-[var(--accent)]">
              <Book size={20} />
            </div>

            <button
              onClick={(event) => handleDelete(event, deck.id)}
              className="rounded-full p-2 text-[var(--text-muted)] transition-mindflow hover:bg-[rgba(217,48,37,0.08)] hover:text-[var(--danger)]"
              title="Delete deck"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <h3 className="mt-5 line-clamp-1 text-lg font-semibold text-[var(--text-primary)]">{deck.title}</h3>
          <p className="mt-3 line-clamp-2 min-h-[3.5rem] text-sm leading-7 text-[var(--text-secondary)]">
            {deck.description || 'No description provided.'}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
            <span className="info-chip">
              <Clock size={12} />
              {format(new Date(deck.created_at), 'MMM d, yyyy')}
            </span>
            <span className="info-chip">{deck.card_count ?? deck.flashcards?.length ?? 0} cards</span>
            <span className="info-chip">{deck.question_count ?? deck.quiz?.length ?? 0} questions</span>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
            Open session
            <ArrowRight size={16} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudyLibrary;
