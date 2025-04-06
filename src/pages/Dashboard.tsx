
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComplianceReport } from '@/utils/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { generateReportPDF } from '@/utils/reportService';
import { toast } from 'sonner';
import { getHistoricalReports, deleteReportFromHistory } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentScansList from '@/components/dashboard/RecentScansList';
import ComplianceScoreChart from '@/components/dashboard/ComplianceScoreChart';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [scans, setScans] = useState<ComplianceReport[]>([]);
  const { user } = useAuth();

  const loadReports = () => {
    // Load reports from history service
    const historicalReports = getHistoricalReports();
    console.log('Dashboard loaded reports (total):', historicalReports.length);
    
    // Filter reports by current user's ID
    const userReports = user ? historicalReports.filter(report => report.userId === user.id) : [];
    console.log(`Filtered reports for user ${user?.id}:`, userReports.length);
    
    setScans(userReports);
  };

  useEffect(() => {
    loadReports();
  }, [user]);

  const handlePreviewReport = (report: ComplianceReport) => {
    console.log('Previewing report:', report.documentName);
    setSelectedReport(report);
    setPreviewOpen(true);
  };

  const handleDownloadReport = async () => {
    if (!selectedReport) return;
    
    setIsGeneratingPDF(true);
    try {
      const result = await generateReportPDF(selectedReport);
      if (result.data) {
        // Create a URL for the blob
        const url = URL.createObjectURL(result.data);
        
        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedReport.documentName.replace(/\s+/g, '_')}_compliance_report.pdf`;
        
        // Append to the document, click it, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Release the object URL
        URL.revokeObjectURL(url);
        
        toast.success('Report downloaded successfully');
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to generate the PDF report');
      console.error('Download error:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDocumentDeleted = (documentId: string) => {
    if (user) {
      const deleted = deleteReportFromHistory(documentId, user.id);
      if (deleted) {
        toast.success(`Document has been deleted from dashboard`);
        // Refresh reports list
        loadReports();
      } else {
        toast.error("Failed to delete document");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-left">Compliance Dashboard</h1>
      
      <Tabs 
        defaultValue="overview" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <DashboardStats />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Recent Scans</h2>
                <p className="text-sm text-muted-foreground mb-6">Your latest document compliance scans</p>
                
                <RecentScansList 
                  scans={scans.slice(0, 5)} 
                  onPreview={handlePreviewReport}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Compliance Score</h2>
                <p className="text-sm text-muted-foreground mb-6">Your compliance score over time</p>
                
                <ComplianceScoreChart scans={scans} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <h2 className="text-xl font-semibold mb-4">Compliance Details</h2>
          <p className="text-muted-foreground mb-6">
            View detailed compliance information across different regulations and standards.
          </p>
          {/* Compliance content will be implemented in future updates */}
        </TabsContent>

        <TabsContent value="risks">
          <h2 className="text-xl font-semibold mb-4">Risk Analysis</h2>
          <p className="text-muted-foreground mb-6">
            View detailed risk assessment and vulnerability reports.
          </p>
          {/* Risks content will be implemented in future updates */}
        </TabsContent>

        <TabsContent value="actions">
          <h2 className="text-xl font-semibold mb-4">Recommended Actions</h2>
          <p className="text-muted-foreground mb-6">
            View and manage recommended actions to improve compliance.
          </p>
          {/* Actions content will be implemented in future updates */}
        </TabsContent>
      </Tabs>

      <DocumentPreview 
        report={selectedReport}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        footer={
          selectedReport && (
            <div className="flex justify-end mt-4">
              <Button 
                onClick={handleDownloadReport}
                disabled={isGeneratingPDF}
                className="flex items-center"
              >
                {isGeneratingPDF ? (
                  <span className="mr-2 animate-spin">⏳</span>
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isGeneratingPDF ? 'Generating PDF...' : 'Download Audit Report'}
              </Button>
            </div>
          )
        }
      />
    </div>
  );
};

export default Dashboard;
