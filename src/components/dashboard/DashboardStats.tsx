
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, AlertCircle, CheckCircle, BarChart } from 'lucide-react';

const DashboardStats = () => {
  // In a real app, these values would come from real data
  const complianceScore = 78;
  const scoreChange = 2;
  const documentsScanned = 12;
  const scanPeriod = 7;
  const criticalIssues = 3;
  const issueChange = -2;
  const resolvedItems = 24;
  const resolvedChange = 8;

  return (
    <>
      <Card>
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="flex items-center justify-center mb-2">
            <h3 className="text-sm font-medium">Compliance Score</h3>
            <BarChart className="h-4 w-4 ml-1 text-muted-foreground" />
          </div>
          <p className="text-4xl font-bold">{complianceScore}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            {scoreChange > 0 ? '+' : ''}{scoreChange}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="flex items-center justify-center mb-2">
            <h3 className="text-sm font-medium">Documents Scanned</h3>
            <FileText className="h-4 w-4 ml-1 text-muted-foreground" />
          </div>
          <p className="text-4xl font-bold">{documentsScanned}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {documentsScanned} in the last {scanPeriod} days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="flex items-center justify-center mb-2">
            <h3 className="text-sm font-medium">Critical Issues</h3>
            <AlertCircle className="h-4 w-4 ml-1 text-red-500" />
          </div>
          <p className="text-4xl font-bold">{criticalIssues}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {issueChange > 0 ? '+' : ''}{issueChange} from last scan
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="flex items-center justify-center mb-2">
            <h3 className="text-sm font-medium">Resolved Items</h3>
            <CheckCircle className="h-4 w-4 ml-1 text-green-500" />
          </div>
          <p className="text-4xl font-bold">{resolvedItems}</p>
          <p className="text-xs text-muted-foreground mt-1">
            +{resolvedChange} this month
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardStats;
