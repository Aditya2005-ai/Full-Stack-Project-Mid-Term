import React from 'react';
import PageContainer from '../components/layout/PageContainer.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useAuthStore } from '../store/authStore.js';
import { User, Mail, Shield, LogOut, Package } from 'lucide-react';

export const ProfilePage = () => {
  const { user, logout } = useAuthStore();

  return (
    <PageContainer
      title="User Profile"
      subtitle="Manage your developer account credentials and build workspace"
      actions={
        <Button variant="outline" size="sm" onClick={logout} className="text-danger hover:bg-danger-light">
          <LogOut className="w-3.5 h-3.5 mr-1.5" />
          Sign Out
        </Button>
      }
    >
      <div className="space-y-6 max-w-2xl">
        <Card title="Account Details" subtitle="Personal and authorization information">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 pb-4 border-b border-border-subtle">
              <div className="w-12 h-12 rounded-full bg-canvas-inset border border-border flex items-center justify-center font-bold text-base text-ink">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">{user?.name || 'Developer'}</h3>
                <p className="text-xs text-ink-muted">{user?.email || 'developer@demo.com'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-ink-muted block mb-0.5">Role</span>
                <Badge variant="brand">{user?.role || 'USER'}</Badge>
              </div>
              <div>
                <span className="text-ink-muted block mb-0.5">Account Status</span>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Built-in Developer Features" subtitle="Configured access permissions">
          <div className="space-y-2 text-xs text-ink-soft">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-accent" />
              <span>Full access to MERN code generator and archive streamer</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-success" />
              <span>Standard JWT authorization active</span>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
