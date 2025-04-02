
import { AuditEvent } from '@/components/audit/types';
import { jsPDF } from 'jspdf';
import { calculateReportStatistics } from './reportStatistics';
import { AIInsight } from './types';
import { generateAIInsights } from './insights';
import { addExecutiveSummary } from './pdf/addExecutiveSummary';
import { addInsightsSection } from './pdf/addInsightsSection';
import { addSummarySection } from './pdf/addSummarySection';

/**
 * Generate a PDF report with AI-enhanced insights from audit events
 */
export const generatePDFReport = async (
  documentName: string,
  auditEvents: AuditEvent[]
): Promise<Blob> => {
  const pdf = new jsPDF();
  
  // Add executive summary with document info
  let yPos = addExecutiveSummary(pdf, auditEvents, documentName);
  
  // Report Statistics
  const stats = calculateReportStatistics(auditEvents);
  
  // AI-Generated Insights
  const insights: AIInsight[] = generateAIInsights(auditEvents);
  
  // Add risk and recommendation insights section
  yPos = addInsightsSection(pdf, insights, yPos + 10);
  
  // Add summary statistics and findings section
  yPos = addSummarySection(pdf, stats, yPos + 10);
  
  // Note: We're removing the detailed audit events section as requested
  
  return pdf.output('blob');
};
