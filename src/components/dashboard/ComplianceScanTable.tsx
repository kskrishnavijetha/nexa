
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ChevronRight } from 'lucide-react';
import { ComplianceReport } from '@/utils/types';
import { useNavigate } from 'react-router-dom';

interface ComplianceScanTableProps {
  scans: ComplianceReport[];
  onPreview?: (report: ComplianceReport) => void;
}

const ComplianceScanTable: React.FC<ComplianceScanTableProps> = ({ scans, onPreview }) => {
  const navigate = useNavigate();

  const handlePreview = (e: React.MouseEvent, scan: ComplianceReport) => {
    e.stopPropagation();
    if (onPreview) {
      onPreview(scan);
    }
  };

  const handleViewDetails = (scan: ComplianceReport) => {
    // Navigate to the details page or show a modal
    navigate(`/document-analysis?id=${scan.id}`);
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getWorstRiskLevel = (scan: ComplianceReport): string => {
    if (scan.risks.some(risk => risk.severity === 'high')) return 'High';
    if (scan.risks.some(risk => risk.severity === 'medium')) return 'Medium';
    if (scan.risks.some(risk => risk.severity === 'low')) return 'Low';
    return 'Low';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 text-left text-sm font-medium text-gray-500">Document</th>
            <th className="py-3 text-left text-sm font-medium text-gray-500">Date Scanned</th>
            <th className="py-3 text-left text-sm font-medium text-gray-500">Compliance Score</th>
            <th className="py-3 text-left text-sm font-medium text-gray-500">Risk Level</th>
            <th className="py-3 text-left text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan) => {
            const worstRiskLevel = getWorstRiskLevel(scan);
            return (
              <tr
                key={scan.id}
                className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewDetails(scan)}
              >
                <td className="py-4 text-sm">{scan.documentName}</td>
                <td className="py-4 text-sm">{new Date(scan.timestamp).toLocaleDateString()}</td>
                <td className="py-4 text-sm">{scan.overallScore}%</td>
                <td className="py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityBadgeClass(worstRiskLevel)}`}>
                    {worstRiskLevel}
                  </span>
                </td>
                <td className="py-4 text-sm">
                  <div className="flex space-x-2">
                    {onPreview && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => handlePreview(e, scan)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ComplianceScanTable;
