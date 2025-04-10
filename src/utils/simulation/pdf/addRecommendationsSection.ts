
import { jsPDF } from 'jspdf';

/**
 * Add recommendations section to the simulation PDF
 * @returns The updated Y position after adding the section
 */
export const addRecommendationsSection = (
  pdf: jsPDF,
  recommendations: string[] = [],
  startYPos: number = 0
): number => {
  let yPos = startYPos + 15;
  
  // Check if we need a new page - use more conservative threshold
  if (yPos > 230) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Add section title
  pdf.setFontSize(16);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Recommendations', 20, yPos);
  yPos += 10;
  
  // Add recommendations as bullet points
  if (recommendations && recommendations.length > 0) {
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    
    for (let i = 0; i < recommendations.length; i++) {
      // Check if we need a new page - more conservative threshold
      if (yPos > 250) {
        pdf.addPage();
        // Add header for continuity
        pdf.setFontSize(12);
        pdf.setTextColor(0, 51, 102);
        pdf.text('Recommendations (continued)', 20, 20);
        yPos = 35;
      }
      
      const bulletedText = `• ${recommendations[i]}`;
      const recommendationLines = pdf.splitTextToSize(bulletedText, 170);
      pdf.text(recommendationLines, 20, yPos);
      yPos += (recommendationLines.length * 6) + 5;
    }
  } else {
    pdf.setFontSize(11);
    pdf.text("No recommendations available for this simulation.", 20, yPos + 5);
    yPos += 15;
  }
  
  return yPos;
};
