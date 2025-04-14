
import { jsPDF } from 'jspdf';

/**
 * Add appendix page to the extended audit report
 */
export const addAppendixPage = (
  doc: jsPDF,
  {
    documentName,
    industry,
    companyDetails
  }: {
    documentName: string;
    industry?: string;
    companyDetails?: any;
  }
) => {
  // Set page properties
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add page header
  doc.setFillColor(25, 65, 120);
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('Appendix', pageWidth / 2, 13, { align: 'center' });
  
  // Add files section
  let yPos = 30;
  doc.setFontSize(12);
  doc.setTextColor(25, 65, 120);
  doc.setFont('helvetica', 'bold');
  doc.text('A. Files Scanned', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text(`• ${documentName}`, 30, yPos);
  
  // Add organization metadata section
  yPos += 20;
  doc.setFontSize(12);
  doc.setTextColor(25, 65, 120);
  doc.setFont('helvetica', 'bold');
  doc.text('B. Organization Metadata', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  // Organization Name
  doc.text('Organization Name:', 30, yPos);
  doc.text(companyDetails?.companyName || 'Not specified', 120, yPos);
  
  yPos += 10;
  doc.text('Industry:', 30, yPos);
  doc.text(industry || 'Not specified', 120, yPos);
  
  yPos += 10;
  doc.text('Region:', 30, yPos);
  doc.text('Global', 120, yPos); // Default to Global
  
  yPos += 10;
  doc.text('Compliance Framework:', 30, yPos);
  doc.text(companyDetails?.complianceType || 'Not specified', 120, yPos);
  
  // Add audit confirmation section
  yPos += 20;
  doc.setFontSize(12);
  doc.setTextColor(25, 65, 120);
  doc.setFont('helvetica', 'bold');
  doc.text('C. Audit Confirmation Contact', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  doc.text('For inquiries regarding this audit report, please contact:', 30, yPos);
  
  yPos += 10;
  doc.text('Name:', 30, yPos);
  doc.text('Compliance Officer', 120, yPos);
  
  yPos += 10;
  doc.text('Email:', 30, yPos);
  doc.text('compliance@' + (companyDetails?.companyName || 'yourorganization').toLowerCase().replace(/\s+/g, '') + '.com', 120, yPos);
  
  yPos += 10;
  doc.text('Phone:', 30, yPos);
  doc.text('Please contact your organization administrator', 120, yPos);
  
  // Add terms section
  yPos += 20;
  doc.setFontSize(12);
  doc.setTextColor(25, 65, 120);
  doc.setFont('helvetica', 'bold');
  doc.text('D. Terms & Limitations', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  
  const termsText = "This audit report is generated using AI-powered compliance analysis and is provided for informational purposes only. It does not constitute legal advice or guarantee regulatory compliance. Organizations should consult with qualified compliance professionals before making compliance decisions. The analysis is based on the information available at the time of scanning and may not reflect all compliance requirements for your specific organization or jurisdiction. Results should be reviewed and validated by qualified personnel.";
  
  const termsLines = doc.splitTextToSize(termsText, pageWidth - 40);
  doc.text(termsLines, 20, yPos);
  
  // Add page number
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Page 7',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
};
