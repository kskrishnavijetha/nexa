
import React from 'react';
import { ComplianceReport } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { getScoreColor } from '@/utils/scoreService';
import { formatDate } from '@/utils/dateUtils';

interface RecentScansListProps {
  scans: ComplianceReport[];
  onPreview: (report: ComplianceReport) => void;
}

const RecentScansList: React.FC<RecentScansListProps> = ({ scans, onPreview }) => {
  if (scans.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-500">No compliance reports found.</p>
        <p className="text-sm mt-2 text-slate-400">Upload and analyze documents to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {scans.map((scan, index) => (
        <div 
          key={scan.documentId || index}
          className="flex items-center justify-between p-3 border rounded-lg bg-card"
        >
          <div>
            <p className="font-medium">{scan.documentName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(scan.timestamp)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span 
              className={`text-lg font-bold ${getScoreColor(scan.overallScore)}`}
            >
              {scan.overallScore}%
            </span>
            <Button variant="outline" size="sm" onClick={() => onPreview(scan)}>
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentScansList;
