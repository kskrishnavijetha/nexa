
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ClipboardList, Loader2 } from "lucide-react";
import { generateExtendedAuditReport } from '@/utils/audit/extendedReport';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { CompanyDetailsModal } from './extended-report/CompanyDetailsModal';
import { CompanyDetails } from './types';
import { Industry } from '@/utils/types';
import { Region } from '@/utils/types/common';

interface ExtendedReportButtonProps {
  documentName: string;
  industry?: Industry | string;
}

const ExtendedReportButton: React.FC<ExtendedReportButtonProps> = ({ 
  documentName,
  industry
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const { user } = useAuth();

  const handleGenerateReport = async (companyDetails?: CompanyDetails) => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    const toastId = toast.loading('Generating extended audit report...', { duration: 30000 });
    
    try {
      await generateExtendedAuditReport(documentName, user?.id || null, companyDetails, industry as Industry);
      toast.dismiss(toastId);
      toast.success('Extended audit report downloaded successfully');
    } catch (error) {
      console.error("Failed to generate extended report:", error);
      toast.dismiss(toastId);
      toast.error('Failed to generate extended audit report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClick = () => {
    setShowCompanyModal(true);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isGenerating}
        className="flex gap-1.5 items-center"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
        ) : (
          <ClipboardList className="h-4 w-4 mr-1.5" />
        )}
        Extended Audit-Ready Report
      </Button>
      
      <CompanyDetailsModal 
        isOpen={showCompanyModal} 
        onClose={() => setShowCompanyModal(false)}
        onSubmit={handleGenerateReport}
      />
    </>
  );
};

export default ExtendedReportButton;
