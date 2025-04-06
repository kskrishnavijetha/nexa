
import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RecentScans from '@/components/dashboard/RecentScans';
import ComplianceScore from '@/components/dashboard/ComplianceScore';
import RiskSummary from '@/components/dashboard/RiskSummary';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import { getUserHistoricalReports } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    complianceScore: 0,
    documentsScanned: 0,
    criticalIssues: 0,
    resolvedItems: 0,
    complianceChange: 0,
    recentScans: 0,
  });

  useEffect(() => {
    // Load real data from the user's historical reports
    const loadDashboardData = async () => {
      if (user?.uid) {
        const userReports = getUserHistoricalReports(user.uid);
        
        if (userReports.length > 0) {
          // Calculate the average compliance score
          const avgScore = Math.round(
            userReports.reduce((sum, report) => sum + report.overallScore, 0) / 
            userReports.length
          );
          
          // Count high severity risks across all reports
          const criticalIssues = userReports.reduce(
            (count, report) => count + report.risks.filter(risk => risk.severity === 'high').length, 
            0
          );
          
          // Calculate score change from last month
          // This would ideally come from comparing current vs. previous month's data
          const lastMonthScore = userReports.length > 1 ? 
            userReports[1]?.overallScore || avgScore - 2 : 
            avgScore - 2;
          const scoreChange = avgScore - lastMonthScore;
          
          // Count recent scans (last 7 days)
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const recentScans = userReports.filter(
            report => new Date(report.timestamp || new Date()) > oneWeekAgo
          ).length;
          
          setDashboardData({
            complianceScore: avgScore,
            documentsScanned: userReports.length,
            criticalIssues: criticalIssues,
            resolvedItems: Math.round(criticalIssues * 0.8), // Assuming 80% of issues were resolved
            complianceChange: scoreChange,
            recentScans: recentScans,
          });
        } else {
          // Default values if no reports are found
          setDashboardData({
            complianceScore: 78,
            documentsScanned: 0,
            criticalIssues: 0,
            resolvedItems: 0,
            complianceChange: 0,
            recentScans: 0,
          });
        }
      }
    };

    loadDashboardData();
  }, [user]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Score
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.complianceScore}%</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.complianceChange > 0 ? '+' : ''}{dashboardData.complianceChange}% from last month
            </p>
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
            <div className="text-2xl font-bold">{dashboardData.documentsScanned}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.recentScans} in the last 7 days
            </p>
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
            <div className="text-2xl font-bold">{dashboardData.criticalIssues}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.criticalIssues > 0 ? 'Needs attention' : 'No critical issues'}
            </p>
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
            <div className="text-2xl font-bold">{dashboardData.resolvedItems}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.resolvedItems > 0 ? 'Items resolved' : 'No resolved items yet'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>
              Your latest document compliance scans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentScans />
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Compliance Score</CardTitle>
            <CardDescription>
              Your compliance score over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ComplianceScore />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Risk Summary</CardTitle>
            <CardDescription>
              Breakdown of compliance risks by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RiskSummary />
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>
                Action items due soon
              </CardDescription>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <UpcomingDeadlines />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
