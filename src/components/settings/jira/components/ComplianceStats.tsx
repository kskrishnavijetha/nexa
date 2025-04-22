
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ComplianceFrameworkStats } from '@/utils/jira/types';

interface ComplianceStatsProps {
  frameworkStats: ComplianceFrameworkStats[];
  isLoading: boolean;
}

const ComplianceStats: React.FC<ComplianceStatsProps> = ({ frameworkStats, isLoading }) => {
  return (
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
                <Badge variant={stat.percentageComplete > 80 ? "secondary" : stat.percentageComplete > 60 ? "outline" : "destructive"}>
                  {stat.percentageComplete > 80 ? "Compliant" : stat.percentageComplete > 60 ? "Partial" : "At Risk"}
                </Badge>
              </div>
              <Progress value={stat.percentageComplete} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ComplianceStats;
