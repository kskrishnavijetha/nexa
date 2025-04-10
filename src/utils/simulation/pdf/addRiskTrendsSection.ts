
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
  
  // Check if we need a new page - use more conservative threshold
  if (yPos > 220) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Add section title
  pdf.setFontSize(16);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Risk Trend Analysis', 20, yPos);
  yPos += 10;
  
  // If no trends, add message
  if (!riskTrends || riskTrends.length === 0) {
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text("No risk trend data available for this simulation.", 20, yPos + 5);
    return yPos + 15;
  }
  
  // Add risk trends
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  
  for (let i = 0; i < riskTrends.length; i++) {
    const trend = riskTrends[i];
    
    // Check if we need a new page - more conservative threshold to prevent overlap
    if (yPos > 210) {
      pdf.addPage();
      
      // Add page header for continuity
      pdf.setFontSize(12);
      pdf.setTextColor(0, 51, 102);
      pdf.text('Risk Trend Analysis (continued)', 20, 20);
      yPos = 35; // Start a bit lower to account for the header
    }
    
    // Add trend information - each trend takes approximately 30-35 units of space
    const trendTitle = `${i + 1}. ${trend.regulation}`;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 100);
    pdf.text(trendTitle, 20, yPos);
    yPos += 8;
    
    // Add description with text wrapping
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const descriptionLines = pdf.splitTextToSize(trend.description, 170);
    pdf.text(descriptionLines, 20, yPos);
    yPos += (descriptionLines.length * 5) + 5;
    
    // Add trend information
    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);
    
    // Trend direction
    const trendText = `Trend: ${
      trend.trend === 'increase' ? 'Increasing ↑' : 
      trend.trend === 'decrease' ? 'Decreasing ↓' : 
      'Stable →'
    }`;
    pdf.text(trendText, 25, yPos);
    yPos += 5;
    
    // Impact level
    pdf.text(`Impact: ${trend.impact ? trend.impact.charAt(0).toUpperCase() + trend.impact.slice(1) : 'Medium'}`, 25, yPos);
    yPos += 5;
    
    // Current and projected severities
    pdf.text(`Current Severity: ${trend.currentSeverity.charAt(0).toUpperCase() + trend.currentSeverity.slice(1)}`, 25, yPos);
    yPos += 5;
    
    if (trend.projectedSeverity) {
      pdf.text(`Projected Severity: ${trend.projectedSeverity.charAt(0).toUpperCase() + trend.projectedSeverity.slice(1)}`, 25, yPos);
      yPos += 5;
    }
    
    // Add some spacing between items
    yPos += 8;
    
    // Add a light separator between items (except last item)
    if (i < riskTrends.length - 1) {
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.1);
      pdf.line(20, yPos - 4, 190, yPos - 4);
    }
  }
  
  return yPos;
};
