import React from 'react';
import { cn } from '../../utils/cn';

const InputField = ({
  label,
  helper,
  error,
  className = '',
  inputClassName = '',
  icon: Icon,
  endAdornment,
  ...props
}) => {
  const hasError = Boolean(error);

  return (
    <label className={cn('block space-y-2', className)}>
      {label && <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>}
      <span
        className={cn(
          'ui-input-shell',
          hasError && 'border-[rgba(217,48,37,0.4)] shadow-[0_0_0_4px_rgba(217,48,37,0.08)]',
        )}
      >
        {Icon ? <Icon size={18} className="text-[var(--text-muted)]" /> : null}
        <input className={cn('ui-input', inputClassName)} {...props} />
        {endAdornment ? <span className="inline-flex items-center">{endAdornment}</span> : null}
      </span>
      {error ? (
        <span className="text-sm text-[var(--danger)]">{error}</span>
      ) : helper ? (
        <span className="text-sm text-[var(--text-muted)]">{helper}</span>
      ) : null}
    </label>
  );
};

export default InputField;
