
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  // Find duplicate document names
  const documentNameCounts: Record<string, number> = {};
  scans.forEach(scan => {
    documentNameCounts[scan.documentName] = (documentNameCounts[scan.documentName] || 0) + 1;
  });

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Date Scanned</TableHead>
              <TableHead>Compliance Score</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scans.map((scan) => {
              const worstRiskLevel = getWorstRiskLevel(scan);
              const isDuplicate = documentNameCounts[scan.documentName] > 1;
              
              // Generate display name with ID for duplicates
              const displayName = isDuplicate 
                ? `${scan.documentName} (ID: ${scan.documentId.slice(-4)})` 
                : scan.documentName;
                
              return (
                <TableRow
                  key={scan.id || scan.documentId}
                  className="hover:bg-slate-50 cursor-pointer"
                  onClick={() => handleViewDetails(scan)}
                >
                  <TableCell className="font-medium">
                    {displayName}
                  </TableCell>
                  <TableCell>
                    {new Date(scan.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{scan.overallScore}%</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityBadgeClass(worstRiskLevel)}`}>
                      {worstRiskLevel}
                    </span>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
