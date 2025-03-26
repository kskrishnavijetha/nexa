
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComplianceReport } from '@/utils/types';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ComplianceScanTable from '@/components/dashboard/ComplianceScanTable';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import { generateReportPDF } from '@/utils/reportService';
import { toast } from 'sonner';

// Sample initial compliance data
const initialScanResults: ComplianceReport[] = [
  {
    id: '1',
    documentId: '1',
    documentName: 'Privacy Policy',
    timestamp: new Date().toISOString(),
    overallScore: 87,
    gdprScore: 92,
    hipaaScore: 85,
    soc2Score: 90,
    risks: [
      { id: '101', description: 'Data retention policy needs review', severity: 'medium', regulation: 'GDPR' },
    ],
    summary: 'This document is generally compliant with minor improvements needed',
  },
  {
    id: '2',
    documentId: '2',
    documentName: 'Data Processing Agreement',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    overallScore: 72,
    gdprScore: 68,
    hipaaScore: 75,
    soc2Score: 78,
    risks: [
      { id: '201', description: 'Insufficient data subject rights details', severity: 'high', regulation: 'GDPR' },
      { id: '202', description: 'Access control provisions need enhancement', severity: 'medium', regulation: 'SOC 2' },
    ],
    summary: 'Several compliance gaps identified requiring attention',
  },
];

const Dashboard: React.FC = () => {
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [scans, setScans] = useState<ComplianceReport[]>(initialScanResults);

  // Define the function to get worst risk level for filtering
  const getWorstRiskLevel = (scan: ComplianceReport): string => {
    if (scan.risks.some(risk => risk.severity === 'high')) return 'high';
    if (scan.risks.some(risk => risk.severity === 'medium')) return 'medium';
    if (scan.risks.some(risk => risk.severity === 'low')) return 'low';
    return 'low';
  };

  const filteredScans = scans.filter(scan => {
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
    <div className="p-6">
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
  );
};

export default Dashboard;
