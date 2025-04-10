
import { jsPDF } from 'jspdf';

/**
 * Add footer and disclaimer to the simulation PDF
 */
export const addFooterAndDisclaimer = (pdf: jsPDF): void => {
  // Get total number of pages
  const pageCount = pdf.internal.pages.length - 1;
  
  // Add disclaimer and page numbers to each page
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    
    // Add page number
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Page ${i} of ${pageCount}`, 20, 10, { baseline: 'top' });
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 190, 10, { align: 'right', baseline: 'top' });
    
    // Add disclaimer at the bottom
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text("LEGAL DISCLAIMER: This report is for informational purposes only and does not constitute legal advice.", 105, 287, { align: 'center' });
  }
};
