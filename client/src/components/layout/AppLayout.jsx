import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import MobileSidebar from './MobileSidebar.jsx';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-ink">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <MobileSidebar />
        <main className="flex-1 md:pl-[240px] min-w-0 flex flex-col bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
