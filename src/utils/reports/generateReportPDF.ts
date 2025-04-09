
import { ApiResponse, ComplianceReport } from '../types';
import { SupportedLanguage, translate } from '../language';
import jsPDF from 'jspdf';
import { renderComplianceScores } from './sections/complianceScores';
import { renderComplianceIssues } from './sections/complianceIssues';
import { renderImprovementSuggestions } from './sections/improvementSuggestions';
import { addFooter } from './sections/footer';

/**
 * Generate a downloadable compliance report PDF with optimized performance
 */
export const generateReportPDF = async (
  report: ComplianceReport,
  language: SupportedLanguage = 'en'
): Promise<ApiResponse<Blob>> => {
  try {
    // Create a new PDF document with optimized settings
    const doc = new jsPDF({
      compress: true, // Enable compression for smaller file size
      putOnlyUsedFonts: true, // Only embed used fonts
      precision: 2 // Lower precision for better performance
    });
    
    // Set font size and styles
    doc.setFontSize(22);
    doc.setTextColor(0, 51, 102);
    
    // Add title
    doc.text(translate('compliance_report', language), 20, 20);
    
    // Add horizontal line
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
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
      
      // List applicable regulations if available - limit to prevent performance issues
      if (report.regulations && report.regulations.length > 0) {
        // Join only first 3 regulations if there are many
        const displayRegulations = report.regulations.length > 3 
          ? report.regulations.slice(0, 3).join(', ') + '...'
          : report.regulations.join(', ');
          
        doc.text(`${translate('applicable_regulations', language)}: ${displayRegulations}`, 20, yPos);
        yPos += 7;
      }
    }
    
    // Summary Section
    yPos += 5;
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text(translate('summary', language), 20, yPos);
    
    // Set normal font for content
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    // Add wrapped summary text with optimized text splitting
    yPos += 10;
    // Limit summary length for better performance
    const summaryText = report.summary.length > 300 
      ? report.summary.substring(0, 300) + '...'
      : report.summary;
    
    const summaryLines = doc.splitTextToSize(summaryText, 170);
    doc.text(summaryLines, 20, yPos);
    
    // Calculate Y position after summary
    yPos += (summaryLines.length * 7) + 10;
    
    // Compliance Scores Section
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text('Compliance Scores', 20, yPos);
    yPos += 10;
    
    // Render compliance scores section
    yPos = renderComplianceScores(doc, report, yPos, language);
    
    // Check if we need a new page
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }
    
    // Limit the number of risks to display for better performance
    if (report.risks && report.risks.length > 10) {
      report.risks = report.risks.slice(0, 10); // Limit to 10 most important risks
    }
    
    // Render compliance issues section
    yPos = renderComplianceIssues(doc, report, yPos, language);
    
    // Limit the number of suggestions to display for better performance
    if (report.suggestions && report.suggestions.length > 5) {
      report.suggestions = report.suggestions.slice(0, 5); // Limit to 5 most important suggestions
    }
    
    // Render improvement suggestions section
    yPos = renderImprovementSuggestions(doc, report, yPos, language);
    
    // Add footer with page numbers
    addFooter(doc);
    
    // Generate the PDF as a blob with optimal settings
    const pdfBlob = doc.output('blob');
    
    return {
      success: true,
      data: pdfBlob,
      status: 200
    };
  } catch (error) {
    console.error('Report generation error:', error);
    return {
      success: false,
      error: 'Failed to generate the PDF report. Please try again.',
      status: 500
    };
  }
};
