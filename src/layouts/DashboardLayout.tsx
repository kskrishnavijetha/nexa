
import React from 'react';
import { Outlet } from 'react-router-dom';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default DashboardLayout;
