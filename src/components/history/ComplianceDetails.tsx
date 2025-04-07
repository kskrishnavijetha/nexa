
import React, { useState } from 'react';
import { ComplianceReport } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ComplianceScoreCards from './ComplianceScoreCards';
import RiskAnalysis from '@/components/RiskAnalysis';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateReportPDF } from '@/utils/reports';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';

interface ComplianceDetailsProps {
  report: ComplianceReport;
}

const ComplianceDetails: React.FC<ComplianceDetailsProps> = ({ report }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      toast.info(`Preparing download for "${report.documentName}"...`);
      
      // Pass the complete report to ensure all data is available
      const result = await generateReportPDF(report, 'en');
      
      if (result.data) {
        // Create a download link for the PDF
        const url = URL.createObjectURL(result.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.documentName.replace(/\s+/g, '-').toLowerCase()}-compliance-report.pdf`;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        toast.success('Report downloaded successfully');
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download the report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex flex-col">
            <span>{report.documentName}</span>
            {report.industry && (
              <span className="text-sm text-muted-foreground">
                Industry: {report.industry} {report.region && `| Region: ${report.region}`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleDownloadReport}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Report
                </>
              )}
            </Button>
            <span className={
              report.overallScore >= 80 ? 'text-green-500' : 
              report.overallScore >= 70 ? 'text-amber-500' : 
              'text-red-500'
            }>
              {report.overallScore}%
            </span>
          </div>
        </CardTitle>
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

      {/* Document Preview Modal */}
      <DocumentPreview
        report={report}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </Card>
  );
};

export default ComplianceDetails;
