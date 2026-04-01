import React from 'react';
import { cn } from '../../utils/cn';

const Loader = ({ label = 'Loading...', className = '', size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'h-4 w-4 border-[1.5px]' : 'h-5 w-5 border-2';

  return (
    <span className={cn('inline-flex items-center gap-2 text-sm text-[var(--text-muted)]', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'inline-block animate-spin rounded-full border-[var(--border)] border-t-[var(--accent)]',
          sizeClass,
        )}
      />
      {label && <span>{label}</span>}
    </span>
  );
};

export default Loader;
