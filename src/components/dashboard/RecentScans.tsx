
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getUserHistoricalReports } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import { ComplianceReport } from '@/utils/types';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';

const RecentScans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentScans, setRecentScans] = useState<ComplianceReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  
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
    setSelectedReport(report);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-4">
      {recentScans.length > 0 ? (
        recentScans.map((scan) => (
          <div 
            key={scan.documentId}
            className="flex justify-between items-center p-3 border rounded-md hover:bg-slate-50"
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
        report={selectedReport} 
        isOpen={previewOpen} 
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
};

export default RecentScans;
