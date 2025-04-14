
import { jsPDF } from 'jspdf';
import { ReportConfig } from '@/components/audit/extended-report/types';
import { getShortHash } from '../../hashVerification';

/**
 * Add signature and verification page to the extended report
 */
export const addSignatureAndVerificationPage = (
  doc: jsPDF,
  documentHash: string,
  config: ReportConfig
): void => {
  // Page margin
  const margin = 20;
  let yPos = margin;
  
  // Add section title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 51, 102);
  doc.text('Document Verification & Signature', margin, yPos);
  yPos += 10;
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, 210 - margin, yPos);
  yPos += 10;
  
  // Add hash verification section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Document Integrity Verification', margin, yPos);
  yPos += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const hashExplanation = 'This document includes a cryptographic hash that ensures the integrity of the report. The hash value can be used to verify that the document has not been tampered with after generation.';
  const hashLines = doc.splitTextToSize(hashExplanation, 210 - margin * 2);
  doc.text(hashLines, margin, yPos);
  yPos += hashLines.length * 5 + 5;
  
  // Add verification hash
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Verification Hash:', margin, yPos);
  yPos += 5;
  
  // Draw hash in a box
  const shortHash = getShortHash(documentHash);
  const fullHash = documentHash;
  
  doc.setFillColor(245, 247, 250);
  doc.rect(margin, yPos, 170, 10, 'F');
  
  doc.setFont('courier', 'normal');
  doc.setFontSize(9);
  doc.text(shortHash, margin + 5, yPos + 6);
  yPos += 15;
  
  // Add full hash explanation
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Full verification hash:', margin, yPos);
  yPos += 4;
  
  // Break the full hash into chunks
  const hashChunks = [];
  for (let i = 0; i < fullHash.length; i += 40) {
    hashChunks.push(fullHash.substring(i, i + 40));
  }
  
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  hashChunks.forEach(chunk => {
    doc.text(chunk, margin, yPos);
    yPos += 3;
  });
  
  yPos += 20;
  
  // Add signature section if enabled
  if (config.includeSignature) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Electronic Signature', margin, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const signatureText = 'The undersigned hereby attests that this compliance report was reviewed and acknowledged.';
    doc.text(signatureText, margin, yPos);
    yPos += 10;
    
    // Draw signature line
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(margin, yPos + 15, margin + 80, yPos + 15);
    
    // Draw signature label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Signature', margin, yPos + 20);
    
    // Draw date line
    doc.line(margin + 100, yPos + 15, margin + 160, yPos + 15);
    
    // Draw date label
    doc.text('Date', margin + 100, yPos + 20);
    
    // Draw name line
    yPos += 30;
    doc.line(margin, yPos + 15, margin + 80, yPos + 15);
    
    // Draw name label
    doc.text('Print Name', margin, yPos + 20);
    
    // Draw title line
    doc.line(margin + 100, yPos + 15, margin + 160, yPos + 15);
    
    // Draw title label
    doc.text('Title / Position', margin + 100, yPos + 20);
  }
  
  // Add page break
  doc.addPage();
};
