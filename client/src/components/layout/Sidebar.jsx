import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FolderGit2, PlusSquare, Settings, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';

const navigation = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'My Builds', href: '/builds', icon: FolderGit2 },
  { name: 'New Build', href: '/build', icon: PlusSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'User Profile', href: '/profile', icon: User }
];

export const Sidebar = () => {
  const { user, logout } = useAuthStore();

  return (
    <aside className="hidden md:flex md:w-[240px] md:flex-col md:fixed md:inset-y-0 pt-11 border-r border-border bg-canvas-subtle select-none">
      <div className="flex-1 flex flex-col justify-between py-3 overflow-y-auto">
        <div className="px-2 space-y-1">
          <div className="px-2.5 py-1.5 mb-1 text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
            Workspace
          </div>

          <nav className="space-y-0.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-2.5 py-1.5 text-xs font-normal rounded-[4px] transition-colors duration-150 ${
                      isActive
                        ? 'bg-canvas-inset text-ink font-medium shadow-subtle'
                        : 'text-ink-soft hover:bg-canvas-inset/60 hover:text-ink'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 mr-2.5 text-ink-muted shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile at bottom */}
        <div className="px-3 pt-3 border-t border-border-subtle">
          <div className="flex items-center justify-between p-2 rounded-[4px] hover:bg-canvas-inset transition-colors">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-border flex items-center justify-center font-medium text-xs text-ink shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-medium text-ink truncate leading-tight">
                  {user?.name || 'Developer'}
                </p>
                <p className="text-[11px] text-ink-muted truncate leading-tight mt-0.5">
                  {user?.email || 'developer@demo.com'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="text-ink-muted hover:text-danger p-1 rounded"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
