
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { ComplianceIssue } from '@/utils/jira/types';

interface HighRiskIssuesTableProps {
  issues: ComplianceIssue[];
  isLoading: boolean;
}

const HighRiskIssuesTable: React.FC<HighRiskIssuesTableProps> = ({ issues, isLoading }) => {
  return (
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
        ) : issues.length > 0 ? (
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
              {issues.map((issue) => (
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
  );
};

export default HighRiskIssuesTable;
