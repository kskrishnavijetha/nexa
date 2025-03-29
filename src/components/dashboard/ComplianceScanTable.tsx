
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ChevronRight, Trash2 } from 'lucide-react';
import { ComplianceReport } from '@/utils/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { deleteReportFromHistory } from '@/utils/historyService';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ComplianceScanTableProps {
  scans: ComplianceReport[];
  onPreview?: (report: ComplianceReport) => void;
  onDelete?: (documentId: string) => void;
}

const ComplianceScanTable: React.FC<ComplianceScanTableProps> = ({ 
  scans, 
  onPreview,
  onDelete
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [reportToDelete, setReportToDelete] = React.useState<ComplianceReport | null>(null);

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

  const handleDeleteClick = (e: React.MouseEvent, report: ComplianceReport) => {
    e.stopPropagation();
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (reportToDelete) {
      const deleted = deleteReportFromHistory(reportToDelete.documentId);
      if (deleted) {
        toast.success(`Document "${reportToDelete.documentName}" has been permanently deleted`);
        if (onDelete) {
          onDelete(reportToDelete.documentId);
        }
      } else {
        toast.error("Failed to delete document");
      }
      setReportToDelete(null);
    }
    setDeleteDialogOpen(false);
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
    <>
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
                        className="text-red-600 hover:text-red-800"
                        onClick={(e) => handleDeleteClick(e, scan)}
                        title="Delete permanently"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document Permanently</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{reportToDelete?.documentName}"? This action cannot be undone and the document will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ComplianceScanTable;
