
import { jsPDF } from 'jspdf';
import { AuditReportStatistics } from '../types';
import { addStatisticsSection } from './sections/addStatisticsSection';

/**
 * Add summary section to the PDF with statistics and findings
 */
export const addSummarySection = (
  pdf: jsPDF, 
  stats: AuditReportStatistics, 
  startY: number,
  documentName?: string,
  industry?: string,
  verificationCode?: string
): number => {
  // Use the enhanced addStatisticsSection that includes verification code
  return addStatisticsSection(pdf, stats, startY, documentName, industry, verificationCode);
};
