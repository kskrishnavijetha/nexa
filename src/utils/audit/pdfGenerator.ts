
import { AuditEvent } from '@/components/audit/types';
import jsPDF from 'jspdf';
import { calculateReportStatistics } from './reportStatistics';
import { generateAIInsights } from './aiInsightsGenerator';
import { AIInsight } from './types';

/**
 * Add AI insights section to the PDF document
 */
const addInsightsSection = (doc: jsPDF, insights: AIInsight[], startY: number): number => {
  let yPos = startY;
  
  // Add AI Insights section heading
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('AI-Generated Insights', 20, yPos);
  yPos += 10;
  
  // Add insights
  doc.setFontSize(10);
  insights.forEach((insight) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    // Set color based on insight type
    if (insight.type === 'recommendation') {
      doc.setTextColor(0, 102, 0); // Green for recommendations
    } else if (insight.type === 'warning') {
      doc.setTextColor(153, 76, 0); // Orange for warnings
    } else {
      doc.setTextColor(0, 0, 0); // Black for regular observations
    }
    
    // Format and display insight with bullet point
    const insightLines = doc.splitTextToSize(`• ${insight.text}`, 160);
    doc.text(insightLines, 25, yPos);
    yPos += (insightLines.length * 5) + 5;
  });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  return yPos;
};

/**
 * Add summary statistics section to the PDF document
 */
const addSummarySection = (doc: jsPDF, stats: ReturnType<typeof calculateReportStatistics>, startY: number): number => {
  let yPos = startY;
  
  // Add horizontal line after insights
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  // Add report summary information
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Audit Summary', 20, yPos);
  yPos += 10;
  
  // Add summary details
  doc.setFontSize(10);
  doc.text(`Total Events: ${stats.totalEvents}`, 25, yPos);
  yPos += 7;
  doc.text(`System Events: ${stats.systemEvents}`, 25, yPos);
  yPos += 7;
  doc.text(`User Events: ${stats.userEvents}`, 25, yPos);
  yPos += 7;
  doc.text(`Completed Tasks: ${stats.completed}`, 25, yPos);
  yPos += 7;
  doc.text(`In-Progress Tasks: ${stats.inProgress}`, 25, yPos);
  yPos += 7;
  doc.text(`Pending Tasks: ${stats.pending}`, 25, yPos);
  yPos += 10;
  
  return yPos;
};

/**
 * Add audit events details section to the PDF document
 */
const addEventsSection = (doc: jsPDF, auditEvents: AuditEvent[], startY: number): number => {
  let yPos = startY;
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  // Event details heading
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Detailed Audit Events', 20, yPos);
  yPos += 10;
  
  // Sort events by timestamp in descending order (newest first)
  const sortedEvents = [...auditEvents].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Add each audit event
  sortedEvents.forEach((event, index) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    // Format timestamp
    const timestamp = new Date(event.timestamp).toLocaleString();
    
    // Set color based on event type 
    if (event.user === 'System') {
      doc.setTextColor(0, 102, 204); // Blue for system events
    } else {
      doc.setTextColor(0, 153, 51); // Green for user events
    }
    
    // Event number and type
    doc.setFontSize(12);
    doc.text(`Event #${index + 1}`, 20, yPos);
    yPos += 7;
    
    // Reset color for details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    // Event details
    doc.text(`Timestamp: ${timestamp}`, 25, yPos);
    yPos += 7;
    
    doc.text(`User: ${event.user}`, 25, yPos);
    yPos += 7;
    
    // Action with word wrapping
    const actionLines = doc.splitTextToSize(`Action: ${event.action}`, 160);
    doc.text(actionLines, 25, yPos);
    yPos += (actionLines.length * 5) + 2;
    
    // Status
    if (event.status) {
      doc.text(`Status: ${event.status}`, 25, yPos);
      yPos += 7;
    }
    
    // Add separator unless it's the last event
    if (index < sortedEvents.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(20, yPos, 190, yPos);
      yPos += 10;
    }
  });
  
  return yPos;
};

/**
 * Generate a downloadable audit trail report PDF with AI insights
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
  
  // Generate AI insights
  const insights = generateAIInsights(auditEvents);
  
  // Calculate statistics
  const stats = calculateReportStatistics(auditEvents);
  
  // Add insights section
  let yPos = 52;
  yPos = addInsightsSection(doc, insights, yPos);
  
  // Add summary section
  yPos = addSummarySection(doc, stats, yPos);
  
  // Add events section
  addEventsSection(doc, auditEvents, yPos);
  
  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, 100, 290, { align: 'center' });
    doc.text(`AI-Enhanced Compliance Report`, 100, 284, { align: 'center' });
  }
  
  // Generate the PDF as a blob
  return doc.output('blob');
};
