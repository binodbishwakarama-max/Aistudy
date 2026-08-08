import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudyHistory, deleteDeck } from '../services/api';
import { useStudy } from '../context/StudyContext';
import { ArrowRight, Clock, FolderOpen, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Button from './ui/Button';

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
      <div className="space-y-3 p-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-20 animate-pulse rounded-[var(--radius-lg)] bg-[rgba(0,0,0,0.04)]" />
        ))}
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-strong)] text-[var(--accent)]">
          <FolderOpen size={26} />
        </div>
        <h3 className="font-heading mt-6 text-2xl font-bold tracking-tight">Your library is empty</h3>
        <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--text-secondary)]">
          Upload a document to create your first study set.
        </p>
        <Button className="mt-8" rightIcon={ArrowRight} onClick={() => navigate('/upload')}>
          Upload notes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {decks.map((deck) => (
        <button
          key={deck.id}
          type="button"
          onClick={() => handleLoad(deck.id)}
          className="group flex w-full items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-4 text-left transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1">
                <Clock size={12} />
                {format(new Date(deck.created_at), 'MMM d, yyyy')}
              </span>
              <span>·</span>
              <span>{deck.card_count ?? deck.flashcards?.length ?? 0} cards</span>
            </div>
            <h3 className="mt-2 font-semibold text-[var(--text-primary)] line-clamp-1">{deck.title}</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">
              {deck.description || 'No description'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(event) => handleDelete(event, deck.id)}
              className="rounded-full p-2 text-[var(--text-muted)] opacity-0 transition-opacity hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] group-hover:opacity-100"
              title="Delete deck"
              aria-label="Delete deck"
            >
              <Trash2 size={16} />
            </button>
            <ArrowRight size={16} className="text-[var(--text-muted)]" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default StudyLibrary;
