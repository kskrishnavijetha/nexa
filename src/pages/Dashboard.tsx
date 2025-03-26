
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComplianceReport } from '@/utils/types';
import { mockScans } from '@/utils/historyMocks';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ComplianceScanTable from '@/components/dashboard/ComplianceScanTable';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { generateReportPDF } from '@/utils/reportService';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Define the function before it's used
  const getWorstRiskLevel = (scan: ComplianceReport): string => {
    if (scan.risks.some(risk => risk.severity === 'high')) return 'high';
    if (scan.risks.some(risk => risk.severity === 'medium')) return 'medium';
    if (scan.risks.some(risk => risk.severity === 'low')) return 'low';
    return 'low';
  };

  const filteredScans = mockScans.filter(scan => {
    if (riskFilter === 'all') return true;
    const worstRiskLevel = getWorstRiskLevel(scan);
    return worstRiskLevel === riskFilter.toLowerCase();
  });

  const handlePreviewReport = (report: ComplianceReport) => {
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="px-2 py-4">
              <h2 className="font-semibold text-xl">Compliance Hub</h2>
              <p className="text-sm text-muted-foreground">Document Analysis Platform</p>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/history">History</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/document-analysis">New Analysis</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6 text-left">Compliance Dashboard</h1>
          
          <DashboardHeader
            riskFilter={riskFilter}
            setRiskFilter={setRiskFilter}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Compliance Scan Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ComplianceScanTable 
                scans={filteredScans} 
                onPreview={handlePreviewReport} 
              />
            </CardContent>
          </Card>

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
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
