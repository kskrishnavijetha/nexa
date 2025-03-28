
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileText } from 'lucide-react';
import { ServiceScanHistory } from '@/components/audit/types';
import { ComplianceReport } from '@/utils/types';

interface ServiceHistoryTableProps {
  scanHistory: ServiceScanHistory[];
  onDocumentClick: (documentName: string, report?: ComplianceReport) => void;
}

export const ServiceHistoryTable: React.FC<ServiceHistoryTableProps> = ({ 
  scanHistory,
  onDocumentClick
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Document/Content</TableHead>
          <TableHead>Scan Date</TableHead>
          <TableHead>Items Scanned</TableHead>
          <TableHead>Violations</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scanHistory.map((item, index) => (
          <TableRow key={`${item.serviceId}-${index}-${item.scanDate}`}>
            <TableCell>
              <Badge variant="outline" className="font-medium">
                {item.serviceName}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">
              <Button 
                variant="link" 
                className="p-0 h-auto text-left text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                onClick={() => onDocumentClick(item.documentName || 'Document Scan', item.report)}
              >
                <FileText className="h-4 w-4 mr-2" />
                {item.fileName || item.documentName || 'General Scan'}
              </Button>
            </TableCell>
            <TableCell>
              {new Date(item.scanDate).toLocaleString()}
            </TableCell>
            <TableCell>{item.itemsScanned}</TableCell>
            <TableCell>
              <span className="flex items-center">
                {item.violationsFound > 0 && <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />}
                {item.violationsFound}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
