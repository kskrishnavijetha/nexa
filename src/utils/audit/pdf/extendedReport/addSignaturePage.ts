
import { jsPDF } from 'jspdf';
import { formatDate } from '@/components/audit/auditUtils';

/**
 * Add electronic signature page to extended audit report
 */
export const addSignaturePage = (
  doc: jsPDF,
  {
    documentName,
    companyDetails
  }: {
    documentName: string;
    companyDetails?: any;
  }
) => {
  // Set page properties
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add header
  doc.setFillColor(25, 65, 120);
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('Electronic Signature', pageWidth / 2, 13, { align: 'center' });
  
  // Add content
  let yPos = 40;
  
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text('Certification and Approval', 20, yPos);
  
  yPos += 20;
  
  // Add certification text
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const certificationText = [
    'I certify that I have reviewed this extended compliance audit report and confirm that the information contained within',
    'is accurate to the best of my knowledge. I understand that this document may be presented to regulatory authorities,',
    'internal auditors, and other stakeholders as part of our organization\'s compliance documentation.'
  ];
  
  certificationText.forEach(line => {
    doc.text(line, 20, yPos);
    yPos += 6;
  });
  
  yPos += 15;
  
  // Add signature boxes
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);
  
  // First signature - Compliance Officer
  doc.text('Compliance Officer Signature:', 20, yPos);
  yPos += 5;
  doc.rect(20, yPos, 70, 30);
  yPos += 40;
  
  doc.text('Name:', 20, yPos);
  doc.line(35, yPos, 120, yPos);
  yPos += 15;
  
  doc.text('Date:', 20, yPos);
  doc.line(35, yPos, 120, yPos);
  yPos += 15;
  
  doc.text('Position:', 20, yPos);
  doc.line(45, yPos, 120, yPos);
  yPos += 25;
  
  // Second signature - Executive Approval
  doc.text('Executive Approval:', 20, yPos);
  yPos += 5;
  doc.rect(20, yPos, 70, 30);
  yPos += 40;
  
  doc.text('Name:', 20, yPos);
  doc.line(35, yPos, 120, yPos);
  yPos += 15;
  
  doc.text('Date:', 20, yPos);
  doc.line(35, yPos, 120, yPos);
  yPos += 15;
  
  doc.text('Position:', 20, yPos);
  doc.line(45, yPos, 120, yPos);
  
  // Add company information if available
  if (companyDetails && companyDetails.companyName) {
    const companyInfoY = pageHeight - 40;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Report generated for: ${companyDetails.companyName}`, pageWidth / 2, companyInfoY, { align: 'center' });
    
    const dateGenerated = formatDate(new Date().toISOString());
    doc.text(`Report date: ${dateGenerated}`, pageWidth / 2, companyInfoY + 6, { align: 'center' });
    
    // Add document name for reference
    doc.text(`Document: ${documentName}`, pageWidth / 2, companyInfoY + 12, { align: 'center' });
  }
  
  // Add page number
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Electronic Signature Page', pageWidth / 2, pageHeight - 10, { align: 'center' });
};
