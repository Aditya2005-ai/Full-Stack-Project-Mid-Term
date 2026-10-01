import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useUiStore } from '../../store/uiStore.js';
import { useAuthStore } from '../../store/authStore.js';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';

export const Header = () => {
  const { toggleSidebar } = useUiStore();
  const { user, logout } = useAuthStore();

  return (
    <header className="h-11 border-b border-border bg-white px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded text-ink-muted hover:text-ink hover:bg-canvas-inset md:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2 text-xs text-ink-muted">
          <span className="font-medium text-ink flex items-center">
            <span className="w-2 h-2 rounded-full bg-accent mr-1.5" />
            Autonomous MERN Builder
          </span>
          <span>/</span>
          <span className="text-ink-soft">Workspace</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Badge variant="neutral" className="hidden sm:inline-flex text-[11px]">
          v0.2.0 • Notion Minimal
        </Badge>

        <div className="flex items-center space-x-2 border-l border-border pl-3">
          <div className="w-6 h-6 rounded-full bg-canvas-inset border border-border flex items-center justify-center text-[11px] font-semibold text-ink">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="text-xs text-ink font-medium hidden sm:inline">
            {user?.name || 'Developer'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="p-1 h-7 text-ink-muted hover:text-danger"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
