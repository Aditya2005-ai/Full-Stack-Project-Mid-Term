import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Home, FolderGit2, PlusSquare, Settings, User } from 'lucide-react';
import { useUiStore } from '../../store/uiStore.js';
import { useAuthStore } from '../../store/authStore.js';

const navigation = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'My Builds', href: '/builds', icon: FolderGit2 },
  { name: 'New Build', href: '/build', icon: PlusSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'User Profile', href: '/profile', icon: User }
];

export const MobileSidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const { user, logout } = useAuthStore();

  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white border-r border-border pt-4 pb-4">
        <div className="px-4 flex items-center justify-between pb-3 border-b border-border">
          <span className="font-semibold text-xs text-ink uppercase tracking-wider">Navigation</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded text-ink-muted hover:text-ink"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <nav className="mt-3 px-2 space-y-0.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-normal rounded-[4px] ${
                    isActive
                      ? 'bg-canvas-inset text-ink font-medium'
                      : 'text-ink-soft hover:bg-canvas-inset'
                  }`
                }
              >
                <Icon className="w-4 h-4 mr-3 text-ink-muted" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MobileSidebar;
