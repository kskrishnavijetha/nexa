
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuditTrail } from './AuditTrailProvider';
import { formatTimestamp } from './auditUtils';
import { File, Eye, ArrowRight } from 'lucide-react';
import IntegrityVerification from './IntegrityVerification';

const AuditLogs: React.FC = () => {
  const { auditEvents, verificationCode } = useAuditTrail();

  if (auditEvents.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No audit logs available.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {verificationCode && (
        <div className="mb-4">
          <IntegrityVerification verificationCode={verificationCode} />
        </div>
      )}
      
      <h3 className="text-sm font-medium mb-2">Detailed Audit Logs</h3>
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
