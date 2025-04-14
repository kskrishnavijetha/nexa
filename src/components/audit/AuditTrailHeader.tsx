
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { useAuditTrail } from './context/AuditTrailContext';
import ExtendedReportButton from './ExtendedReportButton';

interface AuditTrailHeaderProps {
  documentName: string;
}

const AuditTrailHeader: React.FC<AuditTrailHeaderProps> = ({ documentName }) => {
  const { 
    downloadAuditReport, 
    downloadAuditLogs, 
    isGeneratingReport, 
    isGeneratingLogs,
    industry
  } = useAuditTrail();

  return (
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-xl font-semibold">Audit Trail: {documentName}</CardTitle>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={downloadAuditLogs}
          disabled={isGeneratingLogs}
          className="flex gap-1.5 items-center"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Audit Logs</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={downloadAuditReport}
          disabled={isGeneratingReport}
          className="flex gap-1.5 items-center"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Report</span>
        </Button>
        
        <ExtendedReportButton documentName={documentName} industry={industry} />
      </div>
    </CardHeader>
  );
};

export default AuditTrailHeader;
