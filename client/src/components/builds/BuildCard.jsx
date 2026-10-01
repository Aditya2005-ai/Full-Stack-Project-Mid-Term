import React from 'react';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import BuildStatus from './BuildStatus.jsx';
import { ExternalLink, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BuildCard = ({ build = {} }) => {
  return (
    <Card className="hover:border-surface-700 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-100">{build.projectName || 'ecommerce-store'}</h4>
          <p className="text-xs text-slate-400 mt-0.5">ID: {build.id || 'build-demo'}</p>
        </div>
        <BuildStatus status={build.status || 'completed'} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(build.modules || ['auth', 'products']).map((mod) => (
          <Badge key={mod} variant="default" className="text-[10px]">
            {mod}
          </Badge>
        ))}
      </div>

      <div className="mt-5 pt-3 border-t border-surface-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>{build.createdAt ? new Date(build.createdAt).toLocaleDateString() : 'Phase 01'}</span>
        <div className="flex items-center space-x-2">
          <Link to={`/builds/${build.id || 'demo'}`}>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              Details
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default BuildCard;
