
import { jsPDF } from 'jspdf';
import { AuditEvent } from '@/components/audit/types';
import { Industry } from '@/utils/types';
import { mapToIndustryType } from '../industryUtils';

/**
 * Add executive summary section to the PDF document
 * 
 * @param pdf - The PDF document
 * @param auditEvents - Array of audit events
 * @param documentName - Name of the document
 * @param selectedIndustry - Selected industry for compliance context
 * @param verificationCode - Hash-based verification code for tamper-proofing
 * @returns Position on y-axis after adding content
 */
export const addExecutiveSummary = (
  pdf: jsPDF, 
  auditEvents: AuditEvent[], 
  documentName: string,
  selectedIndustry?: Industry,
  verificationCode?: string
): number => {
  // Title and document information
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Audit Report', 20, 30);
  
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  let yPos = 45;
  
  // Document section
  pdf.setFont('helvetica', 'bold');
  pdf.text('Document:', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.text(documentName, 60, yPos);
  yPos += 8;
  
  // Date section
  pdf.setFont('helvetica', 'bold');
  pdf.text('Generated:', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.text(new Date().toLocaleString(), 60, yPos);
  yPos += 8;
  
  // Events count
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total Events:', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.text(auditEvents.length.toString(), 60, yPos);
  yPos += 8;
  
  // Industry and compliance context if available
  if (selectedIndustry) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Industry:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(selectedIndustry, 60, yPos);
    yPos += 8;

    // Get applicable regulations based on industry
    const industryType = mapToIndustryType(selectedIndustry);
    const regulations = getRegulationsForIndustry(industryType);
    
    if (regulations.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Regulations:', 20, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(regulations.join(', '), 60, yPos);
      yPos += 8;
    }
  }

  // Add verification information if available (for regulated industries)
  if (verificationCode) {
    yPos += 4; // Add some extra space
    pdf.setFont('helvetica', 'bold');
    pdf.text('Verification:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(verificationCode, 60, yPos);
    yPos += 8;
    
    // Add explanation for verification code
    pdf.setFontSize(9);
    pdf.setTextColor(80, 80, 80);
    pdf.text('This report includes cryptographic verification to ensure audit trail integrity.', 20, yPos);
    pdf.text('The verification code can be validated to prove that audit data has not been tampered with.', 20, yPos + 4);
    yPos += 12;
  }
  
  // Reset font for the next section
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  
  // Add a separator line
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.line(20, yPos, 190, yPos);
  yPos += 10;
  
  // Executive Summary text
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('Executive Summary', 20, yPos);
  yPos += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  
  // Create summary text based on the audit events and industry
  const summaryText = createSummaryText(auditEvents, selectedIndustry, documentName);
  
  // Split the text into multiple lines based on the page width
  const splitText = pdf.splitTextToSize(summaryText, 170);
  pdf.text(splitText, 20, yPos);
  
  // Update yPos based on how many lines of text were added
  yPos += splitText.length * 6 + 10;
  
  return yPos;
};

/**
 * Create a summary text based on audit events and industry
 */
function createSummaryText(auditEvents: AuditEvent[], industry?: Industry, documentName?: string): string {
  // Create different summaries based on industry for more relevant context
  const completedEvents = auditEvents.filter(e => e.status === 'completed').length;
  const pendingEvents = auditEvents.filter(e => e.status === 'pending').length;
  
  let summary = `This report provides a comprehensive audit trail for "${documentName || 'the document'}" `;
  summary += `with ${auditEvents.length} recorded events, of which ${completedEvents} are completed and ${pendingEvents} are pending. `;
  
  if (industry) {
    switch (industry) {
      case 'Healthcare':
        summary += `In the Healthcare industry, this report helps maintain compliance with HIPAA regulations by tracking all access and modifications to sensitive patient data. The audit trail has been cryptographically verified to ensure integrity.`;
        break;
      case 'Finance & Banking':
        summary += `For Financial services, this audit report helps demonstrate compliance with regulations such as SOX and GLBA by providing a tamper-evident record of all document activities. The verification system ensures that audit data remains authentic and unmodified.`;
        break;
      case 'Legal Services':
        summary += `For Legal organizations, this audit report provides chain-of-custody evidence with tamper-evident verification to ensure document integrity. This cryptographic verification can help meet legal evidentiary standards.`;
        break;
      default:
        summary += `The audit trail includes cryptographic verification to ensure data integrity, providing a reliable record of all activities related to this document. This verification system is particularly valuable for compliance in regulated industries.`;
    }
  } else {
    summary += `The tamper-proof audit trail provides verification of all document activities and ensures the integrity of your compliance records.`;
  }
  
  return summary;
}

/**
 * Get applicable regulations for an industry
 */
function getRegulationsForIndustry(industry: string): string[] {
  switch (industry) {
    case 'Healthcare':
      return ['HIPAA', 'GDPR', 'HHS Regulations'];
    case 'Finance':
    case 'Finance & Banking':
      return ['SOX', 'GLBA', 'PCI-DSS', 'Basel III'];
    case 'Retail':
    case 'Retail & Consumer':
      return ['PCI-DSS', 'GDPR', 'CCPA'];
    case 'Legal Services':
      return ['GDPR', 'Attorney-Client Privilege Regulations', 'Bar Association Rules'];
    case 'Government':
    case 'Government & Public Sector':
      return ['FISMA', 'FedRAMP', 'NIST Standards'];
    case 'Education':
      return ['FERPA', 'GDPR', 'State Education Regulations'];
    default:
      return ['ISO 27001', 'GDPR', 'Industry Best Practices'];
  }
}
