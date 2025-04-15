
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const SecurityNotice: React.FC = () => {
  return (
    <Alert className="bg-slate-50 border-slate-200">
      <AlertDescription className="flex items-start">
        <Info className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
        <span className="text-sm">
          NexaBloom uses cryptographic SHA-256 hashing to verify document integrity. 
          A matching hash confirms the document is unchanged since it was first generated.
          This verification process ensures the authenticity and reliability of your compliance documents.
        </span>
      </AlertDescription>
    </Alert>
  );
};

export default SecurityNotice;
