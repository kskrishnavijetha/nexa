
import { jsPDF } from "jspdf";

/**
 * Add footer with page numbers and Nexabloom branding to the PDF document
 */
export const addFooter = (doc: jsPDF): void => {
  const pageCount = doc.getNumberOfPages();
  
  // Add footer to each page with adjusted positioning
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Set smaller font size for more space
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    
    // Adjusted y-position to ensure visibility
    const footerPosition = 285;
    const brandingPosition = 280;
    const disclaimerPosition = 274;
    
    // Add page numbers with more space
    doc.text(`Page ${i} of ${pageCount}`, 20, footerPosition);
    
    // Add Nexabloom branding with logo and website
    doc.setTextColor(79, 70, 229); // Indigo color for branding
    
    // Add small logo (N emoji as a placeholder)
    doc.setFontSize(10);
    doc.text('N', 95, brandingPosition);
    
    // Add brand name next to logo
    doc.setFontSize(8);
    doc.text('Nexabloom', 100, brandingPosition, { align: 'center' });
    doc.text('nexabloom.xyz', 180, brandingPosition, { align: 'right' });
    
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
