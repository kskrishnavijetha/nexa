
import React, { useState } from 'react';
import { ComplianceReport } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ComplianceScoreCards from './ComplianceScoreCards';
import RiskAnalysis from '@/components/RiskAnalysis';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { generateReportPDF } from '@/utils/reportService';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';

interface ComplianceDetailsProps {
  report: ComplianceReport;
}

const ComplianceDetails: React.FC<ComplianceDetailsProps> = ({ report }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Report Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please select a document to view details</p>
        </CardContent>
      </Card>
    );
  }

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      const response = await generateReportPDF(report, 'en');
      
      if (response.error) {
        toast.error(response.error);
        return;
      }
      
      // Create a download link
      const url = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.documentName.replace(/\s+/g, '-').toLowerCase()}-compliance-report.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download the report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{report.documentName}</span>
          <span className={
            report.overallScore >= 80 ? 'text-green-500' : 
            report.overallScore >= 70 ? 'text-amber-500' : 
            'text-red-500'
          }>
            {report.overallScore}%
          </span>
        </CardTitle>
        <div className="flex justify-end gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" /> Preview
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" /> 
            {isDownloading ? 'Downloading...' : 'Download Report'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{report.summary}</p>
        <ComplianceScoreCards 
          gdprScore={report.gdprScore}
          hipaaScore={report.hipaaScore}
          soc2Score={report.soc2Score}
        />
        <RiskAnalysis risks={report.risks} />
      </CardContent>
      
      <DocumentPreview 
        report={report}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </Card>
  );
};

export default ComplianceDetails;
