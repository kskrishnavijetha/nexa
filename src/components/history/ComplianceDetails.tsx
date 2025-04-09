
import React, { useState } from 'react';
import { ComplianceReport } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ComplianceScoreCards from './ComplianceScoreCards';
import RiskAnalysis from '@/components/RiskAnalysis';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { generateReportPDF } from '@/utils/reports';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ComplianceDetailsProps {
  report: ComplianceReport;
  verificationCode?: string | null;
}

const ComplianceDetails: React.FC<ComplianceDetailsProps> = ({ report, verificationCode }) => {
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
            <div className="flex items-center gap-2">
              <span>{report.documentName}</span>
              {verificationCode && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-flex items-center text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <Shield className="h-3 w-3 mr-1" />
                        <span>Verified</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm max-w-xs">
                        This document includes tamper-proof cryptographic verification for compliance with regulated industry requirements.<br/>
                        <span className="text-xs font-mono mt-1 block">{verificationCode}</span>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
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
                  Download
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
        
        {verificationCode && (
          <div className="mb-4 p-2 bg-green-50 border border-green-100 rounded-md flex items-center">
            <Shield className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Tamper-proof verification active
              </p>
              <p className="text-xs text-green-700">
                This document uses cryptographic verification suitable for regulated industries.
              </p>
            </div>
          </div>
        )}
        
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
        verificationCode={verificationCode}
      />
    </Card>
  );
};

export default ComplianceDetails;
