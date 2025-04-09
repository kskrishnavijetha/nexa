
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Clock } from 'lucide-react';
import { useAuditTrail } from './AuditTrailProvider';
import IntegrityVerification from './IntegrityVerification';

interface AuditTrailHeaderProps {
  documentName: string;
}

const AuditTrailHeader: React.FC<AuditTrailHeaderProps> = ({ documentName }) => {
  const { 
    isGeneratingReport, 
    isGeneratingLogs, 
    downloadAuditReport, 
    downloadAuditLogs,
    verificationCode
  } = useAuditTrail();

  return (
    <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="space-y-1">
        <CardTitle className="text-xl font-semibold">{documentName}</CardTitle>
        <div className="text-sm text-muted-foreground flex items-center">
          <Clock className="h-4 w-4 mr-1" /> Audit Trail
          {verificationCode && (
            <div className="ml-3">
              <IntegrityVerification verificationCode={verificationCode} compact />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={downloadAuditLogs}
          disabled={isGeneratingLogs}
        >
          {isGeneratingLogs ? (
            <div className="animate-spin">⚙️</div>
          ) : (
            <FileText className="h-4 w-4" />
          )}
          Download Logs
        </Button>
        
        <Button 
          size="sm"
          className="flex items-center gap-2"
          onClick={downloadAuditReport}
          disabled={isGeneratingReport}
        >
          {isGeneratingReport ? (
            <div className="animate-spin">⚙️</div>
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download Report
        </Button>
      </div>
    </CardHeader>
  );
};

export default AuditTrailHeader;
