import React from 'react';
import PageContainer from '../components/layout/PageContainer.jsx';
import BuilderWizard from '../components/builder/BuilderWizard.jsx';
import { useBuilderStore } from '../store/builderStore.js';
import Badge from '../components/ui/Badge.jsx';

export const BuilderPage = () => {
  const { currentStep, project } = useBuilderStore();

  return (
    <PageContainer
      title={project.name || 'Store Builder'}
      subtitle="5-Step E-Commerce Configuration Pipeline"
      actions={
        <div className="flex items-center space-x-2">
          <Badge variant="neutral">Core Built-in</Badge>
          <Badge variant="brand">Step {currentStep} of 5</Badge>
        </div>
      }
    >
      <BuilderWizard />
    </PageContainer>
  );
};

export default BuilderPage;
