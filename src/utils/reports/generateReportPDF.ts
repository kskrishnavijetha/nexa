
import { ApiResponse, ComplianceReport } from '../types';
import { SupportedLanguage, translate } from '../language';
import jsPDF from 'jspdf';
import { renderComplianceScores } from './sections/complianceScores';
import { renderComplianceIssues } from './sections/complianceIssues';
import { renderImprovementSuggestions } from './sections/improvementSuggestions';
import { addFooter } from './sections/footer';
import { addComplianceCharts } from './sections/complianceCharts';

/**
 * Generate a downloadable compliance report PDF
 * This implementation uses non-blocking async approach to prevent UI freezing
 */
export const generateReportPDF = async (
  report: ComplianceReport,
  language: SupportedLanguage = 'en',
  chartImageBase64?: string
): Promise<ApiResponse<Blob>> => {
  return new Promise((resolve) => {
    // Show immediate progress feedback in the console
    console.log('Starting PDF generation process...');
    
    // Use requestAnimationFrame to ensure UI updates before starting heavy work
    requestAnimationFrame(() => {
      // Now use setTimeout to move PDF generation off the main thread
      setTimeout(async () => {
        try {
          console.log('Creating PDF document...');
          
          // Create a new PDF document with optimized settings
          const doc = new jsPDF({
            orientation: 'portrait', 
            unit: 'mm',
            format: 'a4',
            compress: true,
            putOnlyUsedFonts: true  // This helps with memory usage
          });
          
          // Function to perform a chunk of work and then yield back to the main thread
          const performChunk = (task: () => void): Promise<void> => {
            return new Promise(resolve => {
              setTimeout(() => {
                task();
                resolve();
              }, 0);
            });
          };
          
          // Set font size and styles
          await performChunk(() => {
            doc.setFontSize(22);
            doc.setTextColor(0, 51, 102);
            
            // Add title
            doc.text(translate('compliance_report', language), 20, 20);
            
            // Add horizontal line
            doc.setDrawColor(0, 51, 102);
            doc.setLineWidth(0.5);
            doc.line(20, 25, 190, 25);
          });
          
          // Document Details Section
          await performChunk(() => {
            doc.setFontSize(16);
            doc.setTextColor(0, 51, 102);
            doc.text('Document Information', 20, 40);
            
            // Set normal font for content
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            
            // Add document information
            let yPos = 50;
            doc.text(`${translate('document', language)}: ${report.documentName}`, 20, yPos);
            yPos += 7;
            doc.text(`${translate('generated', language)}: ${new Date().toLocaleString()}`, 20, yPos);
            yPos += 7;
            
            // Add industry and region information with more prominence
            if (report.industry) {
              doc.setFontSize(11);
              doc.setTextColor(0, 70, 140);
              doc.text(`${translate('industry', language)}: ${report.industry}`, 20, yPos);
              yPos += 7;
              
              if (report.region) {
                doc.text(`${translate('region', language)}: ${report.region}`, 20, yPos);
                yPos += 7;
              }
              
              // List applicable regulations if available
              if (report.regulations && report.regulations.length > 0) {
                doc.text(`${translate('applicable_regulations', language)}: ${report.regulations.join(', ')}`, 20, yPos);
                yPos += 7;
              }
            }
          });
          
          // Summary Section - another chunk
          await performChunk(() => {
            let yPos = 90; // Continue from last position
            doc.setFontSize(16);
            doc.setTextColor(0, 51, 102);
            doc.text(translate('summary', language), 20, yPos);
            
            // Set normal font for content
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            
            // Add wrapped summary text
            yPos += 10;
            const summaryLines = doc.splitTextToSize(report.summary, 170);
            doc.text(summaryLines, 20, yPos);
          });
          
          // Compliance Scores Section - in a separate chunk
          await performChunk(() => {
            let yPos = 120; // Approximate position after summary
            doc.setFontSize(16);
            doc.setTextColor(0, 51, 102);
            doc.text('Compliance Scores', 20, yPos);
            yPos += 10;
            
            // Render compliance scores section
            yPos = renderComplianceScores(doc, report, yPos, language);
          });
          
          // Add compliance charts if image is provided - in a separate chunk
          if (chartImageBase64) {
            await performChunk(() => {
              // Check if we need a new page
              let yPos = 160; // Approximate position
              if (yPos > 220) {
                doc.addPage();
                yPos = 20;
              }
              
              yPos = addComplianceCharts(doc, report, chartImageBase64, yPos);
            });
          }
          
          // Process compliance issues - in chunks
          await performChunk(() => {
            let yPos = 190; // Approximate position
            // Check if we need a new page
            if (yPos > 220) {
              doc.addPage();
              yPos = 20;
            }
            
            // Render compliance issues section
            yPos = renderComplianceIssues(doc, report, yPos, language);
          });
          
          // Process improvement suggestions - in chunks
          await performChunk(() => {
            let yPos = 220; // Approximate position
            // Add a new page for improvement suggestions
            doc.addPage();
            yPos = 20;
            
            // Render improvement suggestions section
            yPos = renderImprovementSuggestions(doc, report, yPos, language);
          });
          
          // Add footer with page numbers - final chunk
          await performChunk(async () => {
            await addFooter(doc, report.risks);
          });
          
          console.log('PDF document creation completed, generating blob...');
          
          // Final chunk - generate blob and resolve
          await performChunk(() => {
            // Generate the PDF as a blob with optimized settings
            const pdfBlob = doc.output('blob');
            
            resolve({
              success: true,
              data: pdfBlob,
              status: 200
            });
          });
        } catch (error) {
          console.error('Report generation error:', error);
          resolve({
            success: false,
            error: 'Failed to generate the PDF report. Please try again.',
            status: 500
          });
        }
      }, 10); // Very small delay to allow UI thread to update before starting PDF generation
    });
  });
};
