
import React, { useState } from 'react';
import { ComplianceReport } from '@/utils/types';
import { PredictiveAnalyticsResult, ComplianceInsight } from '@/utils/predictive/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarIcon, TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, ReferenceLine 
} from 'recharts';

interface PreviousAnalyticsProps {
  currentResult: PredictiveAnalyticsResult;
  previousResults: PredictiveAnalyticsResult[];
  historicalReports: ComplianceReport[];
}

const PreviousAnalytics: React.FC<PreviousAnalyticsProps> = ({ 
  currentResult, 
  previousResults,
  historicalReports
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('gdpr');
  
  if (previousResults.length === 0) {
    return (
      <Alert>
        <AlertTitle>No historical data available</AlertTitle>
        <AlertDescription>
          There are no previous analyses to compare with the current results. 
          As more compliance checks are performed, historical data will become available here.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Prepare data for trend comparison chart
  const prepareScoreTrendData = () => {
    const dataPoints = [];
    
    // Add historical data points
    historicalReports.slice().reverse().forEach((report, index) => {
      if (index < 5) { // Limit to 5 points
        const previousResult = previousResults.find(
          pr => pr.lastUpdated && new Date(pr.lastUpdated).getTime() - new Date(report.timestamp).getTime() < 86400000
        );
        
        if (previousResult) {
          let score = 0;
          // Use type assertion to ensure TypeScript knows we're working with a ComplianceReport
          if (selectedMetric === 'gdpr') score = report.gdprScore;
          else if (selectedMetric === 'hipaa') score = report.hipaaScore;
          else if (selectedMetric === 'soc2') score = report.soc2Score;
          else if (selectedMetric === 'overall') score = report.overallScore;
          
          dataPoints.push({
            name: formatDate(report.timestamp),
            score: score,
            predictedScore: getAverageScoreFromTrends(previousResult.riskTrends, selectedMetric)
          });
        }
      }
    });
    
    // Add current data point
    const currentReport = historicalReports[0];
    if (currentReport) {
      let currentScore = 0;
      if (selectedMetric === 'gdpr') currentScore = currentReport.gdprScore;
      else if (selectedMetric === 'hipaa') currentScore = currentReport.hipaaScore;
      else if (selectedMetric === 'soc2') currentScore = currentReport.soc2Score;
      else if (selectedMetric === 'overall') currentScore = currentReport.overallScore;
      
      dataPoints.push({
        name: 'Current',
        score: currentScore,
        predictedScore: getAverageScoreFromTrends(currentResult.riskTrends, selectedMetric)
      });
    }
    
    return dataPoints;
  };
  
  // Get average score from risk trends for a specific regulation
  const getAverageScoreFromTrends = (trends: any[], metricType: string) => {
    if (!trends || trends.length === 0) return 0;
    
    const relevantTrends = trends.filter(trend => {
      if (metricType === 'gdpr') return trend.regulation === 'GDPR';
      if (metricType === 'hipaa') return trend.regulation === 'HIPAA';
      if (metricType === 'soc2') return trend.regulation === 'SOC 2';
      if (metricType === 'overall') return true;
      return false;
    });
    
    if (relevantTrends.length === 0) return 0;
    
    return relevantTrends.reduce((sum, trend) => sum + trend.predictedScore, 0) / relevantTrends.length;
  };
  
  // Format date for chart
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  
  // Get direction icon for insights
  const getInsightDirectionIcon = (insight: ComplianceInsight) => {
    // Check the priority to determine which icon to show
    if (insight.priority === 'critical' || insight.priority === 'high') {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    } else if (insight.priority === 'low' && insight.title.includes('improvement')) {
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    } else {
      return <Minus className="h-4 w-4 text-slate-500" />;
    }
  };
  
  // Get trend icon
  const getTrendIcon = (trend: 'increasing' | 'stable' | 'decreasing') => {
    if (trend === 'increasing') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'decreasing') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-slate-500" />;
  };
  
  // Get most recent previous result for comparison
  const mostRecentPreviousResult = previousResults[0];
  
  // Compare predictions accuracy (how well previous predictions matched current state)
  const compareInsightAccuracy = () => {
    if (!mostRecentPreviousResult) return [];
    
    // Compare previous predictions with current reality
    const comparisonItems = [];
    const previousTrends = mostRecentPreviousResult.riskTrends;
    
    previousTrends.forEach(prevTrend => {
      const currentReport = historicalReports[0];
      if (currentReport) {
        let actualScore = 0;
        if (prevTrend.regulation === 'GDPR') actualScore = currentReport.gdprScore;
        else if (prevTrend.regulation === 'HIPAA') actualScore = currentReport.hipaaScore;
        else if (prevTrend.regulation === 'SOC 2') actualScore = currentReport.soc2Score;
        
        if (actualScore > 0) {
          const predictedScore = prevTrend.predictedScore;
          const difference = Math.abs(actualScore - predictedScore);
          const accuracy = 100 - Math.min(difference, 100);
          
          comparisonItems.push({
            regulation: prevTrend.regulation,
            predictedScore: predictedScore,
            actualScore: actualScore,
            accuracy: accuracy
          });
        }
      }
    });
    
    return comparisonItems;
  };
  
  const trendData = prepareScoreTrendData();
  const accuracyItems = compareInsightAccuracy();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Historical Analysis Comparison</h3>
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gdpr">GDPR Scores</SelectItem>
            <SelectItem value="hipaa">HIPAA Scores</SelectItem>
            <SelectItem value="soc2">SOC 2 Scores</SelectItem>
            <SelectItem value="overall">Overall Scores</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
              Score Trends Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Actual Score"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="predictedScore"
                    name="Predicted Score"
                    stroke="#82ca9d"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Prediction Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={accuracyItems}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="regulation" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="accuracy" name="Prediction Accuracy %" fill="#8884d8">
                    {accuracyItems.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.accuracy > 80 ? '#4ade80' : entry.accuracy > 60 ? '#facc15' : '#ef4444'} 
                      />
                    ))}
                  </Bar>
                  <ReferenceLine y={80} stroke="#4ade80" strokeDasharray="3 3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
            Previous Compliance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {previousResults.slice(0, 2).map((prevResult, idx) => {
              // Find the corresponding report
              const matchingReport = historicalReports.find(report => 
                prevResult.lastUpdated && 
                Math.abs(new Date(report.timestamp).getTime() - new Date(prevResult.lastUpdated).getTime()) < 86400000
              );
              
              if (!matchingReport) return null;
              
              return (
                <div key={idx} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{matchingReport.documentName}</h4>
                      <p className="text-xs text-muted-foreground">
                        Analysis from {formatDate(prevResult.lastUpdated || '')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">Score: {matchingReport.overallScore}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-xs font-medium mb-1">Key Insights</h5>
                      <ul className="text-xs space-y-1">
                        {prevResult.complianceInsights.slice(0, 3).map((insight, insightIdx) => (
                          <li key={insightIdx} className="flex items-start gap-1">
                            <span className="mt-0.5">{getInsightDirectionIcon(insight)}</span>
                            <span>{insight.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium mb-1">Top Recommendations</h5>
                      <ul className="text-xs space-y-1">
                        {prevResult.recommendations.slice(0, 3).map((rec, recIdx) => (
                          <li key={recIdx}>{rec.title}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviousAnalytics;
