
import { jsPDF } from 'jspdf';

/**
 * Add footer with page numbers and legal disclaimer to the PDF document
 */
export const addFooter = (doc: jsPDF): void => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Page number footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, 105, 280, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 190, 280, { align: 'right' });
    
    // Legal disclaimer
    doc.setFontSize(6);
    doc.setTextColor(100, 100, 100);
    const disclaimer = "LEGAL DISCLAIMER: This compliance report is for informational purposes only. It does not constitute legal advice and should not be considered a substitute for consulting with a qualified legal professional.";
    doc.text(disclaimer, 105, 288, { align: 'center', maxWidth: 170 });
  }
};
