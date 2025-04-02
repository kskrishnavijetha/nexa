
import { AuditEvent } from '@/components/audit/types';
import { jsPDF } from 'jspdf';
import { calculateReportStatistics } from './reportStatistics';
import { AIInsight } from './types';
import { generateAIInsights } from './insights';
import { addExecutiveSummary } from './pdf/addExecutiveSummary';
import { addInsightsSection } from './pdf/addInsightsSection';
import { addSummarySection } from './pdf/addSummarySection';
import { addFooter } from './pdf/addFooter';

/**
 * Generate a PDF report with AI-enhanced insights from audit events
 */
export const generatePDFReport = async (
  documentName: string,
  auditEvents: AuditEvent[]
): Promise<Blob> => {
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
  
  // Add executive summary with document info
  let yPos = addExecutiveSummary(pdf, auditEvents, documentName);
  
  // Report Statistics
  const stats = calculateReportStatistics(auditEvents);
  
  // AI-Generated Insights
  const insights: AIInsight[] = generateAIInsights(auditEvents);
  
  // Add risk and recommendation insights section with padding
  yPos = addInsightsSection(pdf, insights, yPos + 10);
  
  // Add summary statistics and findings section with padding
  yPos = addSummarySection(pdf, stats, yPos + 10);
  
  // We've removed the audit events section as requested
  
  // Add footer with page numbers to all pages - must be last operation
  addFooter(pdf);
  
  // Return the PDF as a blob
  return pdf.output('blob');
};
