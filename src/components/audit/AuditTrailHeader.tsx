
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuditTrail } from './AuditTrailProvider';
import { Download } from 'lucide-react';

interface AuditTrailHeaderProps {
  documentName: string;
}

const AuditTrailHeader: React.FC<AuditTrailHeaderProps> = ({ documentName }) => {
  const { auditEvents, isGeneratingReport, downloadAuditReport } = useAuditTrail();

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Audit Trail</CardTitle>
        <CardDescription>
          {auditEvents.length} event{auditEvents.length !== 1 ? 's' : ''} for {documentName}
        </CardDescription>
      </div>
      
      <Button 
        size="sm" 
        variant="outline" 
        className="ml-auto" 
        onClick={downloadAuditReport}
        disabled={isGeneratingReport || auditEvents.length === 0}
      >
        <Download className="mr-2 h-4 w-4" />
        {isGeneratingReport ? "Generating..." : "Download Report"}
      </Button>
    </CardHeader>
  );
};

export default AuditTrailHeader;
