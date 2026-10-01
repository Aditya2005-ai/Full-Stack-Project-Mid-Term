import React from 'react';
import PageContainer from '../components/layout/PageContainer.jsx';
import SettingsLayout from '../components/settings/SettingsLayout.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';

export const SettingsPage = () => {
  return (
    <PageContainer
      title="Settings"
      subtitle="Manage workspace preferences, API endpoints, and team credentials"
    >
      <SettingsLayout>
        <Card title="API Configuration" subtitle="Endpoints used by client service layer">
          <div className="space-y-4 max-w-lg">
            <Input
              label="Backend API Base URL"
              defaultValue="http://localhost:5000/api"
              disabled
            />
            <Input
              label="Environment"
              defaultValue="Development (Phase 01)"
              disabled
            />
            <Button size="sm" variant="secondary" disabled>
              Save Changes
            </Button>
          </div>
        </Card>
      </SettingsLayout>
    </PageContainer>
  );
};

export default SettingsPage;
