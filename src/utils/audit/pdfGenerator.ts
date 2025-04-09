
import { AuditEvent } from '@/components/audit/types';
import { jsPDF } from 'jspdf';
import { calculateReportStatistics } from './reportStatistics';
import { AIInsight } from './types';
import { generateAIInsights } from './insights';
import { addExecutiveSummary } from './pdf/addExecutiveSummary';
import { addInsightsSection } from './pdf/addInsightsSection';
import { addSummarySection } from './pdf/addSummarySection';
import { addFooter } from './pdf/addFooter';
import { Industry } from '@/utils/types';
import { generateVerificationCode } from './hashVerification';

/**
 * Generate a PDF report with AI-enhanced insights from audit events
 */
export const generatePDFReport = async (
  documentName: string,
  auditEvents: AuditEvent[],
  selectedIndustry?: Industry
): Promise<Blob> => {
  console.log(`[pdfGenerator] Generating PDF report for ${documentName}`);
  console.log(`[pdfGenerator] Selected industry parameter: ${selectedIndustry || 'not specified'}`);
  
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
    creator: 'Compliance Report Generator'
  });
  
  // Generate verification code for tamper-proofing - ENSURE THIS HAPPENS
  const verificationCode = generateVerificationCode(documentName, auditEvents);
  console.log(`[pdfGenerator] Generated verification code: ${verificationCode}`);
  
  // Add executive summary with document info - pass the industry explicitly and the verification code
  let yPos = addExecutiveSummary(pdf, auditEvents, documentName, selectedIndustry, verificationCode);
  
  // Report Statistics
  const stats = calculateReportStatistics(auditEvents);
  
  // AI-Generated Insights based on industry and document
  // Use the document name and industry to help determine the insights
  const insights: AIInsight[] = generateAIInsights(auditEvents, documentName, selectedIndustry);
  
  // Add risk and recommendation insights section with padding
  yPos = addInsightsSection(pdf, insights, yPos + 10);
  
  // Add summary statistics and findings section with padding
  // Pass document name, selected industry, and verification code to allow industry-specific findings
  yPos = addSummarySection(pdf, stats, yPos + 10, documentName, selectedIndustry, verificationCode);
  
  // Add footer with page numbers to all pages - must be last operation
  // Pass the verification code to the footer for each page
  addFooter(pdf, verificationCode);
  
  // Return the PDF as a blob
  return pdf.output('blob');
};
