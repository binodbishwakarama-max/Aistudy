import React from 'react';
import Loader from './Loader';
import { cn } from '../../utils/cn';

const variantClasses = {
  primary:
    'border-transparent bg-[var(--accent)] text-white shadow-[0_4px_14px_rgba(0,113,227,0.25)] hover:bg-[var(--accent-strong)]',
  secondary:
    'border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)] hover:border-[rgba(0,0,0,0.2)]',
  ghost: 'border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-[rgba(0,0,0,0.04)]',
  subtle:
    'border-[var(--border)] bg-[rgba(0,0,0,0.03)] text-[var(--text-primary)] hover:bg-[rgba(0,0,0,0.05)]',
  danger:
    'border-transparent bg-[var(--danger)] text-white shadow-[0_4px_14px_rgba(215,0,21,0.2)] hover:brightness-110',
};

const sizeClasses = {
  sm: 'h-9 px-4 text-sm',
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
