
import { jsPDF } from 'jspdf';
import { AuditReportStatistics } from '../../types';

/**
 * Adds a statistics section to the PDF document
 */
export const addStatisticsSection = (
  doc: jsPDF, 
  statistics: AuditReportStatistics, 
  yPos: number
): number => {
  // Check if we need to add a new page if the stats section is too close to the bottom
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }
  
  // Set section title
  doc.setFontSize(16);
  doc.setTextColor(0, 51, 102);
  doc.text('Audit Statistics', 20, yPos);
  
  // Move position down for content
  yPos += 10;
  
  // Set content font
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  
  // Add statistics
  doc.text(`Total Events: ${statistics.totalEvents}`, 20, yPos);
  yPos += 7;
  
  doc.text(`User Events: ${statistics.userEvents}`, 20, yPos);
  yPos += 7;
  
  doc.text(`System Events: ${statistics.systemEvents}`, 20, yPos);
  yPos += 7;
  
  doc.text(`Completed: ${statistics.completed}`, 20, yPos);
  yPos += 7;
  
  doc.text(`In Progress: ${statistics.inProgress}`, 20, yPos);
  yPos += 7;
  
  doc.text(`Pending: ${statistics.pending}`, 20, yPos);
  yPos += 15;
  
  return yPos;
};
