
import { jsPDF } from 'jspdf';
import { AuditEvent } from '@/components/audit/types';
import { Industry } from '@/utils/types';

/**
 * Add executive summary section to the PDF report
 */
export const addExecutiveSummary = (
  doc: jsPDF, 
  auditEvents: AuditEvent[], 
  documentName: string, 
  industry?: Industry,
  complianceScore?: number,
  complianceStatus?: string
): number => {
  // Add the report title
  doc.setFontSize(24);
  doc.setTextColor(0, 51, 102);
  doc.text('AI-Enhanced Audit Report', 20, 20);
  
  // Add document info
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`Document: ${documentName}`, 20, 30);
  
  // Add industry info if available
  if (industry) {
    doc.setFontSize(12);
    doc.text(`Industry Classification: ${industry}`, 20, 37);
  }

  // Add compliance score if available 
  if (complianceScore !== undefined) {
    doc.setFontSize(14);
    
    // Set color based on compliance score
    if (complianceScore >= 80) {
      doc.setTextColor(0, 128, 0); // Green for good compliance
    } else if (complianceScore >= 60) {
      doc.setTextColor(255, 165, 0); // Orange for moderate compliance
    } else {
      doc.setTextColor(200, 0, 0); // Red for poor compliance
    }
    
    doc.text(`Compliance Score: ${complianceScore}%`, 20, 45);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
  }
  
  // Add compliance status if available
  if (complianceStatus) {
    doc.setFontSize(14);
    
    // Set color based on status
    if (complianceStatus === 'Compliant') {
      doc.setTextColor(0, 128, 0); // Green for compliant
    } else {
      doc.setTextColor(200, 0, 0); // Red for non-compliant
    }
    
    doc.text(`Status: ${complianceStatus}`, 20, complianceScore !== undefined ? 52 : 45);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
  }
  
  // Add generation info
  const date = new Date();
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`, 20, complianceStatus ? 60 : (complianceScore !== undefined ? 52 : 45));
  doc.text(`Total events analyzed: ${auditEvents.length}`, 20, complianceStatus ? 65 : (complianceScore !== undefined ? 57 : 50));
  
  // Return the current y position for the next section
  return complianceStatus ? 75 : (complianceScore !== undefined ? 67 : 60);
};
