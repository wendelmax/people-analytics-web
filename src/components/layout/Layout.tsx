import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showBreadcrumbs = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-64 bg-white h-full">
              <Sidebar />
            </div>
          </div>
        )}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            className="md:hidden mb-4 p-2 bg-gray-200 rounded"
            onClick={() => setSidebarOpen(true)}
          >
            ☰ Menu
          </button>
          {showBreadcrumbs && (
            <div className="mb-4">
              <Breadcrumbs />
            </div>
          )}
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

