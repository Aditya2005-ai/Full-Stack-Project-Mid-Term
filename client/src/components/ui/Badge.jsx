import React from 'react';

const badgeVariants = {
  default: 'bg-canvas-inset text-ink-soft border-border-subtle',
  neutral: 'bg-canvas-subtle text-ink border-border',
  brand: 'bg-accent-light text-accent border-accent-border',
  accent: 'bg-accent-light text-accent border-accent-border',
  success: 'bg-success-light text-success border-success-border',
  warning: 'bg-warning-light text-warning border-warning-border',
  danger: 'bg-danger-light text-danger border-danger-border',
  faint: 'bg-canvas-soft text-ink-muted border-border-subtle'
};

export const Badge = ({
  children,
  variant = 'default',
  className = ''
}) => {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[11px] font-normal border ${badgeVariants[variant] || badgeVariants.default} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
