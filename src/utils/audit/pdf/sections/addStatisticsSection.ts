
import { jsPDF } from "jspdf";
import { AuditReportStatistics } from '../../types';
import { calculateComplianceScore } from '../findings/calculateComplianceScore';
import { ComplianceFinding } from '../../types';

/**
 * Add the statistics details section to the PDF document
 */
export const addStatisticsSection = (
  doc: jsPDF, 
  stats: AuditReportStatistics, 
  findings: ComplianceFinding[],
  startY: number
): number => {
  let yPos = startY;
  
  // Add summary details
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Use text arrays for each line to ensure proper rendering
  const textLines = [
    `Total Events: ${stats.totalEvents}`,
    `System Events: ${stats.systemEvents}`,
    `User Events: ${stats.userEvents}`,
    `Completed Tasks: ${stats.completed}`,
    `In-Progress Tasks: ${stats.inProgress}`,
    `Pending Tasks: ${stats.pending}`
  ];
  
  // Add each line with consistent spacing
  textLines.forEach(line => {
    doc.text(line, 25, yPos);
    yPos += 7;
  });
  
  yPos += 10;
  
  // Add compliance score with clear formatting
  const { score, status } = calculateComplianceScore(findings);
  
  // Add a section separator
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(25, yPos - 5, 185, yPos - 5);
  
  // Format compliance score with bold font
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(`Final Compliance Score: ${score}% (${score >= 80 ? 'Compliant' : 'Non-Compliant'})`, 25, yPos);
  yPos += 8;
  
  // Format overall status with appropriate color
  doc.setTextColor(status === 'Pass' ? 0 : 204, status === 'Pass' ? 102 : 0, 0);
  doc.text(`Overall Status: ${status}`, 25, yPos);
  
  // Reset font to normal for subsequent text
  doc.setFont('helvetica', 'normal');
  
  yPos += 15;
  
  return yPos;
};
