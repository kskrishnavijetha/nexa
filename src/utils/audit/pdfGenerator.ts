
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
import { calculateComplianceScore } from './pdf/findings/calculateComplianceScore';
import { generateComplianceFindings } from './pdf/findings/generateComplianceFindings';

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
  
  // Add risk and recommendation insights section with padding
  yPos = addInsightsSection(pdf, insights, yPos + 10);
  
  // Check if we need a new page before adding the summary statistics section
  if (yPos > 220) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Add summary statistics and findings section with padding
  // Pass document name and selected industry to allow industry-specific findings
  yPos = addSummarySection(pdf, stats, yPos + 10, documentName, selectedIndustry);
  
  // Add integrity verification section
  pdf.setFontSize(14);
  pdf.setTextColor(0, 102, 0);
  pdf.text('Log Integrity Verification', 20, yPos);
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`This report's integrity is verified using SHA-256 cryptographic hashing.`, 20, yPos + 7);
  pdf.text(`Verification Hash: ${integrityHash.substring(0, 32)}...`, 20, yPos + 14);
  pdf.text(`Generation Timestamp: ${new Date().toISOString()}`, 20, yPos + 21);
  
  // Add a new page for Compliance Results
  pdf.addPage();
  
  // Add Compliance Results & Final Score section
  let complianceYPos = 20;
  pdf.setFontSize(22);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Compliance Results & Final Score', 20, complianceYPos);
  complianceYPos += 15;
  
  // Add horizontal divider
  pdf.setDrawColor(0, 51, 102);
  pdf.setLineWidth(0.5);
  pdf.line(20, complianceYPos, 190, complianceYPos);
  complianceYPos += 15;
  
  // If compliance score wasn't provided, calculate it from the findings
  if (complianceScore === undefined) {
    const findings = generateComplianceFindings(stats, documentName, selectedIndustry);
    const complianceResult = calculateComplianceScore(findings);
    complianceScore = complianceResult.score;
    complianceStatus = complianceResult.complianceStatus;
  }
  
  // Display Final Compliance Score with large font
  pdf.setFontSize(18);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Final Compliance Score:', 20, complianceYPos);
  complianceYPos += 15;
  
  // Draw a large score display
  pdf.setFontSize(48);
  // Set color based on score
  if (complianceScore >= 80) {
    pdf.setTextColor(0, 128, 0); // Green for good score
  } else if (complianceScore >= 60) {
    pdf.setTextColor(255, 165, 0); // Orange for moderate score
  } else {
    pdf.setTextColor(255, 0, 0); // Red for poor score
  }
  
  pdf.text(`${complianceScore}%`, 105, complianceYPos, { align: 'center' });
  complianceYPos += 25;
  
  // Display Overall Status
  pdf.setFontSize(18);
  pdf.text('Overall Status:', 20, complianceYPos);
  complianceYPos += 10;
  
  // Display Pass/Fail status with color
  pdf.setFontSize(24);
  if (complianceScore >= 80) {
    pdf.setTextColor(0, 128, 0); // Green for Pass
    pdf.text('PASS', 50, complianceYPos);
  } else {
    pdf.setTextColor(255, 0, 0); // Red for Fail
    pdf.text('FAIL', 50, complianceYPos);
  }
  complianceYPos += 15;
  
  // Display Compliance Status (Compliant/Non-Compliant)
  pdf.setFontSize(18);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Compliance Status:', 20, complianceYPos);
  complianceYPos += 10;
  
  pdf.setFontSize(24);
  if (complianceStatus === 'Compliant') {
    pdf.setTextColor(0, 128, 0); // Green for Compliant
    pdf.text('COMPLIANT', 60, complianceYPos);
  } else {
    pdf.setTextColor(255, 0, 0); // Red for Non-Compliant
    pdf.text('NON-COMPLIANT', 60, complianceYPos);
  }
  
  // Add description of score implications
  complianceYPos += 25;
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Score Implications:', 20, complianceYPos);
  complianceYPos += 10;
  
  pdf.setFontSize(10);
  const scoreImplications = complianceScore >= 80 
    ? 'This document meets the necessary compliance requirements. Recommended reviews and minor adjustments may still apply.'
    : 'This document requires attention to meet compliance requirements. Please refer to the insights and recommendations sections.';
  
  // Use text wrapping for better readability
  const wrappedImplications = pdf.splitTextToSize(scoreImplications, 170);
  pdf.text(wrappedImplications, 20, complianceYPos);
  complianceYPos += wrappedImplications.length * 6 + 10;
  
  // Add a note about the industry-specific evaluation if applicable
  if (selectedIndustry) {
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    const industryNote = `Note: This compliance evaluation is based on ${selectedIndustry} industry standards and regulations.`;
    const wrappedNote = pdf.splitTextToSize(industryNote, 170);
    pdf.text(wrappedNote, 20, complianceYPos);
  }
  
  // Add footer with integrity hash to all pages - must be last operation
  addFooter(pdf, integrityHash);
  
  // Return the PDF as a blob
  return pdf.output('blob');
};
