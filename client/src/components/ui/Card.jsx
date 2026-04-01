import React from 'react';
import { cn } from '../../utils/cn';

const variantClasses = {
  default: 'bg-[var(--bg-card)] border-[var(--border)]',
  muted: 'bg-[rgba(255,255,255,0.72)] border-[rgba(255,255,255,0.48)] backdrop-blur-xl',
  accent: 'bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(232,240,254,0.96))] border-[var(--border-accent)]',
  dark: 'bg-[#111827] text-white border-[#1f2937]',
};

const Card = ({ as: Tag = 'div', className = '', variant = 'default', children, ...props }) => (
  <Tag className={cn('ui-card', variantClasses[variant] || variantClasses.default, className)} {...props}>
    {children}
  </Tag>
);

export default Card;
