import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { jiraProjectService } from '@/utils/jira/jiraProjectService';
import { complianceIssueService } from '@/utils/jira/services/complianceIssueService';
import { issueService } from '@/utils/jira/services/issueService';
import { complianceFrameworkService } from '@/utils/jira/complianceFrameworkService';

const JiraStatCards: React.FC = () => {
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [totalIssues, setTotalIssues] = useState<number>(0);
  const [complianceIssues, setComplianceIssues] = useState<number>(0);
  const [highRiskIssues, setHighRiskIssues] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real implementation, these would be actual API calls
        const projects = await jiraProjectService.getProjects();
        setTotalProjects(projects.length);
        
        const issues = await issueService.getAllIssues();
        setTotalIssues(issues.length);
        
        const complianceOnly = await complianceIssueService.getComplianceIssues({ onlyComplianceIssues: true });
        setComplianceIssues(complianceOnly.length);
        
        // Filter high risk issues (risk score >= 70)
        const highRisk = complianceOnly.filter(issue => issue.riskScore >= 70);
        setHighRiskIssues(highRisk.length);
      } catch (error) {
        console.error('Error fetching Jira stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  const statCards = [
    {
      label: 'Total Projects',
      value: totalProjects,
      icon: '📊',
    },
    {
      label: 'Total Issues',
      value: totalIssues,
      icon: '📝',
    },
    {
      label: 'Compliance Issues',
      value: complianceIssues,
      icon: '📋',
    },
    {
      label: 'High Risk Issues',
      value: highRiskIssues,
      icon: '⚠️',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <span className="text-2xl">{card.icon}</span>
              <div className="text-right">
                {isLoading ? (
                  <div className="h-6 w-12 bg-muted rounded animate-pulse"></div>
                ) : (
                  <span className="text-2xl font-bold">{card.value}</span>
                )}
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JiraStatCards;
