
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Shield } from 'lucide-react';
import { ComplianceReport } from '@/utils/types';
import DocumentSelector from '@/components/history/DocumentSelector';
import ComplianceDetails from '@/components/history/ComplianceDetails';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { generateVerificationCode } from '@/utils/audit/hashVerification';

interface ReportsTabContentProps {
  selectedDocument: string | null;
  reports: ComplianceReport[];
  onSelectDocument: (documentName: string) => void;
  analyzingDocument: string | null;
  onDeleteClick: () => void;
  selectedReport: ComplianceReport | null;
}

const ReportsTabContent: React.FC<ReportsTabContentProps> = ({
  selectedDocument,
  reports,
  onSelectDocument,
  analyzingDocument,
  onDeleteClick,
  selectedReport
}) => {
  // Generate SHA-256 verification code for the selected report if available
  // Ensure we're generating a verification code whenever a report is selected
  const verificationCode = selectedReport 
    ? generateVerificationCode(selectedReport.documentName, [selectedReport])
    : null;

  // Log verification code to help with debugging
  if (selectedReport && verificationCode) {
    console.log(`[ReportsTabContent] Generated SHA-256 verification code for ${selectedReport.documentName}: ${verificationCode}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Document Reports</h2>
          {verificationCode && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <Shield className="h-3 w-3 mr-1" />
                    <span>SHA-256 Verified</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">This document has SHA-256 tamper-proof verification.<br />Verification ID: {verificationCode}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-center gap-4">
          {selectedDocument && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
              onClick={onDeleteClick}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Document
            </Button>
          )}
          <DocumentSelector 
            selectedDocument={selectedDocument}
            reports={reports}
            onSelectDocument={onSelectDocument}
            analyzingDocument={analyzingDocument}
          />
        </div>
      </div>
      
      {selectedReport ? (
        <div className="grid grid-cols-1 gap-6">
          <ComplianceDetails report={selectedReport} verificationCode={verificationCode} />
        </div>
      ) : (
        <div className="p-4 border rounded-md bg-slate-50 text-center">
          <p>Select a document to view details</p>
        </div>
      )}
    </div>
  );
};

export default ReportsTabContent;
