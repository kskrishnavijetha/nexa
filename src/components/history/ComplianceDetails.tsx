
import React from 'react';
import { ComplianceReport } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ComplianceScores from '@/components/report/ComplianceScores';
import ComplianceCharts from '@/components/report/ComplianceCharts';
import RiskAnalysis from '@/components/RiskAnalysis';
import { Button } from '@/components/ui/button';
import { FileText, Download, ClipboardList, ArrowRight } from 'lucide-react';
import { generateReportPDF } from '@/utils/apiService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ComplianceDetailsProps {
  report: ComplianceReport;
}

const ComplianceDetails: React.FC<ComplianceDetailsProps> = ({ report }) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleDownloadReport = async () => {
    setIsGenerating(true);
    try {
      const response = await generateReportPDF(report);
      
      if (response.data) {
        const url = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `compliance-report-${report.documentId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('Report downloaded successfully');
      } else {
        toast.error('Failed to generate PDF report');
      }
    } catch (error) {
      console.error('Failed to download report:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateExtendedReport = () => {
    navigate(`/extended-audit-report/${report.documentId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <ComplianceScores report={report} />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="compliance-charts-container">
                <ComplianceCharts report={report} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full">
          <RiskAnalysis risks={report.risks || []} />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={handleDownloadReport}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <FileText className="h-4 w-4" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download Report PDF
            </>
          )}
        </Button>
        
        <Button
          variant="default"
          size="lg"
          className="gap-2 bg-[#1A8DE0] hover:bg-[#0E6CBD]"
          onClick={handleCreateExtendedReport}
        >
          <ClipboardList className="h-4 w-4" />
          Create Extended Audit-Ready Report
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ComplianceDetails;
