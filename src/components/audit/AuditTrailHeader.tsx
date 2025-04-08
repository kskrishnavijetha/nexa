
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Download, FileText } from 'lucide-react';
import { useAuditTrail } from './AuditTrailProvider';
import { formatTimestamp } from './auditUtils';
import AuditExportMenu from './AuditExportMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuditTrailHeaderProps {
  documentName: string;
}

const AuditTrailHeader: React.FC<AuditTrailHeaderProps> = ({ documentName }) => {
  const { auditEvents, isGeneratingReport, downloadAuditReport, exportAuditLogs } = useAuditTrail();
  const lastActivityTimestamp = auditEvents.length > 0 ? auditEvents[0].timestamp : null;

  return (
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div>
        <CardTitle className="text-xl font-semibold">{documentName}</CardTitle>
        <CardDescription>
          Audit trail {lastActivityTimestamp ? `• Last activity ${formatTimestamp(lastActivityTimestamp)}` : ''}
        </CardDescription>
      </div>
      <div className="flex items-center space-x-2">
        <AuditExportMenu label="Export Logs" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="sm" className="flex gap-2 items-center" disabled={isGeneratingReport}>
              <FileText className="h-4 w-4" />
              {isGeneratingReport ? 'Generating...' : 'Download Reports'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Report Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={downloadAuditReport}>
              Full Audit Trail Report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportAuditLogs('pdf')}>
              Audit Logs Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
  );
};

export default AuditTrailHeader;
