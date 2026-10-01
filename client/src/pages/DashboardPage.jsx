import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer.jsx';
import DashboardOverview from '../components/dashboard/DashboardOverview.jsx';
import StoreBasicsForm from '../components/dashboard/StoreBasicsForm.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useBuilderStore } from '../store/builderStore.js';
import {
  Plus,
  FolderGit2,
  ExternalLink,
  Copy,
  RefreshCw,
  Trash2,
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';

const INITIAL_BUILDS = [
  {
    id: 'bld-001',
    name: 'Bloom Boutique',
    store: { currency: 'INR', theme: '#6366F1' },
    modules: ['auth', 'products', 'cart', 'orders', 'payments', 'admin'],
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'bld-002',
    name: 'TechGear Market',
    store: { currency: 'USD', theme: '#14B8A6' },
    modules: ['products', 'cart', 'reviews', 'search'],
    status: 'completed',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { setProject, setSelectedModules, setCurrentStep } = useBuilderStore();

  const [builds, setBuilds] = useState(INITIAL_BUILDS);
  const [showCreateForm, setShowCreateForm] = useState(true);

  const handleOpen = (build) => {
    setProject({
      name: build.name,
      currency: build.store.currency,
      theme: build.store.theme
    });
    setSelectedModules(build.modules);
    setCurrentStep(2);
    navigate('/build');
  };

  const handleDuplicate = (build) => {
    const copy = {
      ...build,
      id: `bld-${Date.now().toString(36)}`,
      name: `${build.name} (Copy)`,
      createdAt: new Date().toISOString()
    };
    setBuilds([copy, ...builds]);
  };

  const handleRegenerate = (build) => {
    handleOpen(build);
    navigate('/build/review');
  };

  const handleDelete = (buildId) => {
    setBuilds(builds.filter((b) => b.id !== buildId));
  };

  const handleFormCreated = (newBuildData) => {
    const newBuild = {
      id: `bld-${Date.now().toString(36)}`,
      name: newBuildData.name,
      store: {
        currency: newBuildData.currency,
        theme: newBuildData.theme,
        logoUrl: newBuildData.logoUrl,
        description: newBuildData.description
      },
      modules: newBuildData.modules,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setBuilds([newBuild, ...builds]);
    navigate('/build');
  };

  return (
    <PageContainer
      title="Engineering Dashboard & Build Manager"
      subtitle="Configure new e-commerce stores, manage saved builds, and run generation pipelines"
      actions={
        <Button
          size="sm"
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant={showCreateForm ? 'secondary' : 'primary'}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {showCreateForm ? 'Hide Form' : 'New Store Form'}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Metric Badges */}
        <DashboardOverview />

        {/* 1. Store Basics Creation Form (PPT P0 Requirement) */}
        {showCreateForm && (
          <div className="animate-in fade-in duration-200">
            <StoreBasicsForm onCreated={handleFormCreated} />
          </div>
        )}

        {/* 2. My Builds List (PPT Page 8: open, duplicate, regenerate, delete) */}
        <Card
          title="My Builds"
          subtitle="Saved build configurations matching Problem Statement 06 specifications"
          actions={<span className="text-xs text-muted font-mono">{builds.length} builds saved</span>}
        >
          {builds.length === 0 ? (
            <div className="text-center py-8 text-muted text-xs">
              <FolderGit2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              No builds saved yet. Fill out the Store Basics Form above to create your first build.
            </div>
          ) : (
            <div className="divide-y divide-surface-800">
              {builds.map((build) => (
                <div
                  key={build.id}
                  className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-surface-900/30 px-2 rounded-md transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: build.store?.theme || '#6366F1' }}
                        title={`Theme: ${build.store?.theme}`}
                      />
                      <h4 className="text-sm font-semibold text-text">{build.name}</h4>
                      <Badge variant="brand" className="text-[10px] font-mono">
                        {build.store?.currency || 'INR'}
                      </Badge>
                      <Badge variant="success" className="text-[10px]">
                        {build.status || 'saved'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {build.modules.map((m) => (
                        <span
                          key={m}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-800 text-slate-300 border border-surface-700"
                        >
                          {m}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-muted pt-0.5">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(build.createdAt).toLocaleDateString()}
                      </span>
                      <span>ID: <code className="text-slate-400 font-mono">{build.id}</code></span>
                    </div>
                  </div>

                  {/* Actions matching Page 8: open, duplicate, regenerate, delete */}
                  <div className="flex items-center space-x-1.5 self-end md:self-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpen(build)}
                      title="Open in Builder"
                      className="text-xs h-8"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1 text-primary-light" />
                      Open
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicate(build)}
                      title="Duplicate Configuration"
                      className="text-xs h-8"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1 text-accent" />
                      Duplicate
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRegenerate(build)}
                      title="Regenerate Project"
                      className="text-xs h-8"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      Regenerate
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(build.id)}
                      title="Delete Build"
                      className="text-xs h-8 text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
