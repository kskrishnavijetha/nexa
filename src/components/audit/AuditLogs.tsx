
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuditTrail } from './context/AuditTrailContext';
import { formatTimestamp } from './auditUtils';
import { File, Eye, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportReport, ExportFormat } from '@/utils/reports/exportFormats';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { RiskSeverity } from '@/utils/types';

const AuditLogs: React.FC = () => {
  const { auditEvents, documentName } = useAuditTrail();
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (auditEvents.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No audit logs available.</p>
      </div>
    );
  }

  // Function to export audit logs as JSON
  const exportAsJSON = () => {
    try {
      setIsExporting(true);
      const jsonData = JSON.stringify(auditEvents, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const filename = `audit-logs-${documentName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      saveAs(blob, filename);
      toast.success('Audit logs exported as JSON');
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast.error('Failed to export audit logs');
    } finally {
      setIsExporting(false);
    }
  };

  // Function to export audit logs as CSV
  const exportAsCSV = () => {
    try {
      setIsExporting(true);
      // Create CSV header
      let csvContent = "Timestamp,Action,User,Status\n";
      
      // Add data rows
      auditEvents.forEach(event => {
        const timestamp = formatTimestamp(event.timestamp);
        const action = event.action.replace(/,/g, ' '); // Replace commas to avoid CSV issues
        const user = event.user.replace(/,/g, ' ');
        const status = event.status;
        
        csvContent += `"${timestamp}","${action}","${user}","${status}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const filename = `audit-logs-${documentName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
      saveAs(blob, filename);
      toast.success('Audit logs exported as CSV');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export audit logs');
    } finally {
      setIsExporting(false);
    }
  };

  // Function to handle PDF export (using the existing report functionality)
  const exportAsPDF = () => {
    try {
      setIsExporting(true);
      // Create a simplified report format that works with existing exportReport function
      const simplifiedReport = {
        documentId: documentName.replace(/\s+/g, '-').toLowerCase(),
        documentName: documentName,
        risks: auditEvents.map(event => ({
          title: event.action,
          description: `${formatTimestamp(event.timestamp)} - ${event.user}`,
          severity: (event.status === 'completed' ? 'low' : event.status === 'in-progress' ? 'medium' : 'high') as RiskSeverity,
          regulation: event.status
        })),
        overallScore: 0,
        industry: undefined,
        region: undefined,
        gdprScore: 0,
        hipaaScore: 0,
        soc2Score: 0,
        summary: `Audit log for ${documentName}`
      };
      
      exportReport(simplifiedReport, 'pdf');
      toast.success('Audit logs exported as PDF');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export audit logs');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Detailed Audit Logs</h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              disabled={isExporting}
              className="flex items-center gap-1"
            >
              {isExporting ? (
                <>Exporting...</>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Export Logs
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Export Format</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportAsJSON}>
              <FileText className="h-4 w-4 mr-2" />
              JSON Format
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportAsPDF}>
              <FileText className="h-4 w-4 mr-2" />
              PDF Document
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportAsCSV}>
              <FileText className="h-4 w-4 mr-2" />
              CSV Spreadsheet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="text-xs">{formatTimestamp(event.timestamp)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {event.icon || <File className="h-4 w-4 mr-2 text-gray-400" />}
                    <span className="text-sm">{event.action}</span>
                  </div>
                </TableCell>
                <TableCell>{event.user}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : event.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AuditLogs;
