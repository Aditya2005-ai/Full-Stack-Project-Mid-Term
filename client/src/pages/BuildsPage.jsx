import React from 'react';
import PageContainer from '../components/layout/PageContainer.jsx';
import BuildCard from '../components/builds/BuildCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BuildsPage = () => {
  const sampleBuilds = [
    {
      id: 'bld-001',
      projectName: 'vintage-apparel',
      modules: ['auth', 'products', 'cart', 'orders'],
      status: 'completed',
      createdAt: new Date().toISOString()
    },
    {
      id: 'bld-002',
      projectName: 'gadget-market',
      modules: ['auth', 'products', 'cart', 'payments', 'reviews'],
      status: 'generating',
      createdAt: new Date().toISOString()
    }
  ];

  return (
    <PageContainer
      title="Build History"
      subtitle="Previously configured and generated project repositories"
      actions={
        <Link to="/builder">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            New Build
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sampleBuilds.map((build) => (
          <BuildCard key={build.id} build={build} />
        ))}
      </div>
    </PageContainer>
  );
};

export default BuildsPage;
