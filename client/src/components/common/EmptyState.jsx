import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from '../ui/Button.jsx';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'Get started by creating your first entry.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="text-center py-12 px-4 border border-dashed border-surface-800 rounded-lg bg-surface-950/30">
      <Icon className="w-10 h-10 text-slate-500 mx-auto mb-3" />
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
