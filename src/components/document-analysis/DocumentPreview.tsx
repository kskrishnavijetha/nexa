
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ComplianceReport, PredictiveAnalysis } from '@/utils/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ComplianceDisclaimer from '@/components/report/ComplianceDisclaimer';
import SimulationCharts from '@/components/history/SimulationCharts';
import ComplianceCharts from '@/components/ComplianceCharts';
import { BarChart3 } from 'lucide-react';

interface DocumentPreviewProps {
  report: ComplianceReport | null;
  isOpen: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  report, 
  isOpen, 
  onClose,
  footer
}) => {
  if (!report) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    if (score >= 50) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Extract simulation data if the report is a simulation
  const simulationData: PredictiveAnalysis | null = report.isSimulation ? {
    scenarioId: report.simulationDetails?.scenarioId || '',
    scenarioName: report.simulationDetails?.scenarioName || '',
    scenarioDescription: '',
    industry: report.industry,
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{report.documentName}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">
              Date: {new Date(report.timestamp || '').toLocaleDateString()}
            </span>
            <Badge variant="outline" className={getScoreColor(report.overallScore)}>
              Overall Score: {report.overallScore}%
            </Badge>
            {report.isSimulation && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 flex items-center gap-1">
                <BarChart3 className="h-3 w-3" /> Simulation
              </Badge>
            )}
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 mt-4">
          <div className="space-y-6 text-left p-1">
            {/* Document Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Document Summary</h3>
              <p className="text-gray-700">{report.summary}</p>
            </div>
            
            <Separator />
            
            {/* Simulation Info */}
            {report.isSimulation && report.simulationDetails && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h3 className="text-blue-800 font-medium flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Simulation Details
                  </h3>
                  <p className="text-blue-600 mt-1 text-sm">
                    Type: {report.simulationDetails.simulationType}
                  </p>
                  <p className="text-blue-600 mt-1 text-sm">
                    Based on: {report.simulationDetails.baseDocumentName}
                  </p>
                  <p className="text-sm text-blue-500 mt-2">
                    Analysis date: {new Date(report.simulationDetails.analysisDate).toLocaleString()}
                  </p>
                </div>
                <Separator />
              </>
            )}
            
            {/* Compliance Scores */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Compliance Scores</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">GDPR</div>
                  <div className={`text-lg font-semibold ${report.gdprScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {report.gdprScore}%
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">HIPAA</div>
                  <div className={`text-lg font-semibold ${report.hipaaScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {report.hipaaScore}%
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">SOC2</div>
                  <div className={`text-lg font-semibold ${report.soc2Score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {report.soc2Score}%
                  </div>
                </div>
                {report.pciDssScore && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">PCI DSS</div>
                    <div className={`text-lg font-semibold ${report.pciDssScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                      {report.pciDssScore}%
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            {/* Charts Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Visualization</h3>
              
              {/* Show simulation charts if it's a simulation */}
              {report.isSimulation && simulationData && (
                <SimulationCharts analysis={simulationData} />
              )}
              
              {/* Show standard compliance charts for regular reports */}
              {!report.isSimulation && (
                <ComplianceCharts report={report} />
              )}
            </div>
            
            <Separator />
            
            {/* Compliance Issues */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Compliance Issues</h3>
              <div className="space-y-3">
                {report.risks.length > 0 ? (
                  report.risks.map((risk, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <Badge className={getSeverityColor(risk.severity)}>
                          {risk.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-500">{risk.regulation}</span>
                      </div>
                      <p className="text-gray-700">{risk.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No compliance issues detected.</p>
                )}
              </div>
            </div>
            
            {/* Improvement Suggestions */}
            {report.suggestions && report.suggestions.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Improvement Suggestions</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {report.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-gray-700">{suggestion.description}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            
            {/* Recommendations for simulations */}
            {report.isSimulation && report.recommendations && report.recommendations.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {report.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-gray-700">{recommendation}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            
            {/* Nexabloom Branding */}
            <Separator />
            <div className="py-2 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
              <ComplianceDisclaimer compact={true} />
              <div className="flex items-center gap-1">
                <span>Powered by</span>
                <a 
                  href="https://nexabloom.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
                >
                  Nexabloom
                </a>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        {footer && (
          <DialogFooter>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
