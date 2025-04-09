
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
 * Generate a comprehensive PDF report for the audit trail
 */
export const generatePDFReport = async (
  documentName: string, 
  auditEvents: AuditEvent[], 
  industry?: Industry,
  verificationMetadata?: any
): Promise<jsPDF> => {
  // Create new PDF document
  const doc = new jsPDF();
  
  try {
    console.log(`[pdfGenerator] Starting report generation for ${documentName}`);
    
    // Calculate statistics from the audit events
    const statistics = calculateReportStatistics(auditEvents);
    
    // Generate AI insights from the audit events
    const insights = await generateAIInsights(auditEvents, documentName, industry);
    console.log(`[pdfGenerator] Generated ${insights.length} AI insights`);
    
    // Generate compliance findings based on industry and events
    const findings = generateComplianceFindings(auditEvents, industry);
    console.log(`[pdfGenerator] Generated ${findings.length} compliance findings`);
    
    // Add Executive Summary
    addExecutiveSummary(doc, {
      documentName,
      industry,
      events: auditEvents,
      statistics,
      insights,
      findings
    });
    
    // Add AI Insights section
    addInsightsSection(doc, insights);
    
    // Add Summary section
    addSummarySection(doc, statistics, auditEvents);
    
    // Add Statistics section with charts
    addStatisticsSection(doc, statistics);
    
    // Create findings table
    if (findings.length > 0) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Compliance Findings", 20, 20);
      
      // Add the findings table
      createFindingsTable(doc, findings);
    }
    
    // Add footer with page numbers, including verification metadata if provided
    addFooter(doc, verificationMetadata);
    
    console.log(`[pdfGenerator] Finished generating PDF report with ${doc.getNumberOfPages()} pages`);
    
    return doc;
  } catch (error) {
    console.error(`[pdfGenerator] Error generating PDF report:`, error);
    throw error;
  }
};
