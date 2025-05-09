
import { jsPDF } from "jspdf";
import { AuditReportStatistics } from '../types';
import { generateComplianceFindings } from './findings/generateComplianceFindings';
import { createFindingsTable } from './tables/createFindingsTable';
import { addStatisticsSection } from './sections/addStatisticsSection';
import { Industry } from '@/utils/types';

/**
 * Add summary statistics section to the PDF document with improved pagination
 */
export const addSummarySection = (
  doc: jsPDF, 
  stats: AuditReportStatistics, 
  startY: number,
  documentName?: string,
  industry?: Industry
): number => {
  let yPos = startY;
  
  // Check if we need a new page
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }
  
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
  
  console.log(`[addSummarySection] Generating findings with industry: ${industry || 'not specified'}`);
  
  // Create compliance findings - pass both document name and industry
  const findings = generateComplianceFindings(stats, documentName, undefined, industry);
  
  // Ensure findings table starts on a new page if not enough space
  if (yPos > 180) {
    doc.addPage();
    yPos = 20;
  }
  
  // Create findings table
  yPos = createFindingsTable(doc, findings, yPos);
  
  // Check if we need a new page for statistics
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }
  
  // Add statistics section
  yPos = addStatisticsSection(doc, stats, findings, yPos);
  
  return yPos;
}
