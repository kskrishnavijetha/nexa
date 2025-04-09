import React from 'react';
import { ComplianceReport, Risk } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Laptop, BarChart2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RealtimeAnalysisSimulatorProps {
  reports: ComplianceReport[];
  onReportsUpdate: (updatedReports: ComplianceReport[]) => void;
  onAnalyzingUpdate: React.Dispatch<React.SetStateAction<string | null>>;
  onLastUpdatedChange: React.Dispatch<React.SetStateAction<Date>>;
  enabled: boolean;
}

const RealtimeAnalysisSimulator: React.FC<RealtimeAnalysisSimulatorProps> = ({
  reports,
  onReportsUpdate,
  onAnalyzingUpdate,
  onLastUpdatedChange,
  enabled
}) => {
  const simulateAnalysis = () => {
    if (!enabled) return;

    onAnalyzingUpdate('Simulating Realtime Analysis...');

    // Simulate a delay to mimic analysis
    setTimeout(() => {
      const newReport: ComplianceReport = {
        id: `report-${Date.now()}`,
        documentId: `report-${Date.now()}`,
        documentName: `Simulated Analysis Report ${new Date().toLocaleString()}`,
        timestamp: new Date().toISOString(),
        date: new Date(), // This is now properly typed in ComplianceReport
        overallScore: Math.floor(Math.random() * (95 - 60 + 1)) + 60,
        gdprScore: Math.floor(Math.random() * (90 - 50 + 1)) + 50,
        hipaaScore: Math.floor(Math.random() * (85 - 55 + 1)) + 55,
        soc2Score: Math.floor(Math.random() * (92 - 62 + 1)) + 62,
        pciDssScore: Math.floor(Math.random() * (88 - 68 + 1)) + 68,
        regionScores: {
          'US': Math.floor(Math.random() * (90 - 70 + 1)) + 70,
          'EU': Math.floor(Math.random() * (95 - 75 + 1)) + 75,
        },
        industry: 'Healthcare',
        risks: generateRandomRisks(),
        recommendations: generateRandomRecommendations(),
        summary: 'Simulated analysis report for demonstration purposes.',
      };

      onReportsUpdate([newReport, ...reports]);
      onAnalyzingUpdate(null);
      onLastUpdatedChange(new Date());
    }, 2000);
  };

  const generateRandomRisks = (): Risk[] => {
    const numRisks = Math.floor(Math.random() * 3) + 1; // Generate 1-3 risks
    const risks: Risk[] = [];

    for (let i = 0; i < numRisks; i++) {
      risks.push({
        id: `risk-${Date.now()}-${i}`,
        title: `Potential Compliance Issue ${i + 1}`,
        description: `Simulated risk description ${i + 1}`,
        severity: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
        regulation: ['GDPR', 'HIPAA', 'SOC 2'][Math.floor(Math.random() * 3)] as string,
        mitigation: `Mitigation strategy ${i + 1}`,
      });
    }

    return risks;
  };

  const generateRandomRecommendations = (): string[] => {
    const numRecommendations = Math.floor(Math.random() * 3) + 1; // Generate 1-3 recommendations
    const recommendations: string[] = [];

    for (let i = 0; i < numRecommendations; i++) {
      recommendations.push(`Recommendation ${i + 1}: Implement best practices`);
    }

    return recommendations;
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Laptop className="mr-2 h-4 w-4" />
            Realtime Analysis Simulator
          </CardTitle>
          <Button variant="outline" size="icon" onClick={simulateAnalysis} disabled={!enabled}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <BarChart2 className="h-9 w-9 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Simulate Realtime Analysis</p>
              <p className="text-xs text-muted-foreground">
                Generate simulated compliance reports for demonstration purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealtimeAnalysisSimulator;
