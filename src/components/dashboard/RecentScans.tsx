
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getUserHistoricalReports } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import { ComplianceReport } from '@/utils/types';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import { useSelectedReport } from './context/SelectedReportContext';
import AllScansSheet from './recent-scans/AllScansSheet';
import ScanItem from './recent-scans/ScanItem';
import EmptyScans from './recent-scans/EmptyScans';
import { Sheet } from '@/components/ui/sheet';

// Export the provider from the context file
export { SelectedReportProvider } from './context/SelectedReportContext';
export { useSelectedReport } from './context/SelectedReportContext';

const RecentScans = () => {
  const { user } = useAuth();
  const [recentScans, setRecentScans] = useState<ComplianceReport[]>([]);
  const [allScans, setAllScans] = useState<ComplianceReport[]>([]);
  const { setSelectedReport } = useSelectedReport();
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [currentPreviewReport, setCurrentPreviewReport] = useState<ComplianceReport | null>(null);
  const [showAllScans, setShowAllScans] = useState<boolean>(false);
  const [showActionItems, setShowActionItems] = useState<boolean>(false);
  
  useEffect(() => {
    const loadRecentScans = () => {
      if (user?.id) {
        // Get user's historical reports
        const userReports = getUserHistoricalReports(user.id);
        
        // Sort by timestamp (most recent first)
        const sortedReports = [...userReports].sort((a, b) => {
          const dateA = new Date(a.timestamp || '').getTime();
          const dateB = new Date(b.timestamp || '').getTime();
          return dateB - dateA;
        });

        // Set recent scans (top 3)
        setRecentScans(sortedReports.slice(0, 3));
        
        // Set all scans for the sidebar drawer
        setAllScans(sortedReports);
      }
    };
    
    loadRecentScans();
  }, [user]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toISOString().split('T')[0];
  };
  
  const handleViewClick = (report: ComplianceReport, tabToNavigate: string = 'compliance') => {
    // Set the selected report for the risk summary section
    setSelectedReport(report);
    
    // Store the current report for preview
    setCurrentPreviewReport(report);
    
    // Find the global context to update the selected report
    const dashboardBottomSection = document.getElementById('dashboard-bottom-section');
    if (dashboardBottomSection) {
      // Scroll to the risk summary section
      dashboardBottomSection.scrollIntoView({ behavior: 'smooth' });
      
      // Add a class to highlight the risk summary card
      const riskSummaryCard = dashboardBottomSection.querySelector('.risk-summary-card');
      if (riskSummaryCard) {
        riskSummaryCard.classList.add('highlight-card');
        setTimeout(() => {
          riskSummaryCard.classList.remove('highlight-card');
        }, 2000);
      }
    }
    
    // Also open the preview dialog
    setPreviewOpen(true);

    // Navigate to selected tab to show details
    const tabTrigger = document.querySelector(`[data-value="${tabToNavigate}"]`);
    if (tabTrigger && tabTrigger instanceof HTMLElement) {
      tabTrigger.click();
    }
    
    // Set flag to show action items if we're viewing the actions tab
    setShowActionItems(tabToNavigate === 'actions');
  };

  const handleViewAllClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAllScans(true);
  };

  const handleSelectScan = (report: ComplianceReport, tabToNavigate: string = 'compliance') => {
    setSelectedReport(report);
    setShowAllScans(false);
    
    // Navigate to selected tab to show details
    const tabTrigger = document.querySelector(`[data-value="${tabToNavigate}"]`);
    if (tabTrigger && tabTrigger instanceof HTMLElement) {
      tabTrigger.click();
    }
    
    // Set flag to show action items if we're viewing the actions tab
    setShowActionItems(tabToNavigate === 'actions');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Recent Scans</h3>
        
        <Sheet open={showAllScans} onOpenChange={setShowAllScans}>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleViewAllClick}
          >
            View All
          </Button>
          
          <AllScansSheet 
            isOpen={showAllScans}
            onOpenChange={setShowAllScans}
            scans={allScans}
            onSelectScan={handleSelectScan}
            formatDate={formatDate}
          />
        </Sheet>
      </div>
      
      {recentScans.length > 0 ? (
        recentScans.map((scan) => (
          <ScanItem 
            key={scan.documentId}
            scan={scan}
            onViewClick={handleViewClick}
            formatDate={formatDate}
          />
        ))
      ) : (
        <EmptyScans />
      )}
      
      {/* Document Preview Dialog */}
      <DocumentPreview 
        report={currentPreviewReport} 
        isOpen={previewOpen} 
        onClose={() => {
          setPreviewOpen(false);
          // Don't reset selectedReport so it stays visible in the Risk Summary
        }}
      />
    </div>
  );
};

export default RecentScans;
