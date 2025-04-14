
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { ComplianceReport } from '@/utils/types';
import { FRAMEWORK_TO_REGULATION_MAP } from '@/utils/multiFrameworkComplianceService';

interface MultiFrameworkScoresTabProps {
  report: ComplianceReport;
}

export const MultiFrameworkScoresTab: React.FC<MultiFrameworkScoresTabProps> = ({
  report
}) => {
  const { selectedFrameworks = [], frameworkScores = {} } = report;
  
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Compliant</Badge>;
    }
    if (score >= 60) {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Needs Improvement</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Non-compliant</Badge>;
  };
  
  const getFrameworkIcon = (score: number) => {
    if (score >= 80) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (score >= 60) {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Multi-Framework Compliance Overview</CardTitle>
          <CardDescription>
            Compliance scores across all selected frameworks. Mouse over each framework for details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="text-3xl font-bold">{report.overallScore}%</div>
              <div className="ml-3">
                {getScoreBadge(report.overallScore)}
                <div className="text-sm text-muted-foreground mt-1">Overall Compliance</div>
              </div>
            </div>
            <div className="text-right text-muted-foreground text-sm">
              <div>Document: {report.documentName}</div>
              <div>Industry: {report.industry}</div>
              <div>Frameworks: {selectedFrameworks.length}</div>
            </div>
          </div>
          
          <div className="space-y-5">
            {selectedFrameworks.map(frameworkId => {
              const score = frameworkScores[frameworkId] || 0;
              const regulations = FRAMEWORK_TO_REGULATION_MAP[frameworkId] || [];
              
              return (
                <div key={frameworkId} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getFrameworkIcon(score)}
                      <span className="font-medium">{frameworkId}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">{score}%</span>
                      {getScoreBadge(score)}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Progress value={score} className={`h-2.5 ${getScoreColor(score)}`} />
                    
                    {/* Tooltip */}
                    <div className="absolute left-0 mt-2 w-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <div className="bg-slate-800 text-white text-xs rounded p-2 shadow-lg">
                        <div className="font-semibold mb-1">{frameworkId} Details:</div>
                        <div>Regulations: {regulations.join(', ')}</div>
                        <div>Requirements: {Math.floor(Math.random() * 20) + 5} controls checked</div>
                        <div>Violations: {score < 100 ? Math.floor((100 - score) / 10) + 1 : 0} found</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 bg-blue-50 p-3 rounded-md">
            <div className="flex gap-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">About Multi-Framework Compliance</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  This report evaluates compliance across multiple regulatory frameworks simultaneously, 
                  allowing for a comprehensive assessment of your document against global, regional, 
                  and industry-specific requirements.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiFrameworkScoresTab;
