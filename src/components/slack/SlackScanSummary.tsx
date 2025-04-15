
import React from 'react';
import { SlackScanResults } from '@/utils/slack/types';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Clock, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SlackScanSummaryProps {
  results: SlackScanResults;
}

const SlackScanSummary: React.FC<SlackScanSummaryProps> = ({ results }) => {
  const totalViolations = results.violations.length;
  const highSeverityCount = results.violations.filter(v => v.severity === 'high').length;
  const mediumSeverityCount = results.violations.filter(v => v.severity === 'medium').length;
  const lowSeverityCount = results.violations.filter(v => v.severity === 'low').length;

  // Calculate compliance rate as a percentage
  const complianceRate = totalViolations > 0
    ? Math.max(0, 100 - (totalViolations / results.scannedMessages) * 100)
    : 100;
  
  const formattedComplianceRate = Math.round(complianceRate);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" /> 
              Scan Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scan ID:</span>
                <span className="font-mono">{results.scanId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Timestamp:</span>
                <span>{new Date(results.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Messages Scanned:</span>
                <span>{results.scannedMessages}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Files Scanned:</span>
                <span>{results.scannedFiles || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <span className="flex items-center">
                  {results.status === 'completed' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      Completed
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                      {results.status}
                    </>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" /> 
              Violations Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Compliance Rate</span>
                <span className={`font-bold ${
                  formattedComplianceRate > 90 ? 'text-green-600' :
                  formattedComplianceRate > 70 ? 'text-amber-600' : 'text-red-600'
                }`}>{formattedComplianceRate}%</span>
              </div>
              
              <Progress 
                value={formattedComplianceRate} 
                className={`h-2 ${
                  formattedComplianceRate > 90 ? 'bg-green-100' :
                  formattedComplianceRate > 70 ? 'bg-amber-100' : 'bg-red-100'
                }`} 
              />
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                    High Severity
                  </span>
                  <Badge variant="destructive">{highSeverityCount}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
                    Medium Severity
                  </span>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                    {mediumSeverityCount}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                    Low Severity
                  </span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                    {lowSeverityCount}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm font-medium pt-2 border-t mt-2">
                  <span>Total Violations</span>
                  <span>{totalViolations}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {totalViolations > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" /> 
              Recommended Actions
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Based on the violations detected, we recommend the following actions:
            </p>
            <ul className="space-y-2 text-sm">
              {highSeverityCount > 0 && (
                <li className="flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
                  <span>
                    Address high severity violations immediately as they may pose significant
                    compliance risks to your organization.
                  </span>
                </li>
              )}
              {mediumSeverityCount > 0 && (
                <li className="flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                  <span>
                    Review medium severity violations and plan remediation within the next few days.
                  </span>
                </li>
              )}
              {lowSeverityCount > 0 && (
                <li className="flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                  <span>
                    Address low severity violations as part of regular compliance maintenance.
                  </span>
                </li>
              )}
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>
                  Consider implementing regular compliance training for team members to prevent future violations.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center flex-col py-6">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Violations Found</h3>
              <p className="text-center text-muted-foreground max-w-md">
                Great job! Your Slack workspace is compliant with the configured policies.
                Continue to monitor regularly to maintain compliance.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SlackScanSummary;
