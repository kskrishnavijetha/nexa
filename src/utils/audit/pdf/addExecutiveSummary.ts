
import { jsPDF } from 'jspdf';
import { AuditEvent } from '@/components/audit/types';
import { Industry } from '@/utils/types';
import { formatDate } from '@/utils/fileUtils';
import { mapToIndustryType } from '../industryUtils';

/**
 * Add executive summary section to the PDF
 */
export const addExecutiveSummary = (
  pdf: jsPDF, 
  auditEvents: AuditEvent[], 
  documentName: string,
  industry?: Industry,
  verificationCode?: string
): number => {
  // Start position
  let yPos = 20;
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Set font for title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(44, 62, 80); // Dark blue-gray
  pdf.text('COMPLIANCE AUDIT REPORT', margin, yPos);
  yPos += 15;
  
  // Add company logo (optional)
  // pdf.addImage(logoBase64, 'PNG', pageWidth - 60, 20, 40, 15);
  
  // Add horizontal line
  pdf.setDrawColor(52, 152, 219); // Blue
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;
  
  // General document info
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Document Information', margin, yPos);
  yPos += 8;
  
  // Document name and date
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(60, 60, 60);
  
  const createDate = auditEvents.length > 0 
    ? new Date(Math.min(...auditEvents.map(e => new Date(e.timestamp).getTime())))
    : new Date();
    
  const lastModified = auditEvents.length > 0
    ? new Date(Math.max(...auditEvents.map(e => new Date(e.timestamp).getTime())))
    : new Date();
  
  // Organize document information in two columns
  const leftColX = margin;
  const rightColX = pageWidth / 2 + 10;
  
  // Left column
  pdf.text(`Document Name:`, leftColX, yPos);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${documentName}`, leftColX + 35, yPos);
  pdf.setFont('helvetica', 'normal');
  yPos += 7;
  
  pdf.text(`Created:`, leftColX, yPos);
  pdf.text(`${formatDate(createDate)}`, leftColX + 35, yPos);
  yPos += 7;
  
  pdf.text(`Last Modified:`, leftColX, yPos);
  pdf.text(`${formatDate(lastModified)}`, leftColX + 35, yPos);
  yPos += 7;
  
  // Right column
  const mappedIndustry = industry ? mapToIndustryType(industry) : undefined;
  
  pdf.text(`Industry:`, rightColX, yPos - 14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${mappedIndustry || 'Not specified'}`, rightColX + 35, yPos - 14);
  pdf.setFont('helvetica', 'normal');
  
  pdf.text(`Audit Events:`, rightColX, yPos - 7);
  pdf.text(`${auditEvents.length}`, rightColX + 35, yPos - 7);
  
  pdf.text(`Report Type:`, rightColX, yPos);
  pdf.text(`Compliance Audit`, rightColX + 35, yPos);
  
  yPos += 15;
  
  // Add verification code if available
  if (verificationCode) {
    pdf.setDrawColor(52, 152, 219); // Blue
    pdf.setLineWidth(0.25);
    pdf.setFillColor(240, 248, 255); // Light blue background
    pdf.roundedRect(margin, yPos, pageWidth - (margin * 2), 22, 3, 3, 'FD');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 100, 0); // Dark green for security
    pdf.text('VERIFICATION CODE', margin + 10, yPos + 8);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);
    pdf.text('This document is tamper-proof and can be verified using the following code:', 
             margin + 10, yPos + 16);
    
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(10);
    pdf.text(verificationCode, pageWidth - margin - 85, yPos + 16);
    
    yPos += 30;
  } else {
    yPos += 8;
  }
  
  // Add compliance benchmark section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Executive Summary', margin, yPos);
  yPos += 8;
  
  // Executive summary text - customized based on industry if available
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(60, 60, 60);
  
  let executiveSummary = `This report provides a comprehensive audit trail and compliance analysis for "${documentName}". `;
  
  // Add industry-specific text if industry is provided
  if (mappedIndustry) {
    switch(mappedIndustry) {
      case 'Healthcare':
        executiveSummary += 'The analysis focuses on healthcare regulatory compliance requirements including HIPAA, HL7 standards, and patient data protection measures. ';
        break;
      case 'Finance':
        executiveSummary += 'The analysis evaluates financial regulatory compliance including SOX, FINRA, and data security practices for financial information. ';
        break;
      case 'Legal Services':
        executiveSummary += 'The analysis evaluates legal document compliance with applicable regulations, confidentiality requirements, and document handling procedures. ';
        break;
      case 'Technology':
        executiveSummary += 'The analysis covers technology industry standards including data privacy regulations, security frameworks, and software compliance requirements. ';
        break;
      case 'Government':
        executiveSummary += 'The analysis addresses government regulatory requirements, public records management, and compliance with applicable federal and state regulations. ';
        break;
      case 'Education':
        executiveSummary += 'The analysis covers educational compliance requirements including FERPA, accessibility standards, and educational data management practices. ';
        break;
      default:
        executiveSummary += 'The analysis provides a general compliance overview based on standard regulatory requirements and best practices. ';
    }
  } else {
    executiveSummary += 'The analysis provides a general compliance overview based on standard regulatory requirements and best practices. ';
  }
  
  executiveSummary += 'This report documents all activities, changes, and verifications performed on this document, providing a complete audit trail for compliance purposes.';
  
  // Split text to multiple lines
  const splitTitle = pdf.splitTextToSize(executiveSummary, pageWidth - (margin * 2));
  pdf.text(splitTitle, margin, yPos);
  
  yPos += splitTitle.length * 6 + 5;
  
  return yPos;
};
