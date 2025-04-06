
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.email?.split('@')[0] || 'User'}! Here's an overview of your compliance status.
        </p>
      </div>
      <div className="mt-4 md:mt-0 flex space-x-2">
        <Button 
          variant="outline" 
          onClick={() => navigate('/document-analysis')}
        >
          New Scan
        </Button>
        <Button onClick={() => navigate('/audit-reports')}>
          View Reports
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
