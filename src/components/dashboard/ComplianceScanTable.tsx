
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ComplianceReport } from '@/utils/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComplianceScanTableProps {
  scans: ComplianceReport[];
}

const ComplianceScanTable: React.FC<ComplianceScanTableProps> = ({ scans }) => {
  const navigate = useNavigate();
  
  const getWorstRiskLevel = (scan: ComplianceReport): string => {
    if (scan.risks.some(risk => risk.severity === 'high')) return 'high';
    if (scan.risks.some(risk => risk.severity === 'medium')) return 'medium';
    if (scan.risks.some(risk => risk.severity === 'low')) return 'low';
    return 'low';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Info className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const handleViewReport = (documentId: string) => {
    // Update to navigate to history with a specific documentId parameter
    navigate(`/history?documentId=${documentId}`);
  };

  const handleRiskLevelClick = (riskLevel: string) => {
    // Navigate to history page with risk filter
    navigate(`/history?riskLevel=${riskLevel}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Risk Level</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Issues</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scans.map((scan) => {
          const riskLevel = getWorstRiskLevel(scan);
          return (
            <TableRow key={scan.documentId}>
              <TableCell className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                {scan.documentName}
              </TableCell>
              <TableCell>
                {new Date(scan.timestamp).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleRiskLevelClick(riskLevel)}
                    className="flex items-center gap-2 hover:underline"
                  >
                    {getRiskIcon(riskLevel)}
                    <Badge 
                      variant={
                        riskLevel === 'high' ? 'destructive' : 
                        riskLevel === 'medium' ? 'outline' : 'secondary'
                      }
                    >
                      {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                    </Badge>
                  </button>
                </div>
              </TableCell>
              <TableCell>
                <span className={getScoreColor(scan.overallScore)}>
                  {scan.overallScore}%
                </span>
              </TableCell>
              <TableCell>{scan.risks.length}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewReport(scan.documentId)}
                >
                  View Report
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ComplianceScanTable;
