import React from 'react';
import Loader from './Loader';
import { cn } from '../../utils/cn';

const variantClasses = {
  primary:
    'border-transparent bg-[var(--accent)] text-white shadow-[0_12px_30px_rgba(26,115,232,0.18)] hover:bg-[var(--accent-light)]',
  secondary:
    'border-[var(--border)] bg-white text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[rgba(255,255,255,0.95)]',
  ghost: 'border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]',
  subtle:
    'border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-card)]',
  danger:
    'border-transparent bg-[var(--danger)] text-white shadow-[0_12px_30px_rgba(217,48,37,0.18)] hover:brightness-110',
};

const sizeClasses = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-11 w-11 p-0',
};

const Button = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  loading = false,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        'ui-button',
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        isDisabled && 'cursor-not-allowed opacity-60',
        className,
      )}
      {...props}
    >
      {loading ? <Loader label="" size="sm" className="text-current" /> : LeftIcon ? <LeftIcon size={18} /> : null}
      {children}
      {!loading && RightIcon ? <RightIcon size={18} /> : null}
    </button>
  );
};

export default Button;
