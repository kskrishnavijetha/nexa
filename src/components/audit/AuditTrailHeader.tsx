
import React from 'react';
import { CardHeader } from '@/components/ui/card';
import ActionButtons from './header/ActionButtons';
import HeaderTitle from './header/HeaderTitle';
import HeaderDescription from './header/HeaderDescription';
import ComplianceScore from './header/ComplianceScore';
import IntegrityBadge from './header/IntegrityBadge';
import { useAuditTrail } from './AuditTrailProvider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, FileText, File } from 'lucide-react';

interface AuditTrailHeaderProps {
  documentName: string;
}

const AuditTrailHeader: React.FC<AuditTrailHeaderProps> = ({ documentName }) => {
  const { 
    isGeneratingReport, 
    downloadAuditReport, 
    downloadAuditLogReport,
    auditEvents 
  } = useAuditTrail();

  return (
    <CardHeader className="pb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <HeaderTitle documentName={documentName} />
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                disabled={isGeneratingReport || auditEvents.length === 0}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Reports
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={downloadAuditReport} disabled={isGeneratingReport}>
                <FileText className="h-4 w-4 mr-2" />
                Full Audit Trail Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadAuditLogReport} disabled={isGeneratingReport}>
                <File className="h-4 w-4 mr-2" />
                Audit Logs Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ActionButtons />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <HeaderDescription />
        <div className="flex flex-col md:flex-row gap-2 items-end md:items-center">
          <ComplianceScore />
          <IntegrityBadge />
        </div>
      </div>
    </CardHeader>
  );
};

export default AuditTrailHeader;
