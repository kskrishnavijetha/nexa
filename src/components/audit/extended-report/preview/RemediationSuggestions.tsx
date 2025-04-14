
import React from 'react';
import { ExtendedReport } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface RemediationSuggestionsProps {
  report: ExtendedReport;
}

export const RemediationSuggestions: React.FC<RemediationSuggestionsProps> = ({ report }) => {
  const { remediations } = report;

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
      case 'high':
        return (
          <div className="flex items-center">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mr-1">
              {priority}
            </Badge>
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center">
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mr-1">
              {priority}
            </Badge>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          </div>
        );
      case 'low':
        return (
          <div className="flex items-center">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-1">
              {priority}
            </Badge>
            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
          </div>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">Remediation Suggestions</h3>
        
        {remediations && remediations.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Issue</TableHead>
                  <TableHead>Guidance</TableHead>
                  <TableHead className="w-[100px]">Priority</TableHead>
                  <TableHead className="w-[150px]">Est. Time to Fix</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {remediations.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="text-sm">{item.description}</TableCell>
                    <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                    <TableCell className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      <span>{item.timeToFix}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No remediation suggestions available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
