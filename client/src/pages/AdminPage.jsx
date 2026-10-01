import React from 'react';
import PageContainer from '../components/layout/PageContainer.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import { MODULE_CATALOGUE } from '../mocks/mockModules.js';
import { ShieldCheck, Plus, Layers, BarChart3, Settings2 } from 'lucide-react';

export const AdminPage = () => {
  return (
    <PageContainer
      title="Admin Management Panel"
      subtitle="P1 Requirement: Manage module catalogue, templates, and view generation usage statistics"
      actions={
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Custom Module
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center justify-between text-muted text-xs">
              <span>Total Active Modules</span>
              <Layers className="w-4 h-4 text-brand-400" />
            </div>
            <p className="text-2xl font-bold text-text mt-2">{MODULE_CATALOGUE.length}</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between text-muted text-xs">
              <span>Generations This Week</span>
              <BarChart3 className="w-4 h-4 text-accent" />
            </div>
            <p className="text-2xl font-bold text-text mt-2">142</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between text-muted text-xs">
              <span>Admin Access Role</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-text mt-2">ADMIN</p>
          </Card>
        </div>

        {/* Modules Catalogue Table */}
        <Card title="Module Catalogue & Template Definitions" subtitle="Available capabilities in generator catalogue">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-surface-800 text-muted uppercase text-[10px]">
                  <th className="py-2.5 px-3">Module ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Dependencies</th>
                  <th className="py-2.5 px-3">Version</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800">
                {MODULE_CATALOGUE.map((mod) => (
                  <tr key={mod.id} className="hover:bg-surface-900/40">
                    <td className="py-2.5 px-3 font-mono text-brand-300 font-semibold">{mod.id}</td>
                    <td className="py-2.5 px-3 font-medium text-text">{mod.name}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="default" className="text-[10px]">{mod.category}</Badge>
                    </td>
                    <td className="py-2.5 px-3 text-muted">
                      {mod.dependencies.length > 0 ? mod.dependencies.join(', ') : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-muted">{mod.version}</td>
                    <td className="py-2.5 px-3 text-right">
                      <Badge variant="success" className="text-[10px]">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AdminPage;
