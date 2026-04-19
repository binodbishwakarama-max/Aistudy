import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
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

  // Deterministic gradient generator based on deck title/id
  const getGradientForDeck = (deck) => {
    const gradients = [
      'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
      'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
      'linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)',
      'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
      'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
      'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
      'linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)',
    ];
    
    // Simple hash function for title
    let hash = 0;
    const key = deck.title || deck.id || '';
    for (let i = 0; i < key.length; i++) {
      hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  const getTextColorForGradient = (deck) => {
    const key = deck.title || deck.id || '';
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % 10;
    // For gradients that are very light, use dark text. For the purple/dark ones, use white.
    return index === 6 ? '#ffffff' : '#1a202c'; 
  };


  if (loading) {
    return (
      <div className="flex overflow-x-auto gap-5 snap-x px-2 pb-8 scrollbar-hide">
        {[1, 2, 3].map((item) => (
          <div key={item} className="glass-card animate-pulse shadow-md rounded-[20px] shrink-0 w-64 h-80 snap-start relative overflow-hidden flex flex-col p-6 border-none">
            <div className="h-10 w-10 rounded-2xl bg-black/10" />
            <div className="mt-auto h-6 w-3/4 bg-black/10 rounded mb-3" />
            <div className="h-4 w-full bg-black/10 rounded" />
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
    <div className="flex overflow-x-auto gap-5 snap-x px-2 pb-8 scrollbar-hide">
      {decks.map((deck) => {
        const bgGradient = getGradientForDeck(deck);
        const textColor = getTextColorForGradient(deck);
        
        return (
          <Motion.div
            key={deck.id}
            onClick={() => handleLoad(deck.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleLoad(deck.id);
              }
            }}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            tabIndex={0}
            role="button"
            className="group relative cursor-pointer shadow-md hover:shadow-2xl transition-shadow rounded-[24px] shrink-0 w-64 h-80 snap-start overflow-hidden flex flex-col justify-between border border-white/20"
            style={{ background: bgGradient, color: textColor }}
          >
            {/* Top Badges Area */}
            <div className="p-5 flex items-start justify-between z-10 w-full">
               <div className="flex flex-col gap-2">
                 <span className="bg-white/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1 w-max">
                   <Clock size={10} />
                   {format(new Date(deck.created_at), 'MMM d, yy')}
                 </span>
                 <div className="flex gap-2">
                   <span className="bg-white/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-semibold text-gray-800">
                     {deck.card_count ?? deck.flashcards?.length ?? 0} Cards
                   </span>
                 </div>
               </div>
               
               <button
                  onClick={(event) => handleDelete(event, deck.id)}
                  className="rounded-full p-2 bg-white/40 backdrop-blur-md text-gray-800 transition hover:bg-red-500 hover:text-white"
                  title="Delete deck"
               >
                 <Trash2 size={16} />
               </button>
            </div>

            {/* Bottom Content Area */}
            <div className="p-5 z-10 mt-auto bg-gradient-to-t from-black/40 via-black/10 to-transparent">
              <h3 className="font-heading text-xl font-extrabold line-clamp-2 text-white drop-shadow-md">
                {deck.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm font-medium text-white/90 drop-shadow-sm">
                 {deck.description || 'No description provided.'}
              </p>
              
              <div className="mt-4 flex items-center gap-1 text-sm font-bold text-white group-hover:gap-2 transition-all">
                 Study via AI <ArrowRight size={16} />
              </div>
            </div>

          </Motion.div>
        );
      })}
    </div>
  );
};

export default StudyLibrary;
