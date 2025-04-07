
import { jsPDF } from 'jspdf';
import { ComplianceReport } from '@/utils/types';
import { SupportedLanguage, translate } from '@/utils/language';
import { getScoreColor } from '../utils/colorUtils';

/**
 * Render the compliance issues section in the PDF
 */
export const renderComplianceIssues = (
  doc: jsPDF,
  report: ComplianceReport,
  startY: number,
  language: SupportedLanguage = 'en'
): number => {
  let yPos = startY;
  
  // Compliance Issues Section
  yPos += 10;
  doc.setFontSize(16);
  doc.setTextColor(0, 51, 102);
  doc.text(translate('compliance_issues', language), 20, yPos);
  yPos += 10;
  
  // Set normal font for content
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  
  // Add each risk with better formatting
  for (const risk of report.risks) {
    // Check if we need a page break
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Add risk title with severity indicator
    let severityColor: [number, number, number];
    if (risk.severity === 'high') {
      severityColor = [187, 10, 30]; // Red
    } else if (risk.severity === 'medium') {
      severityColor = [204, 102, 0]; // Orange
    } else {
      severityColor = [0, 102, 51]; // Green
    }
    
    // Draw severity indicator
    doc.setFillColor.apply(doc, severityColor);
    doc.circle(20, yPos - 3, 2, 'F');
    
    // Add risk title
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(risk.title, 25, yPos);
    yPos += 6;
    
    // Add risk description
    doc.setFontSize(10);
    const descriptionLines = doc.splitTextToSize(risk.description, 160);
    doc.text(descriptionLines, 25, yPos);
    yPos += (descriptionLines.length * 5) + 2;
    
    // Add regulation reference if available
    if (risk.regulation || risk.section) {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`${translate('regulation', language)}: ${risk.regulation || 'General'}${risk.section ? ` - ${risk.section}` : ''}`, 25, yPos);
      yPos += 5;
    }
    
    // Add mitigation suggestion if available
    if (risk.mitigation) {
      doc.setFontSize(9);
      doc.setTextColor(0, 70, 140);
      doc.text(`Recommendation: ${risk.mitigation}`, 25, yPos);
      yPos += 8;
    }
    
    // Add a small gap between risks
    yPos += 5;
  }
  
  return yPos;
};
