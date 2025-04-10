
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
  
  // Check if we need a new page
  if (yPos > 240) {
    pdf.addPage();
    yPos = 20;
  }
  
  pdf.setFontSize(16);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Recommendations', 20, yPos);
  yPos += 10;
  
  // Add recommendations as bullet points
  if (recommendations && recommendations.length > 0) {
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    
    recommendations.forEach((recommendation) => {
      // Check if we need a new page
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      
      const bulletedText = `• ${recommendation}`;
      const recommendationLines = pdf.splitTextToSize(bulletedText, 170);
      pdf.text(recommendationLines, 20, yPos);
      yPos += (recommendationLines.length * 6) + 5;
    });
  } else {
    pdf.setFontSize(11);
    pdf.text("No recommendations available for this simulation.", 20, yPos + 5);
    yPos += 15;
  }
  
  return yPos;
};
