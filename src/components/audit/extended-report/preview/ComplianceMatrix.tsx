
import React from 'react';
import { ExtendedReport } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface ComplianceMatrixProps {
  report: ExtendedReport;
}

export const ComplianceMatrix: React.FC<ComplianceMatrixProps> = ({ report }) => {
  const { baseReport, complianceMatrix } = report;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pass':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Pass</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Warning</Badge>;
      case 'fail':
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">N/A</Badge>;
    }
  };
  
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'critical':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{severity}</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{severity}</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{severity}</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{severity}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">Compliance Matrix</h3>
        
        {complianceMatrix.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Category</TableHead>
                  <TableHead className="w-[220px]">Regulation Mapping</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px]">Severity</TableHead>
                  <TableHead>Explanation / Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complianceMatrix.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell className="text-sm">{item.regulation}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{getSeverityBadge(item.severity)}</TableCell>
                    <TableCell className="text-sm">{item.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-start p-4 rounded-md bg-blue-50 border border-blue-100">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-700 font-medium">No compliance items to display</p>
              <p className="text-blue-600 mt-1">
                The compliance matrix will be populated based on the document analysis results and selected
                compliance frameworks.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
