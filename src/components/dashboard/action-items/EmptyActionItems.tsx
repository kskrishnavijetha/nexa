
import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ComplianceReport } from '@/utils/types';

interface EmptyActionItemsProps {
  selectedReport?: ComplianceReport | null;
}

const EmptyActionItems: React.FC<EmptyActionItemsProps> = ({ selectedReport }) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-4">
        <ClipboardCheck className="h-12 w-12 text-gray-300" />
      </div>
      
      <h3 className="text-lg font-medium mb-2">No Action Items</h3>
      
      {selectedReport ? (
        <p className="text-muted-foreground mb-4">
          No action items are currently identified for {selectedReport.documentName}.
        </p>
      ) : (
        <p className="text-muted-foreground mb-4">
          No action items are currently identified based on your documents.
        </p>
      )}
      
      <Button variant="outline" onClick={() => navigate('/document-analysis')}>
        Run New Compliance Scan
      </Button>
    </div>
  );
};

export default EmptyActionItems;
