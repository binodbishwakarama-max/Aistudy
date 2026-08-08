import React from 'react';
import { cn } from '../../utils/cn';

const variantClasses = {
  default: 'bg-[var(--bg-card)] border-[var(--border)]',
  muted: 'bg-[rgba(0,0,0,0.02)] border-[var(--border)]',
  accent: 'bg-[var(--bg-strong)] border-[var(--border-accent)]',
  dark: 'bg-[var(--text-primary)] border-transparent text-white',
};

const Card = ({ as: Tag = 'div', className = '', variant = 'default', children, ...props }) => (
  <Tag className={cn('ui-card', variantClasses[variant] || variantClasses.default, className)} {...props}>
    {children}
  </Tag>
);

export default Card;
