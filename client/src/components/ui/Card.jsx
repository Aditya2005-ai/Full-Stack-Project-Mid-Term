import React from 'react';

export const Card = ({
  children,
  className = '',
  title,
  subtitle,
  actions,
  ...props
}) => {
  return (
    <div
      className={`rounded-[6px] border border-border bg-white p-5 shadow-card transition-all ${className}`}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between pb-3.5 border-b border-border-subtle mb-4">
          <div>
            {title && <h3 className="text-sm font-semibold text-ink tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
