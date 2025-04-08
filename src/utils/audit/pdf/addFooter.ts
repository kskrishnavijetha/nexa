
import { jsPDF } from "jspdf";

/**
 * Add footer with page numbers to the PDF document
 */
export const addFooter = (doc: jsPDF): void => {
  const pageCount = doc.getNumberOfPages();
  
  // Add footer to each page with adjusted positioning
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Set smaller font size for more space
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    
    // Adjusted y-position to ensure visibility (moved up slightly)
    const footerPosition = 285; // Moved up from 290
    const confidentialPosition = 280; // Moved up from 284
    const disclaimerPosition = 274; // New position for disclaimer
    
    // Add page numbers with more space
    doc.text(`Page ${i} of ${pageCount}`, 100, footerPosition, { align: 'center' });
    
    // Add confidentiality notice with more space
    doc.text(`AI-Enhanced Compliance Report - CONFIDENTIAL`, 100, confidentialPosition, { align: 'center' });
    
    // Add legal disclaimer
    doc.setFontSize(6);
    doc.setTextColor(90, 90, 90);
    const disclaimer = "LEGAL DISCLAIMER: This report is for informational purposes only and does not constitute legal advice.";
    doc.text(disclaimer, 100, disclaimerPosition, { align: 'center' });
    
    // Draw a light separator line above the footer
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.line(20, disclaimerPosition - 5, 190, disclaimerPosition - 5);
  }
};
