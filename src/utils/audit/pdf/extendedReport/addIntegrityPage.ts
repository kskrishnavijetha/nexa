
import { jsPDF } from 'jspdf';

/**
 * Add integrity verification page to the extended audit report
 */
export const addIntegrityPage = (
  doc: jsPDF,
  {
    documentName,
    verificationMetadata
  }: {
    documentName: string;
    verificationMetadata: any;
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
  doc.text('Document Integrity & Verification', pageWidth / 2, 13, { align: 'center' });
  
  // Add section description
  let yPos = 30;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const descriptionText = `This section provides cryptographic verification of the audit report integrity. The hash signature can be used to verify that the report has not been altered since generation.`;
  
  const descriptionLines = doc.splitTextToSize(descriptionText, pageWidth - 40);
  doc.text(descriptionLines, 20, yPos);
  
  // Update position based on number of lines
  yPos += descriptionLines.length * 6 + 15;
  
  // Add hash verification box
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(20, yPos, pageWidth - 40, 80, 3, 3, 'FD');
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setTextColor(25, 65, 120);
  doc.setFont('helvetica', 'bold');
  doc.text('Document Hash Verification', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('Document ID:', 40, yPos);
  
  doc.setFont('courier', 'normal');
  doc.text(verificationMetadata.shortHash, 80, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.text('Complete Hash:', 40, yPos);
  
  yPos += 10;
  doc.setFont('courier', 'normal');
  const hashLines = doc.splitTextToSize(verificationMetadata.hash, pageWidth - 80);
  doc.text(hashLines, 40, yPos);
  
  yPos += hashLines.length * 10 + 10;
  doc.setFont('helvetica', 'normal');
  doc.text('Generation Date:', 40, yPos);
  
  doc.setFont('courier', 'normal');
  doc.text(new Date().toISOString(), 80, yPos);
  
  // Add signature section
  yPos += 40;
  doc.setFontSize(11);
  doc.setTextColor(25, 65, 120);
  doc.setFont('helvetica', 'bold');
  doc.text('Electronic Signature', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(40, yPos, pageWidth - 40, yPos);
  
  yPos += 5;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Signature', 40, yPos);
  
  yPos += 30;
  doc.line(40, yPos, pageWidth - 40, yPos);
  
  yPos += 5;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Name / Title', 40, yPos);
  
  yPos += 30;
  doc.line(40, yPos, pageWidth / 2 - 10, yPos);
  
  doc.line(pageWidth / 2 + 10, yPos, pageWidth - 40, yPos);
  
  yPos += 5;
  doc.text('Date', 40, yPos);
  doc.text('Organization', pageWidth / 2 + 10, yPos);
  
  // Add page number
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Page 6',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
};
