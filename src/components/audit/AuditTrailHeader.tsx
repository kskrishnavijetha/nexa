
import React, { useEffect, useState } from 'react';
import { CardHeader } from '@/components/ui/card';
import { useAuditTrail } from './AuditTrailProvider';
import { exportAuditLogs, ExportFormat } from '@/utils/audit/exportLogs';
import { verifyLogIntegrity } from '@/utils/audit/logIntegrity';
import { toast } from 'sonner';
import { 
  HeaderTitle, 
  HeaderDescription, 
  ActionButtons 
} from './header';

interface AuditTrailHeaderProps {
  documentName: string;
}

const AuditTrailHeader: React.FC<AuditTrailHeaderProps> = ({ documentName }) => {
  const { auditEvents, isGeneratingReport, downloadAuditReport, setLastActivity, industry } = useAuditTrail();
  const [integrityVerified, setIntegrityVerified] = useState<boolean | null>(null);

  useEffect(() => {
    // Verify log integrity whenever audit events change
    const checkIntegrity = async () => {
      if (auditEvents.length > 0) {
        const isVerified = await verifyLogIntegrity(auditEvents);
        setIntegrityVerified(isVerified);
      }
    };
    
    checkIntegrity();
  }, [auditEvents]);

  const handleRefresh = () => {
    // Just update the last activity timestamp to trigger new events
    // without reloading the page or clearing existing events
    setLastActivity(new Date());
  };

  // Calculate compliance score based on audit events
  const calculateComplianceScore = (): number => {
    if (auditEvents.length === 0) return 100;
    
    const completedEvents = auditEvents.filter(event => event.status === 'completed').length;
    const totalEvents = auditEvents.length;
    
    return Math.round((completedEvents / totalEvents) * 100);
  };

  const handleExport = async (format: ExportFormat) => {
    try {
      await exportAuditLogs(auditEvents, documentName, format);
      toast.success(`Audit logs exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      console.error(`Error exporting audit logs as ${format}:`, error);
      toast.error(`Failed to export audit logs. Please try again.`);
    }
  };

  const complianceScore = calculateComplianceScore();
  const completedEvents = auditEvents.filter(event => event.status === 'completed').length;

  return (
    <CardHeader className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center md:space-y-0">
      <div>
        <HeaderTitle 
          complianceScore={complianceScore} 
          totalEvents={auditEvents.length}
          completedEvents={completedEvents}
          integrityVerified={integrityVerified}
        />
        <HeaderDescription 
          documentName={documentName} 
          industry={industry}
          eventCount={auditEvents.length}
        />
      </div>
      
      <ActionButtons 
        handleRefresh={handleRefresh}
        handleExport={handleExport}
        downloadAuditReport={downloadAuditReport}
        isGeneratingReport={isGeneratingReport}
      />
    </CardHeader>
  );
};

export default AuditTrailHeader;
