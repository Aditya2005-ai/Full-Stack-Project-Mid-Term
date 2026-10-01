import React from 'react';
import Card from '../ui/Card.jsx';

export const SettingsLayout = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 space-y-1">
        <button className="w-full text-left px-3 py-2 text-xs font-medium rounded-md bg-surface-800 text-slate-100">
          General Settings
        </button>
        <button className="w-full text-left px-3 py-2 text-xs font-medium rounded-md text-slate-400 hover:bg-surface-850">
          API & Generator Keys
        </button>
        <button className="w-full text-left px-3 py-2 text-xs font-medium rounded-md text-slate-400 hover:bg-surface-850">
          Team Permissions
        </button>
      </div>
      <div className="md:col-span-3">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;
