
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SlackScanResults } from '@/utils/slack/types';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { formatTimestamp } from '@/components/audit/auditUtils';

interface SlackAuditTrailProps {
  scanResults: SlackScanResults | null;
}

const SlackAuditTrail: React.FC<SlackAuditTrailProps> = ({ scanResults }) => {
  const handleDownloadAudit = () => {
    if (!scanResults) return;
    
    // Generate a simple CSV report of violations
    const headers = ['Message ID', 'Text', 'Severity', 'Rule', 'Channel', 'User', 'Timestamp'];
    const rows = scanResults.violations.map(v => [
      v.messageId,
      `"${v.text.replace(/"/g, '""')}"`, // Escape quotes for CSV
      v.severity,
      v.rule,
      v.channel,
      v.user,
      v.timestamp
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `slack-audit-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Audit report downloaded successfully');
  };

  if (!scanResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Slack Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No scan results available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Slack Audit Trail</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={handleDownloadAudit}
          >
            <FileText size={14} />
            <span>Download Logs</span>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1"
            onClick={handleDownloadAudit}
          >
            <Download size={14} />
            <span>Download Report</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm mb-4">
          <p><strong>Scan ID:</strong> {scanResults.scanId}</p>
          <p><strong>Timestamp:</strong> {new Date(scanResults.timestamp).toLocaleString()}</p>
          <p><strong>Messages Scanned:</strong> {scanResults.scannedMessages}</p>
          <p><strong>Files Scanned:</strong> {scanResults.scannedFiles}</p>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="w-[100px]">Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scanResults.violations.map((violation) => (
                <TableRow key={violation.messageId}>
                  <TableCell className="text-xs">{formatTimestamp(violation.timestamp)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-sm">{violation.rule}</span>
                    </div>
                  </TableCell>
                  <TableCell>{violation.channel}</TableCell>
                  <TableCell>{violation.user}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      violation.severity === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : violation.severity === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {violation.severity}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {scanResults.violations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    No violations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlackAuditTrail;
