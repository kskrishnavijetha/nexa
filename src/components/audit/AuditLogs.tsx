
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuditTrail } from './context/AuditTrailContext';
import { formatTimestamp } from './auditUtils';
import { File, Eye, ArrowRight, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const AuditLogs: React.FC = () => {
  const { auditEvents, downloadJSON, downloadCSV, downloadPDF } = useAuditTrail();

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
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Logs
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={downloadJSON} className="cursor-pointer">
              <File className="mr-2 h-4 w-4" />
              <span>Download JSON</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadCSV} className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4" />
              <span>Download CSV</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadPDF} className="cursor-pointer">
              <File className="mr-2 h-4 w-4" />
              <span>Download PDF</span>
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
