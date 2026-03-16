import React from 'react';
import { FileText } from 'lucide-react';

const ReviewSheet = ({ flashcards }) => {
  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-center py-16 glass-card rounded-2xl border-dashed">
        <FileText className="w-14 h-14 text-[var(--text-muted)] mx-auto mb-4" />
        <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] mb-2">No content to review</h3>
        <p className="text-sm text-[var(--text-secondary)]">Generate flashcards first to see your cheat sheet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-6 mb-6">
        <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
          <FileText size={20} className="text-[var(--accent)]" />
          Quick Review Cheat Sheet
        </h3>
        <p className="text-sm text-[var(--text-secondary)] font-medium">
          Review all key points at a glance before starting your quiz or flashcards.
        </p>
      </div>

      <div className="grid gap-3">
        {flashcards.map((card, index) => (
          <div
            key={index}
            className="glass-card rounded-xl p-5 hover:border-[var(--border-accent)] transition-mindflow"
          >
            <div className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-lg flex items-center justify-center text-sm font-mono font-bold border border-[var(--border)]">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-bold text-[var(--text-primary)] text-base mb-2">{card.question}</h4>
                <div className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed pl-4 border-l-2 border-[var(--border-accent)]">
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
