import React from 'react';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import { Layers, Cpu, Server, CheckCircle2 } from 'lucide-react';

export const DashboardOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-400">Catalogue Modules</p>
          <Layers className="w-4 h-4 text-brand-400" />
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-100">10</span>
          <Badge variant="brand">Ready</Badge>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Available for composition</p>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-400">Engine Status</p>
          <Cpu className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-100">Active</span>
          <Badge variant="success">Online</Badge>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Dependency resolver hooked</p>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-400">Backend API</p>
          <Server className="w-4 h-4 text-sky-400" />
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-100">Express</span>
          <Badge variant="info">Healthy</Badge>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">/api/health verified</p>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-400">Phase Status</p>
          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-100">Phase 01</span>
          <Badge variant="default">Foundation</Badge>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Architecture & Boundaries</p>
      </Card>
    </div>
  );
};

export default DashboardOverview;
