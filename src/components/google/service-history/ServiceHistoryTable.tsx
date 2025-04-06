
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { ComplianceReport } from '@/utils/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ServiceHistoryTableProps {
  scanHistory: ComplianceReport[];
  onDocumentClick: (documentName: string, report?: ComplianceReport) => void;
  onDeleteClick?: (documentId: string, documentName: string) => void;
}

export const ServiceHistoryTable: React.FC<ServiceHistoryTableProps> = ({ 
  scanHistory,
  onDocumentClick,
  onDeleteClick
}) => {
  // Display only the document name without suffixes for cleaner UI
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scanHistory.map((scan) => {
            return (
              <TableRow key={scan.id || scan.documentId} className="hover:bg-slate-50">
                <TableCell className="font-medium">
                  {scan.documentName}
                </TableCell>
                <TableCell>
                  {new Date(scan.timestamp).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {scan.overallScore}%
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => onDocumentClick(scan.documentName, scan)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {onDeleteClick && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => onDeleteClick(scan.documentId, scan.documentName)}
                        title="Delete permanently"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
