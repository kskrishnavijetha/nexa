
import React from 'react';
import { BarChart3, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatisticsCardsProps {
  dashboardData: {
    complianceScore: number;
    documentsScanned: number;
    criticalIssues: number;
    resolvedItems: number;
    complianceChange: number;
    recentScans: number;
  };
  hasData: boolean;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ dashboardData, hasData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Compliance Score
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {hasData ? (
            <>
              <div className="text-2xl font-bold">{dashboardData.complianceScore}%</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.complianceChange > 0 ? '+' : ''}{dashboardData.complianceChange}% from last month
              </p>
            </>
          ) : (
            <div className="text-muted-foreground text-sm">No data available</div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Documents Scanned
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {hasData ? (
            <>
              <div className="text-2xl font-bold">{dashboardData.documentsScanned}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.recentScans} in the last 7 days
              </p>
            </>
          ) : (
            <div className="text-muted-foreground text-sm">No documents scanned</div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Critical Issues
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          {hasData ? (
            <>
              <div className="text-2xl font-bold">{dashboardData.criticalIssues}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.criticalIssues > 0 ? 'Needs attention' : 'No critical issues'}
              </p>
            </>
          ) : (
            <div className="text-muted-foreground text-sm">No issues detected</div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Resolved Items
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          {hasData ? (
            <>
              <div className="text-2xl font-bold">{dashboardData.resolvedItems}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.resolvedItems > 0 ? 'Items resolved' : 'No resolved items yet'}
              </p>
            </>
          ) : (
            <div className="text-muted-foreground text-sm">No items resolved</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
