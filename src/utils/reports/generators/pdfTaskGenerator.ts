
import { jsPDF } from 'jspdf';
import { ComplianceReport } from '../../types';
import { SupportedLanguage, translate } from '../../language';
import { 
  renderDocumentHeader,
  renderDocumentInfo,
  renderSummarySection
} from '../renderers/documentSections';
import { renderComplianceScores } from '../sections/complianceScores';
import { renderComplianceIssues } from '../sections/complianceIssues';
import { renderImprovementSuggestions } from '../sections/improvementSuggestions';
import { addFooter } from '../sections/footer';
import { addComplianceCharts } from '../sections/complianceCharts';

/**
 * Generate all tasks needed for PDF generation
 * Each task is a separate function to improve performance and avoid UI blocking
 */
export const generatePdfTasks = (
  doc: jsPDF, 
  report: ComplianceReport,
  language: SupportedLanguage,
  chartImageBase64?: string
): Array<() => Promise<string | Blob>> => {
  return [
    // Task 1: Document Header
    async () => renderDocumentHeader(doc, language),
    
    // Task 2: Document Info
    async () => renderDocumentInfo(doc, report, language),
    
    // Task 3: Summary Section
    async () => renderSummarySection(doc, report, language),
    
    // Task 4: Compliance Scores
    async () => {
      // Compliance Scores Section
      let scoresYPos = 120;
      doc.setFontSize(16);
      doc.setTextColor(0, 51, 102);
      doc.text('Compliance Scores', 20, scoresYPos);
      scoresYPos += 10;
      
      // Render compliance scores section
      renderComplianceScores(doc, report, scoresYPos, language);
      
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
        
        addComplianceCharts(doc, report, chartImageBase64, chartsYPos);
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
      renderComplianceIssues(doc, tempReport, issuesYPos, language);
      
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
        renderImprovementSuggestions(doc, limitedSuggestionsReport, suggestionsYPos, language);
      } else {
        renderImprovementSuggestions(doc, report, suggestionsYPos, language);
      }
      
      return 'suggestions';
    },
    
    // Task 8: Footer and Final Processing
    async () => {
      // Add footer with page numbers - final operation
      await addFooter(doc, report.risks.slice(0, 3)); // Only use a few risks for the footer
      
      // Generate the PDF as a blob with optimized settings
      const pdfBlob = doc.output('blob');
      
      return pdfBlob;
    }
  ];
};
