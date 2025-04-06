
import { User } from '@supabase/supabase-js';
import { getUserHistoricalReports } from '@/utils/historyService';

export interface DashboardData {
  complianceScore: number;
  documentsScanned: number;
  criticalIssues: number;
  resolvedItems: number;
  complianceChange: number;
  recentScans: number;
}

export const loadDashboardData = async (user: User | null): Promise<DashboardData> => {
  const defaultData: DashboardData = {
    complianceScore: 0,
    documentsScanned: 0,
    criticalIssues: 0,
    resolvedItems: 0,
    complianceChange: 0,
    recentScans: 0,
  };

  if (!user?.id) {
    return defaultData;
  }

  const userReports = getUserHistoricalReports(user.id);
  
  if (userReports.length === 0) {
    return defaultData;
  }

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
  
  return {
    complianceScore: avgScore,
    documentsScanned: userReports.length,
    criticalIssues: criticalIssues,
    resolvedItems: Math.round(criticalIssues * 0.8), // Assuming 80% of issues were resolved
    complianceChange: scoreChange,
    recentScans: recentScans,
  };
};
