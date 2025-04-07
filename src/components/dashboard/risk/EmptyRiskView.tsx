
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmptyRiskView: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="text-muted-foreground">No risk data available yet</p>
      <p className="text-xs text-muted-foreground mt-2">Perform document scans to see your risk distribution</p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-4"
        onClick={() => navigate('/document-analysis')}
      >
        Scan Documents
      </Button>
    </div>
  );
};

export default EmptyRiskView;
