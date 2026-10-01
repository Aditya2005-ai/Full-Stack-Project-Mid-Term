import React from 'react';
import { X } from 'lucide-react';
import Button from './Button.jsx';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className={`w-full ${maxWidth} rounded-lg border border-surface-800 bg-surface-900 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-800">
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1 h-auto text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
