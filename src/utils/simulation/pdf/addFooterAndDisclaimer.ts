
import { jsPDF } from 'jspdf';

/**
 * Add footer and disclaimer to the simulation PDF
 */
export const addFooterAndDisclaimer = (pdf: jsPDF): void => {
  // Add disclaimer
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text("Note: This is a simulation result based on the scenario parameters and does not guarantee actual compliance outcomes.", 20, 280);
};
