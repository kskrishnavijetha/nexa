
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
    try {
      // Begin PDF generation inside requestAnimationFrame for better performance
      requestAnimationFrame(async () => {
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
          // Reduce max events even more for better reliability
          const maxEvents = 100; // Reduced from 250 to 100
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
        } catch (innerError) {
          console.error('[pdfGenerator] Error generating PDF (inner):', innerError);
          
          // Create a simple PDF with error message if the main generation fails
          try {
            const errorPdf = new jsPDF();
            errorPdf.setFontSize(16);
            errorPdf.setTextColor(0, 0, 0);
            errorPdf.text('Error Generating Full Report', 20, 20);
            
            errorPdf.setFontSize(12);
            errorPdf.text(`Document: ${documentName}`, 20, 40);
            errorPdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 50);
            
            errorPdf.setFontSize(11);
            errorPdf.text('An error occurred while generating the report.', 20, 70);
            errorPdf.text('Please try again with fewer events or contact support.', 20, 80);
            
            // Add simple footer
            const pageCount = errorPdf.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
              errorPdf.setPage(i);
              errorPdf.setFontSize(8);
              errorPdf.setTextColor(100, 100, 100);
              errorPdf.text(`Page ${i} of ${pageCount} | Nexabloom | www.nexabloom.xyz`, 105, 285, { align: 'center' });
            }
            
            resolve(errorPdf.output('blob'));
          } catch (fallbackError) {
            console.error('[pdfGenerator] Fallback PDF generation failed:', fallbackError);
            reject(fallbackError);
          }
        }
      });
    } catch (error) {
      console.error('[pdfGenerator] Error generating PDF:', error);
      reject(error);
    }
  });
};
