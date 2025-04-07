
import { jsPDF } from 'jspdf';
import { ComplianceReport } from '@/utils/types';
import { getScoreColor } from '../utils/colorUtils';
import { SupportedLanguage, translate } from '@/utils/language';

/**
 * Render the compliance scores section in the PDF
 */
export const renderComplianceScores = (
  doc: jsPDF,
  report: ComplianceReport,
  startY: number,
  language: SupportedLanguage = 'en'
): number => {
  let yPos = startY;
  
  // Add scores with colored indicators
  doc.setFontSize(11);
  
  // Overall score
  const overallScoreColor = getScoreColor(report.overallScore);
  doc.setTextColor.apply(doc, overallScoreColor);
  doc.text(`${translate('overall_compliance', language)}: ${report.overallScore}%`, 25, yPos);
  yPos += 8;
  
  // Add standard scores
  const gdprColor = getScoreColor(report.gdprScore);
  doc.setTextColor.apply(doc, gdprColor);
  doc.text(`${translate('gdpr_compliance', language)}: ${report.gdprScore}%`, 25, yPos);
  yPos += 8;
  
  const hipaaColor = getScoreColor(report.hipaaScore);
  doc.setTextColor.apply(doc, hipaaColor);
  doc.text(`${translate('hipaa_compliance', language)}: ${report.hipaaScore}%`, 25, yPos);
  yPos += 8;
  
  const soc2Color = getScoreColor(report.soc2Score);
  doc.setTextColor.apply(doc, soc2Color);
  doc.text(`${translate('soc2_compliance', language)}: ${report.soc2Score}%`, 25, yPos);
  yPos += 8;
  
  if (report.pciDssScore) {
    const pciColor = getScoreColor(report.pciDssScore);
    doc.setTextColor.apply(doc, pciColor);
    doc.text(`${translate('pci_dss_compliance', language)}: ${report.pciDssScore}%`, 25, yPos);
    yPos += 8;
  }
  
  // Add industry-specific scores if available
  if (report.industryScores && Object.keys(report.industryScores).length > 0) {
    yPos += 3;
    doc.setTextColor(0, 51, 102);
    doc.text(`${translate('industry_specific_compliance', language)}:`, 25, yPos);
    yPos += 7;
    
    for (const [regulation, score] of Object.entries(report.industryScores)) {
      const color = getScoreColor(score as number);
      doc.setTextColor.apply(doc, color);
      doc.text(`${regulation}: ${score}%`, 30, yPos);
      yPos += 7;
      
      // If we're near the end of the page, create a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    }
  }
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  return yPos;
};
