
import { AuditEvent } from '@/components/audit/types';
import { jsPDF } from 'jspdf';
import { calculateReportStatistics } from './reportStatistics';
import { generateAIInsights } from './aiInsightsGenerator';
import { 
  addEventsSection, 
  addInsightsSection, 
  addSummarySection, 
  addExecutiveSummary,
  addFooter
} from './pdf';

/**
 * Generate a downloadable audit trail report PDF with AI insights and detailed descriptions
 */
export const generatePDFReport = async (
  documentName: string,
  auditEvents: AuditEvent[]
): Promise<Blob> => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set font size and styles
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102);
  
  // Add title and document header
  doc.text('Compliance Audit Trail Report', 20, 20);
  
  // Add document name and date
  doc.setFontSize(12);
  doc.text(`Document: ${documentName}`, 20, 30);
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, 20, 37);
  
  // Add horizontal line
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(20, 42, 190, 42);
  
  // Add executive summary
  let yPos = addExecutiveSummary(doc, auditEvents, documentName);
  
  // Generate AI insights
  const insights = generateAIInsights(auditEvents);
  
  // Calculate statistics
  const stats = calculateReportStatistics(auditEvents);
  
  // Add insights section
  yPos = addInsightsSection(doc, insights, yPos);
  
  // Add summary section
  yPos = addSummarySection(doc, stats, yPos);
  
  // Add events section
  addEventsSection(doc, auditEvents, yPos);
  
  // Add footer with page numbers
  addFooter(doc);
  
  // Generate the PDF as a blob
  return doc.output('blob');
};
