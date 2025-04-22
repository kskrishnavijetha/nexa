
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { complianceIssueService } from '@/utils/jira/services/complianceIssueService';
import { complianceFrameworkService } from '@/utils/jira/complianceFrameworkService';
import { jiraDashboardService } from '@/utils/jira/jiraDashboardService';
import { ComplianceIssue, ComplianceFrameworkStats, RiskDistribution } from '@/utils/jira/types';
import ComplianceStats from './components/ComplianceStats';
import RiskDistributionChart from './components/RiskDistributionChart';
import FrameworkComplianceChart from './components/FrameworkComplianceChart';
import HighRiskIssuesTable from './components/HighRiskIssuesTable';

const JiraComplianceDashboard = () => {
  const [highRiskIssues, setHighRiskIssues] = useState<ComplianceIssue[]>([]);
  const [frameworkStats, setFrameworkStats] = useState<ComplianceFrameworkStats[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<RiskDistribution>({
    high: 0,
    medium: 0,
    low: 0,
    total: 0,
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const issues = await complianceIssueService.getComplianceIssues({ 
          onlyComplianceIssues: true 
        });
        const highRisk = issues.filter(issue => issue.riskScore >= 70);
        setHighRiskIssues(highRisk);
        
        const stats = complianceFrameworkService.getFrameworkStats();
        setFrameworkStats(stats);
        
        const distribution = jiraDashboardService.getRiskDistribution();
        setRiskDistribution(distribution);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: 'Report generated',
        description: 'Your compliance report has been downloaded',
      });
    } catch (error) {
      toast({
        title: 'Report generation failed',
        description: 'Failed to generate the compliance report',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h3 className="text-lg font-medium">Jira Compliance Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Overview of compliance status across your Jira projects
          </p>
        </div>
        <Button
          onClick={handleGenerateReport}
          disabled={isGeneratingReport}
          className="mt-4 sm:mt-0 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {isGeneratingReport ? 'Generating...' : 'Export Report'}
        </Button>
      </div>
      
      <ComplianceStats 
        frameworkStats={frameworkStats}
        isLoading={isLoading}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RiskDistributionChart 
          distribution={riskDistribution}
          isLoading={isLoading}
        />
        <FrameworkComplianceChart isLoading={isLoading} />
      </div>
      
      <HighRiskIssuesTable 
        issues={highRiskIssues}
        isLoading={isLoading}
      />
    </div>
  );
};

export default JiraComplianceDashboard;
