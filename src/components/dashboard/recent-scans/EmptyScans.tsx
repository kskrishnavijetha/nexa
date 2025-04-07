
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const EmptyScans: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-6 text-muted-foreground">
      <p>No scan history available yet.</p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2"
        onClick={() => navigate('/document-analysis')}
      >
        Perform your first scan
      </Button>
    </div>
  );
};

export default EmptyScans;
