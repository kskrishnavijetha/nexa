
import { jsPDF } from 'jspdf';
import { AuditEvent } from '@/components/audit/types';
import { Industry } from '@/utils/types';
import { calculateReportStatistics } from './reportStatistics';
import { generateAIInsights } from './insights';
import { 
  addExecutiveSummary,
  addSummarySection,
  addInsightsSection,
  addStatisticsSection,
} from './pdf';
import { generateComplianceFindings } from './pdf/findings/generateComplianceFindings';
import { createFindingsTable } from './pdf/tables/createFindingsTable';
import { addFooter } from './pdf/addFooter';

/**
 * Generate a comprehensive PDF report for the audit trail with optimized performance
 */
export const generatePDFReport = async (
  documentName: string, 
  auditEvents: AuditEvent[], 
  industry?: Industry,
  verificationMetadata?: any
): Promise<jsPDF> => {
  // Create new PDF document with optimized settings
  const doc = new jsPDF({
    compress: true, // Enable compression for smaller file size
    putOnlyUsedFonts: true, // Only embed used fonts
    precision: 2 // Lower precision for better performance
  });
  
  try {
    console.log(`[pdfGenerator] Starting optimized report generation for ${documentName}`);
    
    // Calculate statistics from the audit events
    const statistics = calculateReportStatistics(auditEvents);
    
    // Use a subset of events for AI insights generation if the list is very large
    const insightEvents = auditEvents.length > 100 
      ? auditEvents.slice(0, 100) // Use only the first 100 events for insights
      : auditEvents;
      
    // Generate AI insights from the audit events (with optimized event set)
    const insights = await generateAIInsights(insightEvents, documentName, industry);
    console.log(`[pdfGenerator] Generated ${insights.length} AI insights from ${insightEvents.length} events`);
    
    // Generate compliance findings based on industry and events
    const findings = generateComplianceFindings(statistics, documentName, undefined, industry);
    console.log(`[pdfGenerator] Generated ${findings.length} compliance findings`);
    
    // Add Executive Summary
    const execSummaryEndY = addExecutiveSummary(doc, auditEvents, documentName, industry);
    
    // Add AI Insights section - limit to the most important insights
    const limitedInsights = insights.length > 5 ? insights.slice(0, 5) : insights;
    const insightsSectionEndY = addInsightsSection(doc, limitedInsights, execSummaryEndY);
    
    // Add Summary section with statistics
    const summarySectionEndY = addSummarySection(doc, statistics, insightsSectionEndY, documentName, industry);
    
    // Add Statistics section with charts - using lightweight rendering
    addStatisticsSection(doc, statistics, findings, summarySectionEndY);
    
    // Create findings table - limit to most important findings
    const limitedFindings = findings.length > 8 ? findings.slice(0, 8) : findings;
    if (limitedFindings.length > 0) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Compliance Findings", 20, 20);
      
      // Add the findings table with optimized rendering
      createFindingsTable(doc, limitedFindings, 30);
    }
    
    // Add footer with page numbers, including verification metadata if provided
    addFooter(doc, verificationMetadata);
    
    console.log(`[pdfGenerator] Finished generating optimized PDF report with ${doc.getNumberOfPages()} pages`);
    
    return doc;
  } catch (error) {
    console.error(`[pdfGenerator] Error generating PDF report:`, error);
    throw error;
  }
};
