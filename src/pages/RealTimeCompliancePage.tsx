
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import RealTimeComplianceDemo from '@/components/compliance/RealTimeComplianceDemo';

const RealTimeCompliancePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Real-time Compliance Advisor</h1>
          <p className="text-muted-foreground">
            Continuously monitor content for compliance issues and receive real-time suggestions
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      
      <RealTimeComplianceDemo />
    </div>
  );
};

export default RealTimeCompliancePage;
