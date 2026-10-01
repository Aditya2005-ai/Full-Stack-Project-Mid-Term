import React from 'react';
import Badge from '../ui/Badge.jsx';

export const BuildStatus = ({ status = 'pending' }) => {
  const statusConfig = {
    pending: { label: 'Pending', variant: 'default' },
    resolving: { label: 'Resolving', variant: 'warning' },
    generating: { label: 'Generating', variant: 'brand' },
    completed: { label: 'Completed', variant: 'success' },
    failed: { label: 'Failed', variant: 'danger' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export default BuildStatus;
