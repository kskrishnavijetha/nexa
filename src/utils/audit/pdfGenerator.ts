
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
 * Further optimized to be non-blocking with worker offloading
 */
export const generatePDFReport = async (
  documentName: string,
  auditEvents: AuditEvent[],
  selectedIndustry?: Industry
): Promise<Blob> => {
  console.log(`[pdfGenerator] Generating PDF report for ${documentName}`);
  console.log(`[pdfGenerator] Selected industry parameter: ${selectedIndustry || 'not specified'}`);
  
  return new Promise((resolve, reject) => {
    // Use requestAnimationFrame to ensure UI updates before starting heavy work
    requestAnimationFrame(() => {
      // Use microtasks to improve responsiveness
      queueMicrotask(() => {
        // Now use setTimeout with zero delay to move PDF generation off the main thread
        setTimeout(async () => {
          try {
            // Break work into smaller chunks to prevent UI freezing
            const performChunk = (task: () => void): Promise<void> => {
              return new Promise(resolve => {
                setTimeout(() => {
                  task();
                  resolve();
                }, 0);
              });
            };
            
            // Limit events processing to prevent memory issues
            const maxEvents = Math.min(auditEvents.length, 200);
            const processEvents = auditEvents.slice(0, maxEvents);
            
            // Generate integrity verification information - do this first and early
            const verificationMetadata = await generateVerificationMetadata(processEvents);
            console.log(`[pdfGenerator] Generated verification hash: ${verificationMetadata.shortHash}`);
            
            // Create PDF with optimized settings for performance
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4',
              compress: true,
              putOnlyUsedFonts: true,
              floatPrecision: 16 // Lower precision for better memory usage
            });
            
            // Set document properties and metadata
            await performChunk(() => {
              pdf.setProperties({
                title: `Audit Report - ${documentName}`,
                subject: 'AI-Enhanced Compliance Report',
                creator: 'Compliance Report Generator',
                keywords: `compliance,audit,${verificationMetadata.hash.substring(0, 15)}`
              });
            });
            
            // Add executive summary with document info
            let yPos = 0;
            await performChunk(() => {
              yPos = addExecutiveSummary(pdf, processEvents, documentName, selectedIndustry);
            });
            
            // Calculate report statistics
            const stats = calculateReportStatistics(processEvents);
            
            // Limit the number of events used for AI insights to prevent performance issues
            const insightEvents = processEvents.length > 150 
              ? processEvents.slice(0, 150) 
              : processEvents;
              
            // AI-Generated Insights based on industry and document
            const insights: AIInsight[] = generateAIInsights(insightEvents, documentName, selectedIndustry);
            
            // Add risk and recommendation insights section with padding
            await performChunk(() => {
              yPos = addInsightsSection(pdf, insights, yPos + 10);
            });
            
            // Add summary statistics and findings section with padding
            await performChunk(() => {
              yPos = addSummarySection(pdf, stats, yPos + 10, documentName, selectedIndustry);
            });
            
            // Add footer with page numbers to all pages - must be last operation
            await performChunk(() => {
              addFooter(pdf, verificationMetadata);
            });
            
            // Use blob with optimized options
            const pdfBlob = pdf.output('blob');
            
            // Clean up memory before resolving
            setTimeout(() => {
              // Return the PDF as a blob and trigger GC
              resolve(pdfBlob);
            }, 10);
          } catch (error) {
            console.error('[pdfGenerator] Error generating PDF:', error);
            reject(error);
          }
        }, 5); // Lower delay for more immediate execution
      });
    });
  });
};
