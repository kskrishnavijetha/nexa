
import { jsPDF } from "jspdf";
import { AuditReportStatistics } from '../types';

/**
 * Add summary statistics section to the PDF document
 */
export const addSummarySection = (doc: jsPDF, stats: AuditReportStatistics, startY: number): number => {
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
