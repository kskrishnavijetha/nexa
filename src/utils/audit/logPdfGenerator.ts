
import { AuditEvent } from '@/components/audit/types';
import { jsPDF } from 'jspdf';
import { generateChainHash } from './logIntegrity';
import { addFooter } from './pdf/addFooter';
import { addEventsSection } from './pdf/addEventsSection';

/**
 * Generate a simplified PDF report with only audit logs
 */
export const generateLogReport = async (
  documentName: string,
  auditEvents: AuditEvent[]
): Promise<Blob> => {
  console.log(`[logPdfGenerator] Generating logs-only report for ${documentName}`);
  
  // Generate integrity hash for the events
  const integrityHash = await generateChainHash(auditEvents);
  
  // Create PDF with standard a4 format
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true
  });
  
  pdf.setProperties({
    title: `Audit Logs - ${documentName}`,
    subject: 'Compliance Audit Logs',
    creator: 'Nexabloom Compliance System'
  });
  
  // Add title
  pdf.setFontSize(22);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Audit Logs Report', 20, 20);
  
  // Add document info
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Document: ${documentName}`, 20, 35);
  
  // Add generation info
  const date = new Date();
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`, 20, 45);
  pdf.text(`Total events: ${auditEvents.length}`, 20, 50);
  
  // Add events section starting at position 60
  let yPos = addEventsSection(pdf, auditEvents, 60);
  
  // Check if we need a new page for integrity verification
  if (yPos > 240) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Add integrity verification section
  pdf.setFontSize(14);
  pdf.setTextColor(0, 102, 0);
  pdf.text('Log Integrity Verification', 20, yPos);
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`This report's integrity is verified using SHA-256 cryptographic hashing.`, 20, yPos + 7);
  pdf.text(`Verification Hash: ${integrityHash.substring(0, 32)}...`, 20, yPos + 14);
  pdf.text(`Generation Timestamp: ${new Date().toISOString()}`, 20, yPos + 21);
  
  // Add footer with integrity hash to all pages
  addFooter(pdf, integrityHash);
  
  // Return the PDF as a blob
  return pdf.output('blob');
};
