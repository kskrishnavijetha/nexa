
import React, { useState } from 'react';
import { ComplianceReport, PredictiveAnalysis } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ComplianceScoreCards from './ComplianceScoreCards';
import RiskAnalysis from '@/components/RiskAnalysis';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import { generateReportPDF } from '@/utils/reports';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import ComplianceCharts from '@/components/ComplianceCharts';
import SimulationCharts from './SimulationCharts';

interface ComplianceDetailsProps {
  report: ComplianceReport;
}

const ComplianceDetails: React.FC<ComplianceDetailsProps> = ({ report }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Extract simulation data if the report is a simulation
  const simulationData: PredictiveAnalysis | null = report.isSimulation ? {
    scenarioId: report.simulationDetails?.scenarioId || '',
    scenarioName: report.simulationDetails?.scenarioName || '',
    scenarioDescription: '',
    industry: report.industry,
    // Using scores from the report
    originalScores: {
      overall: report.overallScore - (report.simulationDetails?.predictedImprovements?.overall || 0),
      gdpr: report.gdprScore - (report.simulationDetails?.predictedImprovements?.gdpr || 0),
      hipaa: report.hipaaScore - (report.simulationDetails?.predictedImprovements?.hipaa || 0),
      soc2: report.soc2Score - (report.simulationDetails?.predictedImprovements?.soc2 || 0),
      pciDss: report.pciDssScore ? (report.pciDssScore - (report.simulationDetails?.predictedImprovements?.pciDss || 0)) : undefined
    },
    predictedScores: {
      overall: report.overallScore,
      gdpr: report.gdprScore,
      hipaa: report.hipaaScore,
      soc2: report.soc2Score,
      pciDss: report.pciDssScore
    },
    scoreDifferences: report.simulationDetails?.predictedImprovements,
    riskTrends: report.risks.map(risk => ({
      regulation: risk.regulation || 'Unknown',
      description: risk.description,
      trend: 'decrease' as const,
      impact: 'medium' as const,
      currentSeverity: risk.severity,
      riskId: risk.id
    })),
    recommendations: report.recommendations || []
  } : null;
  
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
        
        {/* Show simulation notice if it's a simulation */}
        {report.isSimulation && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <h3 className="text-blue-800 font-medium flex items-center">
              <BarChart className="h-4 w-4 mr-2" />
              Simulation: {report.simulationDetails?.scenarioName}
            </h3>
            <p className="text-blue-600 mt-1 text-sm">
              This is a predictive simulation based on document: {report.simulationDetails?.baseDocumentName || "Unknown"}
            </p>
            <p className="text-sm text-blue-500 mt-2">
              Analysis date: {new Date(report.simulationDetails?.analysisDate || '').toLocaleString()}
            </p>
          </div>
        )}
        
        <ComplianceScoreCards 
          gdprScore={report.gdprScore}
          hipaaScore={report.hipaaScore}
          soc2Score={report.soc2Score}
        />
        
        {/* Show simulation charts if it's a simulation */}
        {report.isSimulation && simulationData && (
          <div className="mb-6 mt-6">
            <h3 className="text-lg font-medium mb-4">Simulation Analysis</h3>
            <SimulationCharts analysis={simulationData} />
          </div>
        )}
        
        {/* Show standard compliance charts for regular reports */}
        {!report.isSimulation && (
          <div className="mb-6 mt-6">
            <ComplianceCharts report={report} />
          </div>
        )}
        
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
