
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
  
  // Check if we need a new page for the final results
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
    
    // Add page header for final results page
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Compliance Results & Final Score', 20, yPos);
    yPos += 15;
  } else {
    // Add a section header
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Compliance Results & Final Score', 20, yPos);
    yPos += 15;
  }
  
  // Add summary details with clear formatting and spacing
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
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
  
  // Add compliance score with clear formatting and visual separation
  const { score, status } = calculateComplianceScore(findings);
  
  // Add a section separator
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(25, yPos - 5, 185, yPos - 5);
  
  // Add a decorative box for the final score
  const scoreBoxY = yPos;
  const scoreBoxHeight = 30;
  doc.setFillColor(245, 245, 250);
  doc.setDrawColor(200, 200, 210);
  doc.roundedRect(25, scoreBoxY, 160, scoreBoxHeight, 5, 5, 'FD');
  
  // Format compliance score with larger, bold font
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(`Final Compliance Score: ${score}%`, 35, yPos);
  yPos += 12;
  
  // Format overall status with appropriate color and slightly larger font
  doc.setFontSize(14);
  doc.setTextColor(status === 'Pass' ? 0 : 204, status === 'Pass' ? 102 : 0, 0);
  doc.text(`Overall Status: ${status === 'Pass' ? 'PASS' : 'FAIL'}`, 35, yPos);
  
  // Reset font to normal for subsequent text
  doc.setFont('helvetica', 'normal');
  
  yPos += scoreBoxHeight + 5;
  
  // Add final note about AI-enhancement
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Note: This report was automatically generated with AI compliance analysis.', 25, yPos);
  
  yPos += 20;
  
  return yPos;
};
