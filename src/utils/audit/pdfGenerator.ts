
import { AuditEvent } from '@/components/audit/types';
import { jsPDF } from 'jspdf';
import { calculateReportStatistics } from './reportStatistics';
import { AIInsight } from './types';
import { generateAIInsights } from './insights';
import { addExecutiveSummary } from './pdf/addExecutiveSummary';
import { addInsightsSection } from './pdf/addInsightsSection';
import { addSummarySection } from './pdf/addSummarySection';
import { addFooter } from './pdf/addFooter';
import { generateChainHash } from './logIntegrity';
import { Industry } from '@/utils/types';

/**
 * Generate a PDF report with AI-enhanced insights from audit events
 */
export const generatePDFReport = async (
  documentName: string,
  auditEvents: AuditEvent[],
  selectedIndustry?: Industry,
  complianceScore?: number,
  complianceStatus?: string
): Promise<Blob> => {
  console.log(`[pdfGenerator] Generating PDF report for ${documentName}`);
  console.log(`[pdfGenerator] Selected industry parameter: ${selectedIndustry || 'not specified'}`);
  console.log(`[pdfGenerator] Compliance score: ${complianceScore !== undefined ? complianceScore + '%' : 'not calculated'}`);
  console.log(`[pdfGenerator] Compliance status: ${complianceStatus || 'not specified'}`);
  
  // Generate integrity hash for the events
  const integrityHash = await generateChainHash(auditEvents);
  
  // Create PDF with a slightly larger page size (a4+ format)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true
  });
  
  // Set reasonable margins
  const margin = 20; // 20mm margins
  pdf.setProperties({
    title: `Audit Report - ${documentName}`,
    subject: 'AI-Enhanced Compliance Report',
    creator: 'Nexabloom Compliance Report Generator'
  });
  
  // Add executive summary with document info - pass the industry explicitly
  // Also pass compliance score and status if available
  let yPos = addExecutiveSummary(pdf, auditEvents, documentName, selectedIndustry, complianceScore, complianceStatus);
  
  // Report Statistics
  const stats = calculateReportStatistics(auditEvents);
  
  // AI-Generated Insights based on industry and document
  // Use the document name and industry to help determine the insights
  const insights: AIInsight[] = generateAIInsights(auditEvents, documentName, selectedIndustry);
  
  // Check if we need a new page before insights section
  if (yPos > 220) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Add risk and recommendation insights section with padding
  yPos = addInsightsSection(pdf, insights, yPos + 10);
  
  // Check if we need a new page before summary section
  if (yPos > 220) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Add summary statistics and findings section with padding
  // Pass document name and selected industry to allow industry-specific findings
  yPos = addSummarySection(pdf, stats, yPos + 10, documentName, selectedIndustry);
  
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
  
  // Add footer with integrity hash to all pages - must be last operation
  addFooter(pdf, integrityHash);
  
  // Return the PDF as a blob
  return pdf.output('blob');
};
