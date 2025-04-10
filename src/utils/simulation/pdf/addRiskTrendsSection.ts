
import { jsPDF } from 'jspdf';
import { RiskTrend } from '@/utils/types';

/**
 * Add risk trends section to the simulation PDF
 * @returns The updated Y position after adding the section
 */
export const addRiskTrendsSection = (
  pdf: jsPDF,
  riskTrends: RiskTrend[] = [],
  startYPos: number = 0
): number => {
  let yPos = startYPos + 15;
  
  pdf.setFontSize(16);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Risk Trend Analysis', 20, yPos);
  yPos += 10;
  
  // Create risk trends table
  if (riskTrends && riskTrends.length > 0) {
    // Table header
    const riskHeaders = ['Regulation', 'Trend', 'Impact', 'Description'];
    const riskColumnWidths = [30, 25, 25, 100];
    let xPos = 20;
    
    // Draw table header
    pdf.setFillColor(240, 240, 240);
    pdf.rect(xPos, yPos, riskColumnWidths.reduce((a, b) => a + b, 0), 8, 'F');
    pdf.setFont('helvetica', 'bold');
    
    for (let i = 0; i < riskHeaders.length; i++) {
      pdf.text(riskHeaders[i], xPos + 5, yPos + 5);
      xPos += riskColumnWidths[i];
    }
    
    // Draw risk trend rows
    pdf.setFont('helvetica', 'normal');
    yPos += 8;
    
    // Limit to prevent overly long PDFs
    const maxRisks = Math.min(riskTrends.length, 10);
    
    for (let i = 0; i < maxRisks; i++) {
      const risk = riskTrends[i];
      xPos = 20;
      
      // Check if we need a new page
      if (yPos > 260) {
        pdf.addPage();
        yPos = 20;
      }
      
      // Alternate row background
      if (i % 2 === 0) {
        pdf.setFillColor(250, 250, 250);
        pdf.rect(xPos, yPos, riskColumnWidths.reduce((a, b) => a + b, 0), 16, 'F');
      }
      
      // Regulation
      pdf.text(risk.regulation, xPos + 5, yPos + 5);
      xPos += riskColumnWidths[0];
      
      // Trend
      const trendText = risk.trend.charAt(0).toUpperCase() + risk.trend.slice(1);
      pdf.text(trendText, xPos + 5, yPos + 5);
      xPos += riskColumnWidths[1];
      
      // Impact
      pdf.text(risk.impact.toUpperCase(), xPos + 5, yPos + 5);
      xPos += riskColumnWidths[2];
      
      // Description (with wrapping)
      const riskLines = pdf.splitTextToSize(risk.description, riskColumnWidths[3] - 10);
      pdf.text(riskLines, xPos + 5, yPos + 5);
      
      // Increase row height if needed for wrapped text
      const lineHeight = Math.max(16, riskLines.length * 6 + 4);
      yPos += lineHeight;
    }
  } else {
    pdf.setFontSize(11);
    pdf.text("No risk trends available for this simulation.", 20, yPos + 10);
    yPos += 20;
  }
  
  return yPos;
};
