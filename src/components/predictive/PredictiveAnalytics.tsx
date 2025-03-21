
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplianceReport } from '@/utils/types';
import { analyzePastReports, PredictiveAnalyticsResult } from '@/utils/predictive';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RiskPredictions from './RiskPredictions';
import ComplianceInsights from './ComplianceInsights';
import RecommendedActions from './RecommendedActions';
import TrendAnalysis from './TrendAnalysis';
import RegulatoryUpdatesFeed from './RegulatoryUpdatesFeed';
import { Brain, Lightbulb, BarChart3, TrendingUp, Loader2, AlertTriangle, History } from 'lucide-react';
import { toast } from 'sonner';
import PreviousAnalytics from './PreviousAnalytics';

interface PredictiveAnalyticsProps {
  report: ComplianceReport;
  historicalReports?: ComplianceReport[];
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ 
  report,
  historicalReports = []
}) => {
  const [analyticsResult, setAnalyticsResult] = useState<PredictiveAnalyticsResult | null>(null);
  const [previousResults, setPreviousResults] = useState<PredictiveAnalyticsResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPredictiveAnalytics = async () => {
      setIsLoading(true);
      try {
        // Generate current analysis
        const result = await analyzePastReports(report, historicalReports);
        setAnalyticsResult(result);
        
        // Generate previous analyses if we have historical reports
        if (historicalReports.length > 0) {
          const previousAnalyses = await Promise.all(
            historicalReports.slice(0, 3).map(async (histReport) => {
              // Get previous reports for this historical report (excluding itself)
              const olderReports = historicalReports.filter(
                r => new Date(r.timestamp) < new Date(histReport.timestamp)
              );
              return analyzePastReports(histReport, olderReports);
            })
          );
          setPreviousResults(previousAnalyses);
        }
        
        toast.success('Predictive analysis completed');
      } catch (error) {
        console.error('Error in predictive analysis:', error);
        toast.error('Failed to complete predictive analysis');
      } finally {
        setIsLoading(false);
      }
    };

    loadPredictiveAnalytics();
  }, [report, historicalReports]);

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Predictive Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">
              Analyzing compliance patterns and generating predictions...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analyticsResult) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Predictive Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Could not generate predictive analysis. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Predictive Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights">
          <TabsList className="mb-4 w-full grid grid-cols-6">
            <TabsTrigger value="insights" className="flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Insights</span>
              <span className="sm:hidden">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Predicted Risks</span>
              <span className="sm:hidden">Risks</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Trend Analysis</span>
              <span className="sm:hidden">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Recommended Actions</span>
              <span className="sm:hidden">Actions</span>
            </TabsTrigger>
            <TabsTrigger value="updates" className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Regulatory Updates</span>
              <span className="sm:hidden">Updates</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Previous Analysis</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            <ComplianceInsights insights={analyticsResult.complianceInsights} />
          </TabsContent>

          <TabsContent value="risks">
            <RiskPredictions predictions={analyticsResult.predictedRisks} />
          </TabsContent>

          <TabsContent value="trends">
            <TrendAnalysis trends={analyticsResult.riskTrends} />
          </TabsContent>

          <TabsContent value="actions">
            <RecommendedActions recommendations={analyticsResult.recommendations} />
          </TabsContent>
          
          <TabsContent value="updates">
            <RegulatoryUpdatesFeed industry={report.industry} />
          </TabsContent>
          
          <TabsContent value="history">
            <PreviousAnalytics 
              currentResult={analyticsResult} 
              previousResults={previousResults}
              historicalReports={historicalReports}
            />
          </TabsContent>
        </Tabs>

        <div className="text-xs text-muted-foreground text-right mt-4">
          Analysis last updated: {new Date(analyticsResult.lastUpdated).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveAnalytics;
