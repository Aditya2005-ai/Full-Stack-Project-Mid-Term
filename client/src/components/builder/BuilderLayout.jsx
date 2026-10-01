import React from 'react';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';

export const BuilderLayout = ({ children, steps = [], currentStep = 1 }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <Card title="Build Pipeline" subtitle="Generator Step Progression">
          <ul className="space-y-3 mt-2">
            {steps.map((step) => {
              const isCurrent = step.id === currentStep;
              const isPast = step.id < currentStep;

              return (
                <li key={step.id} className="flex items-center space-x-3 text-xs">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[11px] ${
                      isCurrent
                        ? 'bg-brand-600 text-white'
                        : isPast
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-surface-800 text-slate-400 border border-surface-700'
                    }`}
                  >
                    {step.id}
                  </span>
                  <span className={`${isCurrent ? 'font-semibold text-slate-100' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
      <div className="lg:col-span-3">
        {children}
      </div>
    </div>
  );
};

export default BuilderLayout;
