
import { ApiResponse, ComplianceReport } from '../types';
import { SupportedLanguage, translate } from '../language';
import jsPDF from 'jspdf';
import { renderComplianceScores } from './sections/complianceScores';
import { renderComplianceIssues } from './sections/complianceIssues';
import { renderImprovementSuggestions } from './sections/improvementSuggestions';
import { addFooter } from './sections/footer';
import { addComplianceCharts } from './sections/complianceCharts';
import { executeInChunks, forceGarbageCollection } from '../memoryUtils';

/**
 * Generate a downloadable compliance report PDF
 * Extreme optimization for memory usage and UI responsiveness
 */
export const generateReportPDF = async (
  report: ComplianceReport,
  language: SupportedLanguage = 'en',
  chartImageBase64?: string
): Promise<ApiResponse<Blob>> => {
  return new Promise((resolve) => {
    // Use setTimeout with zero delay to create a separate task
    setTimeout(async () => {
      try {
        console.log('Creating PDF document with extreme optimizations...');
        
        // Force garbage collection before start
        forceGarbageCollection();
        
        // Create a new PDF document with extreme optimization settings
        const doc = new jsPDF({
          orientation: 'portrait', 
          unit: 'mm',
          format: 'a4',
          compress: true,
          putOnlyUsedFonts: true,
          floatPrecision: 2 // Extremely reduced precision for better memory efficiency
        });
        
        // Break down processing into micro-tasks to avoid UI blocking
        const tasks = [
          // Task 1: Document Header
          async () => {
            // Set font size and styles
            doc.setFontSize(22);
            doc.setTextColor(0, 51, 102);
            
            // Add title
            doc.text(translate('compliance_report', language), 20, 20);
            
            // Add horizontal line
            doc.setDrawColor(0, 51, 102);
            doc.setLineWidth(0.5);
            doc.line(20, 25, 190, 25);
            
            return 'header';
          },
          
          // Task 2: Document Info
          async () => {
            // Document Details Section
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
            doc.text(`${translate('generated', language)}: ${new Date().toLocaleDateString()}`, 20, yPos);
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
              
              // Limit regulations to 2 for performance
              if (report.regulations && report.regulations.length > 0) {
                const regulations = report.regulations.slice(0, 2).join(', ');
                doc.text(`${translate('applicable_regulations', language)}: ${regulations}`, 20, yPos);
                yPos += 7;
              }
            }
            
            return 'document-info';
          },
          
          // Task 3: Summary Section
          async () => {
            // Summary Section - with truncated text for performance
            let summaryYPos = 90;
            doc.setFontSize(16);
            doc.setTextColor(0, 51, 102);
            doc.text(translate('summary', language), 20, summaryYPos);
            
            // Set normal font for content
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            
            // Add wrapped summary text - extremely limited length for performance
            summaryYPos += 10;
            const summaryText = report.summary.length > 200
              ? report.summary.substring(0, 200) + '...' 
              : report.summary;
            const summaryLines = doc.splitTextToSize(summaryText, 170);
            doc.text(summaryLines, 20, summaryYPos);
            
            return 'summary';
          },
          
          // Task 4: Compliance Scores
          async () => {
            // Compliance Scores Section
            let scoresYPos = 120;
            doc.setFontSize(16);
            doc.setTextColor(0, 51, 102);
            doc.text('Compliance Scores', 20, scoresYPos);
            scoresYPos += 10;
            
            // Render compliance scores section
            scoresYPos = renderComplianceScores(doc, report, scoresYPos, language);
            
            return 'scores';
          },
          
          // Task 5: Charts
          async () => {
            // Add compliance charts if image is provided
            let chartsYPos = 160;
            if (chartImageBase64) {
              // Check if we need a new page
              if (chartsYPos > 220) {
                doc.addPage();
                chartsYPos = 20;
              }
              
              chartsYPos = addComplianceCharts(doc, report, chartImageBase64, chartsYPos);
            }
            
            return 'charts';
          },
          
          // Task 6: Compliance Issues
          async () => {
            // Process compliance issues - severely limit risks for better performance
            let issuesYPos = 190;
            // Check if we need a new page
            if (issuesYPos > 220) {
              doc.addPage();
              issuesYPos = 20;
            }
            
            // Limit risks to 5 most critical for performance
            let limitedRisks = [];
            if (report.risks.length > 5) {
              // Only include high severity risks
              const highRisks = report.risks.filter(r => r.severity === 'high').slice(0, 5);
              limitedRisks = highRisks.length > 0 ? highRisks : report.risks.slice(0, 3);
            } else {
              limitedRisks = report.risks;
            }
            
            // Create a trimmed-down report with fewer risks
            const tempReport = { ...report, risks: limitedRisks };
            issuesYPos = renderComplianceIssues(doc, tempReport, issuesYPos, language);
            
            return 'issues';
          },
          
          // Task 7: Improvement Suggestions
          async () => {
            // Process improvement suggestions - limit to 3 most important
            let suggestionsYPos = 220;
            // Add a new page for improvement suggestions
            doc.addPage();
            suggestionsYPos = 20;
            
            // Severely limit suggestions for performance
            if (report.suggestions && report.suggestions.length > 3) {
              const limitedSuggestions = report.suggestions.slice(0, 3);
              const limitedSuggestionsReport = { ...report, suggestions: limitedSuggestions };
              suggestionsYPos = renderImprovementSuggestions(doc, limitedSuggestionsReport, suggestionsYPos, language);
            } else {
              suggestionsYPos = renderImprovementSuggestions(doc, report, suggestionsYPos, language);
            }
            
            return 'suggestions';
          },
          
          // Task 8: Footer and Final Processing
          async () => {
            // Add footer with page numbers - final operation
            await addFooter(doc, report.risks.slice(0, 3)); // Only use a few risks for the footer
            
            // Generate the PDF as a blob with optimized settings
            const pdfBlob = doc.output('blob');
            
            // Force garbage collection after PDF generation
            forceGarbageCollection();
            
            return pdfBlob;
          }
        ];
        
        // FIX: Define a union type for our task results that includes both string and Blob
        type TaskResult = string | Blob;
        
        // FIX: Change the executeInChunks call to use the correct type
        const results = await executeInChunks<TaskResult>(tasks, 1, (processed, total) => {
          const percent = Math.floor((processed / total) * 80);
          console.log(`PDF generation progress: ${percent}%`);
        });
        
        // FIX: The last task returns the PDF blob, cast it properly
        const pdfBlob = results[results.length - 1] as Blob;
        
        resolve({
          success: true,
          data: pdfBlob,
          status: 200
        });
      } catch (error) {
        console.error('Report generation error:', error);
        resolve({
          success: false,
          error: 'Failed to generate the PDF report. Please try again.',
          status: 500
        });
      }
    }, 0);
  });
};
