
import { jsPDF } from 'jspdf';
import { ComplianceReport } from '@/utils/types';

/**
 * Add compliance charts visualization to the PDF report
 * @returns The updated Y position after adding the charts
 */
export const addComplianceCharts = (
  pdf: jsPDF,
  report: ComplianceReport,
  chartImageBase64?: string,
  startYPos: number = 0
): number => {
  let yPos = startYPos + 10;
  
  // Check if we need a new page
  if (yPos > 200) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Add section title
  pdf.setFontSize(16);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Compliance Visualization', 20, yPos);
  yPos += 10;
  
  // Add the chart image if provided
  if (chartImageBase64) {
    try {
      // Add the chart image with proper sizing
      const imgWidth = 170; // Width of the chart in the PDF
      const imgHeight = 90; // Height of the chart
      pdf.addImage(chartImageBase64, 'PNG', 20, yPos, imgWidth, imgHeight);
      yPos += imgHeight + 15;
    } catch (imageError) {
      console.error('Error adding compliance chart to PDF:', imageError);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Chart visualization could not be included', 20, yPos + 10);
      yPos += 20;
    }
  } else {
    // No chart image provided
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Chart visualization not available for this report', 20, yPos + 10);
    yPos += 20;
  }
  
  return yPos;
};
