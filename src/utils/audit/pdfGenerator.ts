
import { AuditEvent } from '@/components/audit/types';
import { jsPDF } from 'jspdf';
import { calculateReportStatistics } from './reportStatistics';
import { AIInsight } from './types';
import { generateAIInsights } from './insights';
import { addExecutiveSummary } from './pdf/addExecutiveSummary';
import { addInsightsSection } from './pdf/addInsightsSection';
import { addSummarySection } from './pdf/addSummarySection';
import { addFooter } from './pdf/addFooter';
import { Industry } from '@/utils/types';
import { generateVerificationMetadata } from './hashVerification';

/**
 * Generate a PDF report with AI-enhanced insights from audit events
 * Optimized to be non-blocking and prevent UI freezing
 */
export const generatePDFReport = async (
  documentName: string,
  auditEvents: AuditEvent[],
  selectedIndustry?: Industry
): Promise<Blob> => {
  console.log(`[pdfGenerator] Generating PDF report for ${documentName}`);
  console.log(`[pdfGenerator] Selected industry parameter: ${selectedIndustry || 'not specified'}`);
  
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        // Generate integrity verification information
        const verificationMetadata = await generateVerificationMetadata(auditEvents);
        console.log(`[pdfGenerator] Generated verification hash: ${verificationMetadata.shortHash}`);
        
        // Create PDF with optimized settings
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true,
          putOnlyUsedFonts: true
        });
        
        // Set document properties and metadata
        pdf.setProperties({
          title: `Audit Report - ${documentName}`,
          subject: 'AI-Enhanced Compliance Report',
          creator: 'Compliance Report Generator',
          keywords: `compliance,audit,${verificationMetadata.hash.substring(0, 15)}`
        });
        
        // Add executive summary with document info
        let yPos = addExecutiveSummary(pdf, auditEvents, documentName, selectedIndustry);
        
        // Calculate report statistics
        const stats = calculateReportStatistics(auditEvents);
        
        // Limit the number of events used for AI insights to prevent performance issues
        // Reduce max events from 500 to 250 for better reliability
        const maxEvents = 250;
        const limitedEvents = auditEvents.length > maxEvents 
          ? auditEvents.slice(0, maxEvents) 
          : auditEvents;
          
        // AI-Generated Insights based on industry and document
        const insights: AIInsight[] = generateAIInsights(limitedEvents, documentName, selectedIndustry);
        
        // Add risk and recommendation insights section with padding
        yPos = addInsightsSection(pdf, insights, yPos + 10);
        
        // Add summary statistics and findings section with padding
        yPos = addSummarySection(pdf, stats, yPos + 10, documentName, selectedIndustry);
        
        // Add footer with page numbers to all pages - must be last operation
        addFooter(pdf, verificationMetadata);
        
        // Return the PDF as a blob
        resolve(pdf.output('blob'));
      } catch (error) {
        console.error('[pdfGenerator] Error generating PDF:', error);
        reject(error);
      }
    }, 10);
  });
};
