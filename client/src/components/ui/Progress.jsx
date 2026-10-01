import React from 'react';

export const Progress = ({ value = 0, max = 100, className = '' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full bg-surface-800 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className="bg-brand-500 h-full rounded-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default Progress;
