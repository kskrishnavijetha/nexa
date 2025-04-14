
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
  
  // Add background color
  doc.setFillColor(250, 250, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Add header
  doc.setFillColor(40, 80, 140);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('Document Integrity Verification', pageWidth / 2, 13, { align: 'center' });
  
  // Add content
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(12);
  doc.text('Document Integrity Information', 20, 40);
  
  // Document metadata
  let yPos = 60;
  doc.setFontSize(10);
  doc.text(`Document: ${documentName}`, 25, yPos);
  yPos += 10;
  doc.text(`Verification Date: ${formatDate(new Date().toISOString())}`, 25, yPos);
  yPos += 10;
  doc.text(`Verification Hash: ${verificationMetadata.hash}`, 25, yPos);
  yPos += 10;
  doc.text(`Short Hash: ${verificationMetadata.shortHash}`, 25, yPos);
  yPos += 20;
  
  // How verification works
  doc.setFontSize(12);
  doc.text('How Verification Works', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(10);
  const verificationText = [
    'This report includes a unique digital signature that helps verify its integrity and authenticity.',
    'The verification hash is calculated based on all audit events included in this report.',
    'If any information in the audit trail is modified or tampered with, the verification hash will change.',
    'You can verify the integrity of this document by comparing the hash with the one stored in your secure systems.'
  ];
  
  verificationText.forEach(text => {
    doc.text(text, 25, yPos);
    yPos += 10;
  });
  
  yPos += 15;
  
  // Verification instructions
  doc.setFontSize(12);
  doc.text('Verification Instructions', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(10);
  const instructions = [
    '1. Store the verification hash in a secure location separate from this report',
    '2. When auditing, recalculate the hash using the original audit data',
    '3. Compare the new hash with the one stored previously',
    '4. If they match, the audit trail has not been modified'
  ];
  
  instructions.forEach(text => {
    doc.text(text, 25, yPos);
    yPos += 10;
  });
  
  // Add footer
  doc.setDrawColor(40, 80, 140);
  doc.setLineWidth(1);
  doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
  
  // Add page number
  doc.setFontSize(8);
  doc.text('Integrity Verification Page', pageWidth - 25, pageHeight - 10);
};
