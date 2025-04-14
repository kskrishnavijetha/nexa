
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Navigation component with sidebar and header
const Layout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-xl font-semibold">NexaBloom</h1>
          <nav className="ml-auto flex items-center space-x-4">
            {user && <span className="text-sm text-muted-foreground">{user.email}</span>}
          </nav>
        </div>
      </header>
      
      <div className="flex">
        <aside className="w-64 border-r bg-card/50 h-[calc(100vh-4rem)] p-4 hidden md:block">
          <nav className="space-y-2">
            <a href="/dashboard" className="block px-3 py-2 rounded-md hover:bg-accent">Dashboard</a>
            <a href="/document-analysis" className="block px-3 py-2 rounded-md hover:bg-accent">Document Analysis</a>
            <a href="/history" className="block px-3 py-2 rounded-md hover:bg-accent">History</a>
            <a href="/settings" className="block px-3 py-2 rounded-md hover:bg-accent">Settings</a>
          </nav>
        </aside>
        
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
