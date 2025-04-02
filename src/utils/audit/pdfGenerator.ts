
import { AuditEvent } from '@/components/audit/types';
import { jsPDF } from 'jspdf';
import { calculateReportStatistics } from './reportStatistics';
import { AIInsight } from './types';
import { generateAIInsights } from './insights';
import { addExecutiveSummary } from './pdf/addExecutiveSummary';
import { addInsightsSection } from './pdf/addInsightsSection';
import { addSummarySection } from './pdf/addSummarySection';
import { addEventsSection } from './pdf/addEventsSection';

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
  
  // Add a new page for detailed events
  pdf.addPage();
  
  // Add the detailed audit events section
  addEventsSection(pdf, auditEvents, 20);
  
  return pdf.output('blob');
};
