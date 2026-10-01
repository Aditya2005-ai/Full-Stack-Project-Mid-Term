import React from 'react';

const variants = {
  primary: 'bg-ink text-white hover:bg-black shadow-subtle focus-visible:outline-ink',
  accent: 'bg-accent text-white hover:bg-accent-hover shadow-subtle focus-visible:outline-accent',
  secondary: 'bg-canvas-subtle text-ink hover:bg-canvas-inset border border-border text-ink',
  outline: 'bg-white border border-border text-ink hover:bg-canvas-subtle shadow-subtle',
  ghost: 'text-ink-soft hover:text-ink hover:bg-canvas-inset',
  danger: 'bg-danger text-white hover:bg-red-600 shadow-subtle'
};

const sizes = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-sm font-medium'
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-normal rounded-[5px] transition-colors duration-150 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-1 disabled:opacity-40 disabled:cursor-not-allowed select-none ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
