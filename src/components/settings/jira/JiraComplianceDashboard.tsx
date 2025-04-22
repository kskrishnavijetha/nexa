
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, AlertTriangle } from 'lucide-react';
import { jiraIssueService } from '@/utils/jira/jiraIssueService';
import { complianceFrameworkService } from '@/utils/jira/complianceFrameworkService';
import { ComplianceFrameworkStats, ComplianceIssue, RiskDistribution } from '@/utils/jira/types';
import { jiraDashboardService } from '@/utils/jira/jiraDashboardService';
import JiraPieChart from './components/JiraPieChart';
import JiraBarChart from './components/JiraBarChart';
import { useToast } from '@/components/ui/use-toast';

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
        // Get high risk issues
        const issues = await jiraIssueService.getComplianceIssues({ 
          onlyComplianceIssues: true 
        });
        const highRisk = issues.filter(issue => issue.riskScore >= 70);
        setHighRiskIssues(highRisk);
        
        // Get framework statistics
        const stats = complianceFrameworkService.getFrameworkStats();
        setFrameworkStats(stats);
        
        // Get risk distribution
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
      // In a real implementation, this would generate a PDF report
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate report generation
      
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {frameworkStats.map((stat) => (
          <Card key={stat.framework} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{stat.framework}</CardTitle>
              <CardDescription className="text-xs">
                {stat.controlsWithIssues} controls with issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{stat.percentageComplete}%</span>
                  <Badge variant={stat.percentageComplete > 80 ? "success" : stat.percentageComplete > 60 ? "warning" : "destructive"}>
                    {stat.percentageComplete > 80 ? "Compliant" : stat.percentageComplete > 60 ? "Partial" : "At Risk"}
                  </Badge>
                </div>
                <Progress value={stat.percentageComplete} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>
              Distribution of compliance issues by risk level
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
              </div>
            ) : (
              <div className="h-64">
                <JiraPieChart 
                  data={[
                    { name: 'High', value: riskDistribution.high, color: '#ef4444' },
                    { name: 'Medium', value: riskDistribution.medium, color: '#f59e0b' },
                    { name: 'Low', value: riskDistribution.low, color: '#10b981' },
                  ]}
                />
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Compliance by Framework</CardTitle>
            <CardDescription>
              Issue distribution across compliance frameworks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
              </div>
            ) : (
              <div className="h-64">
                <JiraBarChart 
                  data={[
                    { name: 'SOC 2', complete: 71, incomplete: 29 },
                    { name: 'HIPAA', complete: 82, incomplete: 18 },
                    { name: 'GDPR', complete: 67, incomplete: 33 },
                    { name: 'PCI DSS', complete: 85, incomplete: 15 },
                  ]}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
              High Risk Issues
            </CardTitle>
            <CardDescription>
              Issues requiring immediate attention
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            </div>
          ) : highRiskIssues.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Framework</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highRiskIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-mono">{issue.key}</TableCell>
                    <TableCell>{issue.summary}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {issue.complianceFrameworks.map((framework, idx) => (
                          <Badge key={idx} variant="secondary">{framework}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">{issue.riskScore}%</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{issue.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No high risk issues found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JiraComplianceDashboard;
