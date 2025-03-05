
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const User = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <p className="text-muted-foreground">View your compliance status and reports</p>
        </div>
        
        <Dashboard />
      </div>
    </div>
  );
};

export default User;
