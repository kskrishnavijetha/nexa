
import { jsPDF } from 'jspdf';
import { ComplianceReport } from '@/utils/types';
import { SupportedLanguage, translate } from '@/utils/language';

/**
 * Render the compliance scores section in the PDF with improved layout
 */
export const renderComplianceScores = (
  doc: jsPDF,
  report: ComplianceReport,
  startY: number,
  language: SupportedLanguage = 'en'
): number => {
  let yPos = startY;
  
  // Define score rendering function
  const renderScore = (
    label: string, 
    score: number, 
    x: number, 
    y: number, 
    width: number = 80
  ) => {
    // Draw background
    const bgColor = score >= 70 ? [240, 255, 240] : [255, 240, 240];
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.roundedRect(x, y, width, 30, 1, 1, 'F');
    
    // Add label
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(label, x + 5, y + 8);
    
    // Add score
    doc.setFontSize(16);
    doc.setTextColor(score >= 70 ? 0 : 200, score >= 70 ? 100 : 0, 0);
    doc.text(`${score}%`, x + 5, y + 23);
  };
  
  // Create a responsive grid layout for scores
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const usableWidth = pageWidth - (margin * 2);
  const columnWidth = usableWidth / 2 - 5; // 2 columns with small gap
  
  // First row
  renderScore('GDPR Score', report.gdprScore, margin, yPos, columnWidth);
  renderScore('HIPAA Score', report.hipaaScore, margin + columnWidth + 10, yPos, columnWidth);
  
  // Move down for second row
  yPos += 35;
  
  // Check if page break needed
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  }
  
  // Second row
  renderScore('SOC2 Score', report.soc2Score, margin, yPos, columnWidth);
  
  // Only add PCI DSS if available
  if (report.pciDssScore !== undefined) {
    renderScore('PCI DSS Score', report.pciDssScore, margin + columnWidth + 10, yPos, columnWidth);
  }
  
  // Move to next section
  yPos += 40;
  
  // Add overall compliance status
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text('Overall Compliance Status', margin, yPos);
  yPos += 10;
  
  // Draw overall score box
  const overallColor = report.overallScore >= 70 
    ? [0, 100, 0] // Green for good score
    : [200, 0, 0]; // Red for poor score
  
  doc.setFillColor(report.overallScore >= 70 ? 240 : 255, report.overallScore >= 70 ? 255 : 240, report.overallScore >= 70 ? 240 : 240);
  doc.roundedRect(margin, yPos, usableWidth, 40, 2, 2, 'F');
  
  // Add overall score text
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Overall Score', margin + 10, yPos + 15);
  
  // Add score value
  doc.setFontSize(22);
  doc.setTextColor(overallColor[0], overallColor[1], overallColor[2]);
  doc.text(`${report.overallScore}%`, margin + 10, yPos + 30);
  
  // Add compliance status text
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Status', margin + usableWidth - 80, yPos + 15);
  
  // Add status value
  doc.setFontSize(16);
  doc.setTextColor(overallColor[0], overallColor[1], overallColor[2]);
  
  let statusText = 'Unknown';
  if (report.complianceStatus) {
    statusText = report.complianceStatus === 'compliant' ? 'Compliant' : 
                report.complianceStatus === 'partially-compliant' ? 'Partially Compliant' : 'Non-Compliant';
  } else {
    // Derive status from score if not explicitly provided
    statusText = report.overallScore >= 80 ? 'Compliant' :
                report.overallScore >= 60 ? 'Partially Compliant' : 'Non-Compliant';
  }
  
  doc.text(statusText, margin + usableWidth - 80, yPos + 30);
  
  // Move to next section
  yPos += 50;
  
  return yPos;
};
