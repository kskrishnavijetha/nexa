
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { ComplianceRisk, ComplianceReport } from '@/utils/types';
import { getSeverityIcon } from './RiskSummaryUtils';
import { useNavigate } from 'react-router-dom';

interface RisksTableProps {
  risks: ComplianceRisk[];
  selectedReport?: ComplianceReport | null;
  limit?: number;
}

const RisksTable: React.FC<RisksTableProps> = ({
  risks,
  selectedReport,
  limit = 3
}) => {
  const navigate = useNavigate();
  
  if (risks.length === 0) return null;
  
  return (
    <Table className="text-xs">
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">Severity</TableHead>
          <TableHead>Issue</TableHead>
          <TableHead className="w-24">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {risks.slice(0, limit).map((risk, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center">
                {getSeverityIcon(risk.severity)}
              </div>
            </TableCell>
            <TableCell className="font-medium truncate max-w-[180px]">
              {risk.description}
            </TableCell>
            <TableCell>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs"
                onClick={() => navigate(
                  selectedReport 
                    ? '/history?document=' + encodeURIComponent(selectedReport.documentName)
                    : '/history'
                )}
              >
                Review
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RisksTable;
