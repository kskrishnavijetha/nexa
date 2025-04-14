
import { jsPDF } from 'jspdf';
import { ComplianceReport } from '@/utils/types';
import { ReportConfig } from '@/components/audit/extended-report/types';

/**
 * Add appendix page to the extended report
 */
export const addAppendixPage = (
  doc: jsPDF,
  report: ComplianceReport,
  config: ReportConfig
): void => {
  // Page margin
  const margin = 20;
  let yPos = margin;
  
  // Add section title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 51, 102);
  doc.text('Appendix', margin, yPos);
  yPos += 10;
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, 210 - margin, yPos);
  yPos += 15;
  
  // 1. List of Files Scanned
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text('1. Files Scanned', margin, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  if (report.originalFileName) {
    doc.text(`• ${report.originalFileName}`, margin + 5, yPos);
    yPos += 5;
  } else {
    doc.text(`• ${report.documentName}`, margin + 5, yPos);
    yPos += 5;
  }
  
  if (report.pageCount) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.text(`(${report.pageCount} pages)`, margin + 15, yPos);
    yPos += 10;
  } else {
    yPos += 5;
  }
  
  // 2. Organization Metadata
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text('2. Organization Metadata', margin, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Organization:', margin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(config.organizationName, margin + 35, yPos);
  yPos += 7;
  
  if (report.industry) {
    doc.setFont('helvetica', 'bold');
    doc.text('Industry:', margin + 5, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(report.industry, margin + 35, yPos);
    yPos += 7;
  }
  
  if (report.region) {
    doc.setFont('helvetica', 'bold');
    doc.text('Region:', margin + 5, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(report.region, margin + 35, yPos);
    yPos += 7;
  }
  
  // Compliance scope
  doc.setFont('helvetica', 'bold');
  doc.text('Compliance Scope:', margin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(config.complianceTypes.join(', '), margin + 50, yPos);
  yPos += 15;
  
  // 3. Contact Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text('3. Contact Information', margin, yPos);
  yPos += 10;
  
  if (config.contactInfo) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const contactLines = doc.splitTextToSize(config.contactInfo, 210 - margin * 2 - 5);
    doc.text(contactLines, margin + 5, yPos);
    yPos += contactLines.length * 5 + 5;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('No contact information provided.', margin + 5, yPos);
    yPos += 10;
  }
  
  // 4. Compliance Methodology
  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text('4. Compliance Methodology', margin, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const methodologyText = 'This compliance report was generated using NexaBloom\'s AI-powered compliance analysis engine, which examines documents for regulatory alignment across multiple frameworks. The analysis combines pattern recognition, semantic understanding, and regulatory knowledge to identify potential compliance issues and provide actionable remediation guidance.';
  const methodologyLines = doc.splitTextToSize(methodologyText, 210 - margin * 2 - 5);
  doc.text(methodologyLines, margin + 5, yPos);
  yPos += methodologyLines.length * 5;
  
  // Add report generation note
  yPos += 15;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const generationText = `Report generated on ${new Date().toLocaleDateString()} using NexaBloom AI Compliance Engine version ${config.reportVersion}`;
  doc.text(generationText, margin + 5, yPos);
};
