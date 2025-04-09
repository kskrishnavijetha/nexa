
import { jsPDF } from 'jspdf';
import { AuditReportStatistics } from '../../types';
import { createFindingsTable } from '../tables/createFindingsTable';
import { generateComplianceFindings } from '../findings/generateComplianceFindings';
import { Industry } from '@/utils/types';

/**
 * Add statistics section to PDF
 */
export const addStatisticsSection = (
  pdf: jsPDF, 
  stats: AuditReportStatistics, 
  startY: number,
  documentName?: string,
  industry?: Industry,
  verificationCode?: string
): number => {
  // Start position
  let yPos = startY;
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Set font for title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Compliance Statistics & Findings', margin, yPos);
  yPos += 10;
  
  // Add statistics
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(60, 60, 60);
  
  // Create a background for stats
  pdf.setFillColor(248, 250, 252); // Very light gray
  pdf.roundedRect(margin, yPos, pageWidth - (margin * 2), 25, 3, 3, 'F');
  yPos += 6;
  
  // Statistics in columns
  const col1 = margin + 5;
  const col2 = margin + 70;
  const col3 = margin + 140;
  
  // Row 1
  pdf.text(`Total Events: ${stats.totalEvents}`, col1, yPos);
  pdf.text(`User Events: ${stats.userEvents}`, col2, yPos);
  pdf.text(`System Events: ${stats.systemEvents}`, col3, yPos);
  yPos += 8;
  
  // Row 2
  pdf.text(`Completed: ${stats.completed}`, col1, yPos);
  pdf.text(`In Progress: ${stats.inProgress}`, col2, yPos);
  pdf.text(`Pending: ${stats.pending}`, col3, yPos);
  yPos += 12;
  
  // Document verification status
  if (verificationCode) {
    yPos += 5;
    pdf.setFillColor(240, 255, 240); // Very light green for verification
    pdf.roundedRect(margin, yPos, pageWidth - (margin * 2), 15, 3, 3, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 100, 0); // Dark green
    pdf.text('DOCUMENT VERIFICATION:', margin + 5, yPos + 10);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(25, 25, 25);
    pdf.text(`This document includes tamper-proof verification (ID: ${verificationCode.substring(0, 12)}...)`, margin + 60, yPos + 10);
    yPos += 20;
  }
  
  // Generate industry-specific compliance findings
  const findings = generateComplianceFindings(stats, documentName, undefined, industry);
  
  // Add findings table
  if (findings.length > 0) {
    yPos += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(44, 62, 80);
    pdf.text('Compliance Findings', margin, yPos);
    yPos += 8;
    
    yPos = createFindingsTable(pdf, findings, yPos);
  }
  
  return yPos;
};
