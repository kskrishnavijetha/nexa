
import { jsPDF } from "jspdf";
import { AuditReportStatistics } from '../types';
import { generateComplianceFindings } from './findings/generateComplianceFindings';
import { createFindingsTable } from './tables/createFindingsTable';
import { addStatisticsSection } from './sections/addStatisticsSection';

/**
 * Add summary statistics section to the PDF document
 */
export const addSummarySection = (
  doc: jsPDF, 
  stats: AuditReportStatistics, 
  startY: number,
  documentName?: string
): number => {
  let yPos = startY;
  
  // Add horizontal line after insights
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  // Add summary of findings header
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text('Summary of Findings', 20, yPos);
  yPos += 10;
  
  // Create compliance findings - pass document name for industry detection
  const findings = generateComplianceFindings(stats, documentName);
  
  // Create findings table
  yPos = createFindingsTable(doc, findings, yPos);
  
  // Add statistics section
  yPos = addStatisticsSection(doc, stats, findings, yPos);
  
  return yPos;
};
