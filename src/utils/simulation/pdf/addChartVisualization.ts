
import { jsPDF } from 'jspdf';

/**
 * Add chart visualization image to the simulation PDF
 * @returns The updated Y position after adding the chart
 */
export const addChartVisualization = (
  pdf: jsPDF,
  chartImageBase64?: string,
  startYPos: number = 0
): number => {
  let yPos = startYPos;
  
  // Add score comparison chart if image is provided
  if (chartImageBase64) {
    yPos += 10;
    pdf.setFontSize(16);
    pdf.setTextColor(0, 51, 102);
    pdf.text('Compliance Score Visualization', 20, yPos);
    yPos += 10;
    
    try {
      // Add the chart image with proper sizing
      const imgWidth = 170; // Width of the chart in the PDF
      const imgHeight = 80; // Height of the chart
      pdf.addImage(chartImageBase64, 'PNG', 20, yPos, imgWidth, imgHeight);
      yPos += imgHeight + 15;
    } catch (imageError) {
      console.error('Error adding chart image to PDF:', imageError);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Chart visualization could not be included', 20, yPos + 10);
      yPos += 20;
    }
  }
  
  return yPos;
};
