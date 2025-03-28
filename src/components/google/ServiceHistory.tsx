
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceHistoryTable } from './service-history/ServiceHistoryTable';
import { EmptyState } from './service-history/EmptyState';
import { AuditTrailDialog } from './service-history/AuditTrailDialog';
import { ComplianceReport } from '@/utils/types';

const ServiceHistory: React.FC = () => {
  const { scanHistory, setUserId } = useServiceHistoryStore();
  const { user } = useAuth();
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  
  // Update the user ID in the store when the user changes
  useEffect(() => {
    console.log('ServiceHistory: User changed, updating history store with user ID:', user?.id);
    setUserId(user?.id || null);
  }, [user, setUserId]);
  
  const handleDocumentClick = (document: string, report?: ComplianceReport) => {
    setSelectedDocument(document);
    setSelectedReport(report || null);
    setAuditDialogOpen(true);
  };

  // Render empty state for non-authenticated users
  if (!user) {
    return (
      <EmptyState 
        title="Please sign in to view your history"
        description="Sign in to view and manage your scan history"
      />
    );
  }

  // Render empty state for no scan history
  if (scanHistory.length === 0) {
    return (
      <EmptyState 
        title="No scan history yet"
        description="Connect services and run scans to see your history here"
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Service Scan History - {user.email}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ServiceHistoryTable 
          scanHistory={scanHistory} 
          onDocumentClick={handleDocumentClick} 
        />
      </CardContent>

      {/* Audit Trail Dialog */}
      <AuditTrailDialog
        isOpen={auditDialogOpen}
        onOpenChange={setAuditDialogOpen}
        documentName={selectedDocument}
        report={selectedReport}
      />
    </Card>
  );
};

export default ServiceHistory;
