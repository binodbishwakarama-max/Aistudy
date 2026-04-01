import React from 'react';
import { FileText } from 'lucide-react';

const ReviewSheet = ({ flashcards }) => {
  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="section-shell py-16 text-center">
        <FileText className="mx-auto mb-4 h-12 w-12 text-[var(--text-muted)]" />
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">No content to review yet</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          Generate flashcards first to build your review sheet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] bg-[var(--bg-elevated)] p-6">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-[var(--text-primary)]">
          <FileText size={20} className="text-[var(--accent)]" />
          Quick review sheet
        </h3>
        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
          Scan the key points before starting flashcards or quiz mode.
        </p>
      </div>

      <div className="grid gap-3">
        {flashcards.map((card, index) => (
          <div key={index} className="glass-card p-5">
            <div className="flex items-start gap-4">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-sm font-semibold text-[var(--text-secondary)]">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-semibold text-[var(--text-primary)]">{card.question}</h4>
                <div className="mt-3 border-l-2 border-[var(--border-accent)] pl-4 text-sm leading-7 text-[var(--text-secondary)]">
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
