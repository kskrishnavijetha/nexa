import { AuditEvent } from '@/components/audit/types';
import { jsPDF } from 'jspdf';
import { calculateReportStatistics } from './reportStatistics';
import { AIInsight } from './types';
import { generateAIInsights } from './insights';

/**
 * Generate a PDF report with AI-enhanced insights from audit events
 */
export const generatePDFReport = async (
  documentName: string,
  auditEvents: AuditEvent[]
): Promise<Blob> => {
  const pdf = new jsPDF();
  
  // Document Title
  pdf.setFontSize(20);
  pdf.text(`AI-Enhanced Audit Report: ${documentName}`, 10, 10);
  
  // Report Statistics
  const stats = calculateReportStatistics(auditEvents);
  pdf.setFontSize(12);
  pdf.text(`Report Statistics:`, 10, 20);
  pdf.text(`Total Events: ${stats.totalEvents}`, 10, 25);
  pdf.text(`System Events: ${stats.systemEvents}`, 10, 30);
  pdf.text(`User Events: ${stats.userEvents}`, 10, 35);
  pdf.text(`Completed: ${stats.completed}`, 10, 40);
  pdf.text(`In Progress: ${stats.inProgress}`, 10, 45);
  pdf.text(`Pending: ${stats.pending}`, 10, 50);
  
  // AI-Generated Insights
  const insights: AIInsight[] = generateAIInsights(auditEvents);
  pdf.setFontSize(14);
  pdf.text(`AI-Generated Insights:`, 10, 60);
  
  let y = 65;
  insights.forEach((insight) => {
    pdf.setFontSize(10);
    const wrappedText = pdf.splitTextToSize(insight.text, 180);
    wrappedText.forEach((line: string) => {
      pdf.text(line, 10, y);
      y += 5;
    });
    y += 5;
  });
  
  // Audit Events
  pdf.addPage();
  pdf.setFontSize(16);
  pdf.text(`Audit Events:`, 10, 10);
  
  let eventY = 20;
  auditEvents.forEach((event) => {
    pdf.setFontSize(12);
    pdf.text(`Action: ${event.action}`, 10, eventY);
    pdf.setFontSize(10);
    pdf.text(`User: ${event.user}`, 10, eventY + 5);
    pdf.text(`Timestamp: ${event.timestamp}`, 10, eventY + 10);
    pdf.text(`Status: ${event.status || 'N/A'}`, 10, eventY + 15);
    
    if (event.comments && event.comments.length > 0) {
      pdf.setFontSize(10);
      pdf.text(`Comments:`, 10, eventY + 20);
      let commentY = eventY + 25;
      event.comments.forEach((comment) => {
        const wrappedComment = pdf.splitTextToSize(`${comment.user}: ${comment.text} (${comment.timestamp})`, 170);
        wrappedComment.forEach((line: string) => {
          pdf.text(line, 15, commentY);
          commentY += 5;
        });
      });
      eventY = commentY + 5;
    } else {
      eventY += 30;
    }
    
    if (eventY > 280) {
      pdf.addPage();
      eventY = 20;
    }
  });
  
  return pdf.output('blob');
};
