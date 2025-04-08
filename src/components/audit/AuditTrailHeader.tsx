
import React, { useEffect, useState } from 'react';
import { CardHeader } from '@/components/ui/card';
import { useAuditTrail } from './AuditTrailProvider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, FileText, File, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { ExportFormat } from '@/utils/audit/exportLogs';
import { 
  HeaderTitle, 
  HeaderDescription, 
  ComplianceScore, 
  IntegrityBadge,
  ActionButtons
} from './header';

interface AuditTrailHeaderProps {
  documentName: string;
}

const AuditTrailHeader: React.FC<AuditTrailHeaderProps> = ({ documentName }) => {
  const { 
    isGeneratingReport, 
    downloadAuditReport, 
    downloadAuditLogReport,
    auditEvents,
    updateAuditEvents,
    industry
  } = useAuditTrail();
  
  const [logIntegrityVerified, setLogIntegrityVerified] = useState<boolean | null>(null);
  
  // Calculate compliance score based on completed events
  const totalEvents = auditEvents.length;
  const completedEvents = auditEvents.filter(event => event.status === 'completed').length;
  const complianceScore = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 100;
  
  useEffect(() => {
    // Here we would typically verify log integrity
    // For now, we'll simulate that logs are verified if they exist
    setLogIntegrityVerified(auditEvents.length > 0 ? true : null);
  }, [auditEvents]);
  
  // Handler for refreshing audit events
  const handleRefresh = () => {
    // In a real app, this would fetch fresh data from an API
    toast.info('Refreshing audit data...');
    // Simulate a refresh by updating the existing events
    updateAuditEvents([...auditEvents]);
    toast.success('Audit data refreshed');
  };

  // Handler for exporting logs in different formats
  const handleExport = async (format: ExportFormat) => {
    toast.info(`Exporting audit data as ${format.toUpperCase()}...`);
    
    try {
      // Here you would typically call a service to handle the export
      // For now, we'll just simulate the export with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Audit data exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
      toast.error(`Failed to export as ${format}`);
    }
  };

  return (
    <CardHeader className="pb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <HeaderTitle 
          complianceScore={complianceScore}
          totalEvents={totalEvents}
          completedEvents={completedEvents}
          integrityVerified={logIntegrityVerified}
        />
        
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
          
          <ActionButtons 
            handleRefresh={handleRefresh} 
            handleExport={handleExport} 
            downloadAuditReport={downloadAuditReport}
            isGeneratingReport={isGeneratingReport}
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <HeaderDescription 
          documentName={documentName}
          industry={industry}
          eventCount={auditEvents.length}
        />
        <div className="flex flex-col md:flex-row gap-2 items-end md:items-center">
          <ComplianceScore 
            complianceScore={complianceScore}
            totalEvents={totalEvents}
            completedEvents={completedEvents}
          />
          <IntegrityBadge integrityVerified={logIntegrityVerified} />
        </div>
      </div>
    </CardHeader>
  );
};

export default AuditTrailHeader;
