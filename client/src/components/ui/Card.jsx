import React, { useRef } from 'react';
import { cn } from '../../utils/cn';

const variantClasses = {
  default: 'bg-[var(--bg-card)] border-[var(--border)] backdrop-blur-md',
  muted: 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.05)] backdrop-blur-xl',
  accent: 'bg-[linear-gradient(180deg,rgba(99,102,241,0.08),rgba(16,18,27,0.75))] border-[var(--border-accent)] shadow-[0_0_20px_rgba(99,102,241,0.06)]',
  dark: 'bg-[rgba(6,7,10,0.8)] border-[rgba(255,255,255,0.04)] text-white backdrop-blur-lg',
};

const Card = ({ as: Tag = 'div', className = '', variant = 'default', children, ...props }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <Tag
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn('ui-card', variantClasses[variant] || variantClasses.default, className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Card;
