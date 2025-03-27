
import { jsPDF } from "jspdf";

/**
 * Add footer with page numbers to the PDF document
 */
export const addFooter = (doc: jsPDF): void => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, 100, 290, { align: 'center' });
    doc.text(`AI-Enhanced Compliance Report - CONFIDENTIAL`, 100, 284, { align: 'center' });
  }
};
