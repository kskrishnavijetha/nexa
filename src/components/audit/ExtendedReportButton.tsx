
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ClipboardList, Loader2, Lock } from "lucide-react";
import { generateExtendedAuditReport } from '@/utils/audit/extendedReport';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { CompanyDetailsModal } from './extended-report/CompanyDetailsModal';
import { CompanyDetails } from './types';
import { Industry } from '@/utils/types';
import { Region } from '@/utils/types/common';
import { getSubscription } from '@/utils/paymentService';
import { isFeatureAvailable } from '@/utils/pricingData';

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
  
  // Check if the user's subscription plan allows extended reports
  const subscription = getSubscription(user?.id);
  const canUseExtendedReports = subscription && 
    isFeatureAvailable('extendedAuditReports', subscription.plan);
  
  const addChartComponent = async () => {
    // Create a temporary div to render chart for capturing
    const tempContainer = document.createElement('div');
    tempContainer.className = 'audit-chart';
    tempContainer.style.width = '600px';
    tempContainer.style.height = '400px';
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    
    // Create a simple chart with colored bars
    tempContainer.innerHTML = `
      <div style="display:flex; align-items:flex-end; height:200px; gap:20px; padding:20px;">
        <div style="height:65%; width:60px; background-color:#dc3545; position:relative;">
          <span style="position:absolute; bottom:-25px; text-align:center; width:100%;">High</span>
          <span style="position:absolute; top:-25px; text-align:center; width:100%;">15%</span>
        </div>
        <div style="height:85%; width:60px; background-color:#ffc107; position:relative;">
          <span style="position:absolute; bottom:-25px; text-align:center; width:100%;">Medium</span>
          <span style="position:absolute; top:-25px; text-align:center; width:100%;">35%</span>
        </div>
        <div style="height:50%; width:60px; background-color:#28a745; position:relative;">
          <span style="position:absolute; bottom:-25px; text-align:center; width:100%;">Low</span>
          <span style="position:absolute; top:-25px; text-align:center; width:100%;">50%</span>
        </div>
      </div>
      <div style="padding:20px;">
        <h3 style="font-size:16px; margin-bottom:10px;">Risk Distribution</h3>
        <p style="font-size:12px; color:#666;">Distribution of compliance risks by severity</p>
      </div>
    `;
    
    document.body.appendChild(tempContainer);
    
    // Return the tempContainer so it can be removed after capturing
    return tempContainer;
  };

  const handleGenerateReport = async (companyDetails?: CompanyDetails) => {
    if (isGenerating) return;
    
    // Check if user can use extended reports
    if (!canUseExtendedReports) {
      toast.error('Extended audit reports are not available in your current plan. Please upgrade to Pro or Enterprise.');
      return;
    }
    
    setIsGenerating(true);
    const toastId = toast.loading('Generating extended audit report...', { duration: 30000 });
    
    // Add temporary chart for capturing
    const chartContainer = await addChartComponent();
    
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
      // Remove temporary chart container
      if (chartContainer && chartContainer.parentNode) {
        chartContainer.parentNode.removeChild(chartContainer);
      }
    }
  };

  const handleClick = () => {
    if (!canUseExtendedReports) {
      toast.error('Extended audit reports are only available in Pro and Enterprise plans. Please upgrade your plan.');
      return;
    }
    setShowCompanyModal(true);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isGenerating || !canUseExtendedReports}
        className="flex gap-1.5 items-center"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
        ) : !canUseExtendedReports ? (
          <Lock className="h-4 w-4 mr-1.5" />
        ) : (
          <ClipboardList className="h-4 w-4 mr-1.5" />
        )}
        Extended Audit-Ready Report
        {!canUseExtendedReports && <span className="ml-1 text-xs">(Pro+)</span>}
      </Button>
      
      {canUseExtendedReports && (
        <CompanyDetailsModal 
          isOpen={showCompanyModal} 
          onClose={() => setShowCompanyModal(false)}
          onSubmit={handleGenerateReport}
        />
      )}
    </>
  );
};

export default ExtendedReportButton;
