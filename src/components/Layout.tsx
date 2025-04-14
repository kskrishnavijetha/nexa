
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
