
import { jsPDF } from 'jspdf';
import { ComplianceReport } from '@/utils/types';
import { SupportedLanguage, translate } from '@/utils/language';

/**
 * Render the compliance issues section in the PDF with improved pagination
 */
export const renderComplianceIssues = (
  doc: jsPDF,
  report: ComplianceReport,
  startY: number,
  language: SupportedLanguage = 'en'
): number => {
  let yPos = startY;
  
  // Add compliance issues section
  if (report.risks && report.risks.length > 0) {
    // Check if we need a new page
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
    }
    
    yPos += 5;
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text(translate('compliance_issues', language), 20, yPos);
    yPos += 10;
    
    // Set styles for issue content
    doc.setFontSize(11);
    
    // Add each risk
    for (const risk of report.risks) {
      // Check if we need a new page for this risk
      const estimatedHeight = 25; // Estimated height for a risk entry
      if (yPos + estimatedHeight > 270) {
        doc.addPage();
        yPos = 20;
        
        // Add section header on new page for context
        doc.setFontSize(14);
        doc.setTextColor(0, 51, 102);
        doc.text(translate('compliance_issues_continued', language), 20, yPos);
        yPos += 10;
        doc.setFontSize(11);
      }
      
      // Draw risk box with background color based on severity
      let bgColor;
      switch (risk.severity) {
        case 'high':
          bgColor = [255, 240, 240];
          doc.setTextColor(180, 0, 0);
          break;
        case 'medium':
          bgColor = [255, 250, 230];
          doc.setTextColor(180, 90, 0);
          break;
        default:
          bgColor = [240, 255, 240];
          doc.setTextColor(0, 100, 0);
      }
      
      // Draw background rectangle
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.setDrawColor(230, 230, 230);
      doc.roundedRect(20, yPos, 170, 20, 1, 1, 'F');
      
      // Add severity and regulation
      doc.text(risk.severity.toUpperCase(), 25, yPos + 5);
      
      doc.setTextColor(100, 100, 100);
      doc.text(risk.regulation || '', 160, yPos + 5, { align: 'right' });
      
      // Add description
      doc.setTextColor(0, 0, 0);
      const descriptionLines = doc.splitTextToSize(risk.description, 160);
      doc.text(descriptionLines, 25, yPos + 12);
      
      // Calculate space needed for this risk entry
      const riskHeight = 20; // Base height 
      yPos += riskHeight + 5; // Add padding between risks
    }
  } else {
    // Add no risks found message
    doc.setFontSize(11);
    doc.setTextColor(0, 100, 0);
    doc.text(translate('no_issues_found', language), 20, yPos + 5);
    yPos += 15;
  }
  
  return yPos;
};
