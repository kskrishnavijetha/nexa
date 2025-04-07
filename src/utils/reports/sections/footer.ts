
import { jsPDF } from 'jspdf';

/**
 * Add footer with page numbers to the PDF document
 */
export const addFooter = (doc: jsPDF): void => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 190, 290, { align: 'right' });
  }
};
