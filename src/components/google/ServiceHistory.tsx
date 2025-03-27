
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, AlertTriangle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';

const ServiceHistory: React.FC = () => {
  const { scanHistory } = useServiceHistoryStore();

  if (scanHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Service Scan History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No scan history yet</h3>
            <p className="text-sm text-gray-500">
              Connect services and run scans to see your history here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Service Scan History
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                  {item.documentName || 'General Scan'}
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
      </CardContent>
    </Card>
  );
};

export default ServiceHistory;
