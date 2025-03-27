
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
  
  // Document Title
  pdf.setFontSize(22);
  pdf.setTextColor(0, 51, 102);
  pdf.text(`AI-Enhanced Audit Report`, 20, 20);
  
  pdf.setFontSize(16);
  pdf.text(`Document: ${documentName}`, 20, 30);
  
  // Add timestamp
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 38);
  
  // Add executive summary
  let yPos = addExecutiveSummary(pdf, auditEvents, documentName);
  
  // Report Statistics
  const stats = calculateReportStatistics(auditEvents);
  
  // AI-Generated Insights
  const insights: AIInsight[] = generateAIInsights(auditEvents);
  yPos = addInsightsSection(pdf, insights, yPos + 10);
  
  // Summary statistics section
  yPos = addSummarySection(pdf, stats, yPos + 10);
  
  // Add a new page for detailed events
  pdf.addPage();
  
  // Add the detailed audit events section
  addEventsSection(pdf, auditEvents, 20);
  
  return pdf.output('blob');
};
