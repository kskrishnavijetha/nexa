
import { jsPDF } from 'jspdf';
import { PredictiveAnalysis } from '@/utils/types';

/**
 * Add title and scenario information to the simulation PDF
 * @returns The updated Y position after adding the header
 */
export const addSimulationHeader = (
  pdf: jsPDF,
  analysis: PredictiveAnalysis
): number => {
  // Add title
  pdf.setFontSize(22);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Scenario Simulation Report', 20, 20);
  
  // Add horizontal line
  pdf.setDrawColor(0, 51, 102);
  pdf.setLineWidth(0.5);
  pdf.line(20, 25, 190, 25);
  
  // Add scenario details
  let yPos = 40;
  pdf.setFontSize(16);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Scenario Information', 20, yPos);
  
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  yPos += 10;
  pdf.text(`Scenario: ${analysis.scenarioName}`, 20, yPos);
  yPos += 7;
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, yPos);
  yPos += 7;
  
  if (analysis.scenarioDescription) {
    yPos += 5;
    pdf.setFontSize(11);
    pdf.text('Description:', 20, yPos);
    yPos += 7;
    
    // Handle description text wrapping
    const descriptionLines = pdf.splitTextToSize(analysis.scenarioDescription, 170);
    pdf.text(descriptionLines, 20, yPos);
    yPos += (descriptionLines.length * 6) + 10;
  }
  
  return yPos;
};
