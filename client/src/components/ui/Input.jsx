import React from 'react';

export const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  id,
  hint,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-ink-soft mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={`w-full rounded-[4px] bg-white border ${
          error ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger/20' : 'border-border focus:border-ink focus:ring-1 focus:ring-ink/20'
        } px-2.5 py-1.5 text-sm text-ink placeholder-ink-subtle focus:outline-none transition-colors duration-150 disabled:opacity-50 disabled:bg-canvas-subtle shadow-subtle ${className}`}
        {...props}
      />
      {hint && !error && (
        <p className="mt-1 text-[11px] text-ink-muted">{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-danger">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
