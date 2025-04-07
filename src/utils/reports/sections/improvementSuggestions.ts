
import { jsPDF } from 'jspdf';
import { ComplianceReport } from '@/utils/types';
import { SupportedLanguage, translate } from '@/utils/language';

/**
 * Render the improvement suggestions section in the PDF
 */
export const renderImprovementSuggestions = (
  doc: jsPDF,
  report: ComplianceReport,
  startY: number,
  language: SupportedLanguage = 'en'
): number => {
  let yPos = startY;
  
  // Add suggestions section if available
  if (report.suggestions && report.suggestions.length > 0) {
    // Check if we need a new page
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
    }
    
    yPos += 5;
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text(translate('improvement_suggestions', language), 20, yPos);
    yPos += 10;
    
    // Set normal font for content
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    // Add each suggestion
    for (const suggestion of report.suggestions) {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      
      // Add bullet point
      doc.text('•', 20, yPos);
      
      // Add suggestion text with wrapping
      const suggestionLines = doc.splitTextToSize(suggestion.description, 165);
      doc.text(suggestionLines, 25, yPos);
      yPos += (suggestionLines.length * 5) + 5;
    }
  }
  
  return yPos;
};
