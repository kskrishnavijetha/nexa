
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { ComplianceReport } from '@/utils/types';

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
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Document</th>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Date</th>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Score</th>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {scanHistory.map((scan) => (
            <tr key={scan.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="font-medium text-sm">{scan.documentName}</div>
              </td>
              <td className="py-3 px-4 text-sm">
                {new Date(scan.timestamp).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 text-sm">
                {scan.overallScore}%
              </td>
              <td className="py-3 px-4">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
