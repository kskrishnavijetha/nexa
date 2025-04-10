
import { jsPDF } from 'jspdf';
import { PredictiveAnalysis } from '@/utils/types';

/**
 * Configure the PDF document with initial properties and settings
 */
export const configureDocument = (analysis: PredictiveAnalysis): jsPDF => {
  // Create PDF with optimized settings (fixed margins option)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true
  });
  
  // Set document properties
  pdf.setProperties({
    title: `Simulation Analysis - ${analysis.scenarioName}`,
    subject: 'Compliance Scenario Simulation Results',
    creator: 'Compliance Report Generator',
    keywords: 'compliance,simulation,scenario'
  });
  
  // Set margins manually instead of in constructor
  pdf.setDrawColor(0, 51, 102);
  
  return pdf;
};
