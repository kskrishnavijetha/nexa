
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getUserHistoricalReports } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import { ComplianceReport } from '@/utils/types';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import { Eye, ChevronRight } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Create a context to manage the selected report
const SelectedReportContext = React.createContext<{
  selectedReport: ComplianceReport | null;
  setSelectedReport: React.Dispatch<React.SetStateAction<ComplianceReport | null>>;
}>({
  selectedReport: null,
  setSelectedReport: () => {},
});

// Custom hook to use the selected report context
export const useSelectedReport = () => useContext(SelectedReportContext);

// Provider component
export const SelectedReportProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  
  return (
    <SelectedReportContext.Provider value={{ selectedReport, setSelectedReport }}>
      {children}
    </SelectedReportContext.Provider>
  );
};

const RecentScans = () => {
  const navigate = useNavigate();
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
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleViewAllClick}
            >
              View All
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>All Document Scans</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-2">
              {allScans.length > 0 ? (
                allScans.map((scan) => (
                  <div 
                    key={scan.documentId}
                    className="flex justify-between items-center p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
                    onClick={() => handleSelectScan(scan)}
                  >
                    <div>
                      <p className="font-medium">{scan.documentName}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(scan.timestamp)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <span className={`font-medium ${
                          scan.overallScore >= 90 ? 'text-green-600' : 
                          scan.overallScore >= 75 ? 'text-amber-600' : 
                          'text-red-600'
                        }`}>
                          {scan.overallScore}%
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 h-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectScan(scan, 'actions');
                          }}
                        >
                          Actions
                        </Button>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No scan history available.</p>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {recentScans.length > 0 ? (
        recentScans.map((scan) => (
          <div 
            key={scan.documentId}
            className="flex justify-between items-center p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
            onClick={() => handleViewClick(scan)}
          >
            <div>
              <p className="font-medium">{scan.documentName}</p>
              <p className="text-sm text-muted-foreground">{formatDate(scan.timestamp)}</p>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <span className={`font-medium ${
                  scan.overallScore >= 90 ? 'text-green-600' : 
                  scan.overallScore >= 75 ? 'text-amber-600' : 
                  'text-red-600'
                }`}>
                  {scan.overallScore}%
                </span>
              </div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-primary h-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewClick(scan);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-blue-600 hover:text-blue-800 h-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewClick(scan, 'actions');
                  }}
                >
                  Actions
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <p>No scan history available yet.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => navigate('/document-analysis')}
          >
            Perform your first scan
          </Button>
        </div>
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
