
import React from 'react';
import { SlackViolation } from '@/utils/slack/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface SlackViolationsTableProps {
  violations: SlackViolation[];
}

const SlackViolationsTable: React.FC<SlackViolationsTableProps> = ({ violations }) => {
  if (violations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-green-500/50" />
        <p>No compliance violations detected.</p>
        <p className="text-sm mt-1">Great job! Your Slack workspace appears to be compliant.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Violation</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Severity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {violations.map((violation) => (
            <TableRow key={violation.messageId}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{violation.rule}</span>
                  <span className="text-xs text-muted-foreground mt-1 font-mono p-1 bg-gray-50 rounded">
                    {violation.context}
                  </span>
                </div>
              </TableCell>
              <TableCell>{violation.channel}</TableCell>
              <TableCell>{violation.user}</TableCell>
              <TableCell>{new Date(violation.timestamp).toLocaleString()}</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    violation.severity === 'high' ? 'destructive' :
                    violation.severity === 'medium' ? 'outline' : 'secondary'
                  }
                  className={
                    violation.severity === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    violation.severity === 'low' ? 'bg-blue-50 text-blue-800 border-blue-200' : ''
                  }
                >
                  {violation.severity}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SlackViolationsTable;
