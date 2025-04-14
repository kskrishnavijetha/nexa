
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Upload, FileCheck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AuditEvent } from '@/components/audit/types';
import { getReportFromHistory } from '@/utils/historyService';
import { ReportConfigForm } from './ReportConfigForm';
import { ExtendedReport, ReportConfig } from './types';
import { generateExtendedReport } from '@/utils/audit/extendedReportGenerator';
import ReportPreview from './ReportPreview';
import { ComplianceReport } from '@/utils/types';

interface ReportGeneratorProps {
  documentId?: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ documentId }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('config');
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [config, setConfig] = useState<ReportConfig>({
    organizationName: '',
    complianceTypes: ['GDPR'],
    includeSignature: true,
    includeAppendix: true,
    logoUrl: '',
    contactInfo: '',
    reportTitle: 'Extended Audit-Ready Compliance Report',
    reportVersion: '1.0',
  });
  const [extendedReport, setExtendedReport] = useState<ExtendedReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (documentId) {
      // Load the base report from history
      const loadedReport = getReportFromHistory(documentId);
      if (loadedReport) {
        setReport(loadedReport);
        
        // Pre-fill organization name if available
        if (loadedReport.organization) {
          setConfig(prev => ({
            ...prev,
            organizationName: loadedReport.organization || '',
          }));
        }
        
        // Pre-fill compliance types based on report regulations
        if (loadedReport.regulations && loadedReport.regulations.length > 0) {
          setConfig(prev => ({
            ...prev,
            complianceTypes: loadedReport.regulations,
          }));
        }
        
        // Fetch audit events for this document ID
        fetchAuditEvents(loadedReport.documentName);
      } else {
        toast.error("Report not found");
        navigate('/history');
      }
    }
  }, [documentId, navigate]);

  // Simulated function to fetch audit events - in a real app, this would come from your backend
  const fetchAuditEvents = (documentName: string) => {
    import('@/components/audit/hooks/mockAuditData').then(({ generateMockAuditTrail }) => {
      const events = generateMockAuditTrail(documentName);
      setAuditEvents(events);
    });
  };

  const handleGenerate = async () => {
    if (!report) return;

    setIsGenerating(true);
    try {
      // Call the extended report generation utility
      const generatedReport = await generateExtendedReport(report, auditEvents, config);
      setExtendedReport(generatedReport);
      setActiveTab('preview');
      toast.success("Extended Audit Report generated successfully");
    } catch (error) {
      console.error("Failed to generate extended report:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!extendedReport || !extendedReport.pdfBlob) {
      toast.error("Report not ready for download");
      return;
    }

    try {
      // Create a download link for the PDF
      const url = window.URL.createObjectURL(extendedReport.pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${config.organizationName}-Audit-Report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Failed to download report:", error);
      toast.error("Download failed");
    }
  };

  const handleConfigChange = (newConfig: ReportConfig) => {
    setConfig(newConfig);
  };

  const handleBackToHistory = () => {
    navigate('/history');
  };

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Extended Audit-Ready Report</CardTitle>
            <p className="text-muted-foreground mt-1">
              Generate a comprehensive compliance report for {report?.documentName || 'your document'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleBackToHistory}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="config">Configure Report</TabsTrigger>
            <TabsTrigger value="preview" disabled={!extendedReport}>Report Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config" className="mt-6">
            {report && (
              <ReportConfigForm 
                config={config}
                onChange={handleConfigChange}
                report={report}
              />
            )}
          </TabsContent>
          
          <TabsContent value="preview" className="mt-6">
            {extendedReport && <ReportPreview report={extendedReport} />}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between border-t p-6">
        <div className="text-sm text-muted-foreground">
          <FileCheck className="inline-block mr-1 h-4 w-4" />
          {auditEvents.length} audit events included
        </div>
        
        <div className="flex space-x-2">
          {activeTab === 'config' ? (
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !config.organizationName}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileCheck className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleDownload} disabled={!extendedReport?.pdfBlob}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReportGenerator;
