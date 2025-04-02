
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
  
  yPos += 3;
  
  // Add compliance score
  doc.setFontSize(12);
  doc.setTextColor(0, 102, 51);
  const score = calculateComplianceScore(findings);
  const status = score >= 80 ? 'Pass' : 'Fail';
  
  doc.text(`Final Compliance Score: ${score}% (${score >= 80 ? 'Compliant' : 'Non-Compliant'})`, 25, yPos);
  yPos += 7;
  doc.text(`Overall Status: ${status}`, 25, yPos);
  yPos += 10;
  
  return yPos;
};
