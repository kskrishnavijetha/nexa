import React from 'react';
import { ComplianceReport } from '@/utils/apiService';
import ComplianceInsights from '@/components/predictive/ComplianceInsights';
import RiskPredictions from '@/components/predictive/RiskPredictions';
import RecommendedActions from '@/components/predictive/RecommendedActions';
import TrendAnalysis from '@/components/predictive/TrendAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskTrend } from '@/utils/predictive/types';

interface PredictiveTabProps {
  report: ComplianceReport;
}

const PredictiveTab: React.FC<PredictiveTabProps> = ({ report }) => {
  // Mock data for demonstration - in a real app this would come from API
  const mockInsights = [
    {
      title: 'Data retention policy needs update',
      description: 'Your current data retention policy does not meet GDPR requirements. Update to include specific timeframes for different data types.',
      actionRequired: true,
      priority: 'medium' as const,
    },
    {
      title: 'Breach notification procedure needs enhancement',
      description: 'Your breach notification procedure should be updated to include specific notification timeframes required by HIPAA.',
      actionRequired: true,
      priority: 'low' as const,
    }
  ];

  const mockPredictions = [
    {
      riskType: 'Data access controls',
      probability: 75,
      regulation: 'SOC 2',
      severity: 'high' as const,
      trend: 'increasing' as const,
    },
    {
      riskType: 'User consent management',
      probability: 65,
      regulation: 'GDPR',
      severity: 'medium' as const,
      trend: 'stable' as const,
    }
  ];

  const mockRecommendations = [
    {
      title: 'Update data retention policy',
      description: 'Implement a formal data retention policy that specifies timeframes for different data types and includes automated deletion processes.',
      impact: 'high' as const,
      effortToImplement: 'medium' as const,
    },
    {
      title: 'Enhance breach notification procedure',
      description: 'Update your breach notification procedure to include specific timeframes and documentation requirements.',
      impact: 'medium' as const,
      effortToImplement: 'low' as const,
    }
  ];

  // Create properly typed mock trends that match the RiskTrend type
  const mockTrends: RiskTrend[] = [
    {
      riskId: 'gdpr-risk-1',
      regulation: 'GDPR',
      description: 'Data Protection Risk',
      currentSeverity: 'medium',
      previousScore: 85,
      predictedScore: 90,
      predictedChange: 'increase',
      trend: 'increase',
      impact: 'high'
    },
    {
      riskId: 'hipaa-risk-1',
      regulation: 'HIPAA',
      description: 'Patient Data Protection',
      currentSeverity: 'medium',
      previousScore: 78,
      predictedScore: 82,
      predictedChange: 'increase',
      trend: 'increase',
      impact: 'medium'
    },
    {
      riskId: 'soc2-risk-1',
      regulation: 'SOC2',
      description: 'Access Control Risk',
      currentSeverity: 'low',
      previousScore: 92,
      predictedScore: 88,
      predictedChange: 'decrease',
      trend: 'decrease',
      impact: 'high'
    }
  ];

  return (
    <div className="p-6">
      <Tabs defaultValue="insights">
        <TabsList className="mb-4">
          <TabsTrigger value="insights">Compliance Insights</TabsTrigger>
          <TabsTrigger value="risks">Risk Predictions</TabsTrigger>
          <TabsTrigger value="actions">Recommended Actions</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights">
          <ComplianceInsights insights={mockInsights} />
        </TabsContent>
        
        <TabsContent value="risks">
          <RiskPredictions predictions={mockPredictions} />
        </TabsContent>
        
        <TabsContent value="actions">
          <RecommendedActions recommendations={mockRecommendations} />
        </TabsContent>
        
        <TabsContent value="trends">
          <TrendAnalysis trends={mockTrends} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveTab;
