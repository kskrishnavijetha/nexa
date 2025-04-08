
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuditTrail } from './AuditTrailProvider';
import { formatTimestamp } from './auditUtils';
import { File, Eye, ArrowRight, FileJson, FileText, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { exportToJSON, exportToCSV, exportToPDF } from '@/utils/audit/exportUtils';

const AuditLogs: React.FC = () => {
  const { auditEvents, documentName } = useAuditTrail();

  const handleExport = (format: 'json' | 'csv' | 'pdf') => {
    if (!documentName) return;

    switch (format) {
      case 'json':
        exportToJSON(auditEvents, documentName);
        break;
      case 'csv':
        exportToCSV(auditEvents, documentName);
        break;
      case 'pdf':
        exportToPDF(auditEvents, documentName);
        break;
    }
  };

  if (auditEvents.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No audit logs available.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Detailed Audit Logs</h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport('pdf')}>
              <FileDown className="mr-2 h-4 w-4" />
              <span>Export as PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Export as CSV</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('json')}>
              <FileJson className="mr-2 h-4 w-4" />
              <span>Export as JSON</span>
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
