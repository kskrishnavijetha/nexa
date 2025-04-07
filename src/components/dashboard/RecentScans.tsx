
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getUserHistoricalReports } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import { ComplianceReport } from '@/utils/types';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import { Eye } from 'lucide-react';

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
  const { setSelectedReport } = useSelectedReport();
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [currentPreviewReport, setCurrentPreviewReport] = useState<ComplianceReport | null>(null);
  
  useEffect(() => {
    const loadRecentScans = () => {
      if (user?.id) {
        // Get user's historical reports
        const userReports = getUserHistoricalReports(user.id);
        
        // Sort by timestamp (most recent first) and take top 3
        const sortedReports = [...userReports].sort((a, b) => {
          const dateA = new Date(a.timestamp || '').getTime();
          const dateB = new Date(b.timestamp || '').getTime();
          return dateB - dateA;
        }).slice(0, 3);
        
        setRecentScans(sortedReports);
      }
    };
    
    loadRecentScans();
  }, [user]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toISOString().split('T')[0];
  };
  
  const handleViewClick = (report: ComplianceReport) => {
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
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Recent Scans</h3>
      
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
            <div className="flex items-center">
              <div className="mr-4">
                <span className={`font-medium ${
                  scan.overallScore >= 90 ? 'text-green-600' : 
                  scan.overallScore >= 75 ? 'text-amber-600' : 
                  'text-red-600'
                }`}>
                  {scan.overallScore}%
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewClick(scan);
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
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
      
      {recentScans.length > 0 && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate('/history')}
        >
          View All Scans
        </Button>
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
