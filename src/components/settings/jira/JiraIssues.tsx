
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { jiraIssueService } from '@/utils/jira/jiraIssueService';
import { ComplianceIssue, JiraFilter } from '@/utils/jira/types';
import { useToast } from '@/components/ui/use-toast';

const JiraIssues = () => {
  const [issues, setIssues] = useState<ComplianceIssue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<ComplianceIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<JiraFilter>({
    onlyComplianceIssues: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchIssues = async () => {
      setIsLoading(true);
      try {
        const data = await jiraIssueService.getComplianceIssues(filter);
        setIssues(data);
        setFilteredIssues(data);
      } catch (error) {
        console.error('Failed to fetch Jira issues:', error);
        toast({
          title: 'Error',
          description: 'Failed to load Jira issues',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, [filter, toast]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredIssues(issues.filter(issue => 
        issue.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.complianceFrameworks.some(framework => 
          framework.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ));
    } else {
      setFilteredIssues(issues);
    }
  }, [searchQuery, issues]);

  const getRiskBadgeVariant = (score: number) => {
    if (score >= 70) return 'destructive';
    if (score >= 40) return 'secondary';
    return 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Issues</CardTitle>
        <CardDescription>
          Jira issues with compliance implications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search issues..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-2">
            <Select
              value={filter.onlyComplianceIssues ? 'compliance' : 'all'}
              onValueChange={(value) => 
                setFilter(prev => ({ 
                  ...prev, 
                  onlyComplianceIssues: value === 'compliance' 
                }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compliance">Compliance only</SelectItem>
                <SelectItem value="all">All issues</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
              <p className="text-sm text-muted-foreground">Loading issues...</p>
            </div>
          </div>
        ) : filteredIssues.length > 0 ? (
          <div className="border rounded-md">
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
                {filteredIssues.map((issue) => (
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
                      <Badge variant={getRiskBadgeVariant(issue.riskScore)}>
                        {issue.riskScore}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{issue.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border rounded-md p-12 text-center">
            <p className="text-muted-foreground">No compliance issues found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JiraIssues;
