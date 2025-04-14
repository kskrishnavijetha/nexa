
import { jsPDF } from 'jspdf';
import { formatDate } from '@/components/audit/auditUtils';

/**
 * Add integrity verification page to extended audit report
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
  
  // Add dark blue header banner
  doc.setFillColor(20, 60, 120);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  // Add header title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Document Integrity & Verification', pageWidth / 2, 17, { align: 'center' });
  
  // Add introductory text
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  let yPos = 50;
  
  const introText = 'This section provides cryptographic verification of the audit report integrity. The hash signature can be used';
  const introText2 = 'to verify that the report has not been altered since generation.';
  
  doc.text(introText, 75, yPos);
  yPos += 8;
  doc.text(introText2, 75, yPos);
  
  // Draw verification box with rounded corners
  yPos = 110;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(1);
  doc.roundedRect(75, yPos, pageWidth - 150, 200, 5, 5);
  
  // Add "Document Hash Verification" title in the box
  yPos += 30;
  doc.setTextColor(20, 60, 120);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Document Hash Verification', pageWidth / 2, yPos, { align: 'center' });
  
  // Add verification metadata
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  yPos += 40;
  
  // Document ID
  doc.setFont('helvetica', 'bold');
  doc.text('Document ID:', 100, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(verificationMetadata.shortHash || "Not Available", 180, yPos);
  
  // Complete Hash
  yPos += 45;
  doc.setFont('helvetica', 'bold');
  doc.text('Complete Hash:', 100, yPos);
  doc.setFont('helvetica', 'normal');
  
  // Format the complete hash - if too long, break it into two lines
  const fullHash = verificationMetadata.hash || "Not Available";
  if (fullHash.length > 60) {
    doc.text(fullHash.substring(0, 60), pageWidth / 2, yPos, { align: 'center' });
    doc.text(fullHash.substring(60), pageWidth / 2, yPos + 12, { align: 'center' });
  } else {
    doc.text(fullHash, pageWidth / 2, yPos, { align: 'center' });
  }
  
  // Generation Date
  yPos += 45;
  doc.setFont('helvetica', 'bold');
  doc.text('Generation Date:', 100, yPos);
  doc.setFont('helvetica', 'normal');
  
  // Format the date in the desired format: YYYY-MM-DDThh:mm:ss.sssZ
  const timestamp = verificationMetadata.timestamp || new Date().toISOString();
  const formattedDate = timestamp.replace(/\.\d+Z$/, 'Z'); // Remove milliseconds
  doc.text(formattedDate, 180, yPos);
  
  // Add page number at the bottom
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Document Integrity & Verification Page', pageWidth / 2, pageHeight - 10, { align: 'center' });
};
