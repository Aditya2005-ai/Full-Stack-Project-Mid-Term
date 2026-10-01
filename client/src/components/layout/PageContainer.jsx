import React from 'react';

export const PageContainer = ({
  children,
  title,
  subtitle,
  actions,
  className = ''
}) => {
  return (
    <div className={`p-6 sm:p-8 max-w-5xl mx-auto w-full space-y-6 ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border">
          <div>
            {title && <h1 className="text-xl font-bold tracking-tight text-ink">{title}</h1>}
            {subtitle && <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center space-x-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default PageContainer;
