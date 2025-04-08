
import { jsPDF } from "jspdf";

/**
 * Add footer with page numbers, integrity verification, and Nexabloom branding to the PDF document
 */
export const addFooter = (doc: jsPDF, integrityHash?: string): void => {
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
    const integrityPosition = 268;
    
    // Add page numbers with more space
    doc.text(`Page ${i} of ${pageCount}`, 20, footerPosition);
    
    // Add Nexabloom branding and website
    doc.setTextColor(79, 70, 229); // Indigo color for branding
    doc.text('Nexabloom', 100, brandingPosition, { align: 'center' });
    doc.text('nexabloom.xyz', 180, brandingPosition, { align: 'right' });
    
    // Add integrity verification notice if hash is provided
    if (integrityHash) {
      doc.setFontSize(7);
      doc.setTextColor(0, 128, 0); // Green for integrity verification
      doc.text(`Integrity Verified: ${integrityHash.substring(0, 16)}...`, 100, integrityPosition, { align: 'center' });
    }
    
    // Add legal disclaimer
    doc.setFontSize(6);
    doc.setTextColor(90, 90, 90);
    const disclaimer = "LEGAL DISCLAIMER: This report is for informational purposes only and does not constitute legal advice. Integrity protected by SHA-256 verification.";
    doc.text(disclaimer, 100, disclaimerPosition, { align: 'center' });
    
    // Draw a light separator line above the footer
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.line(20, disclaimerPosition - 5, 190, disclaimerPosition - 5);
    
    // Add Nexabloom logo (as small icon)
    try {
      doc.addImage("/lovable-uploads/02ec954b-2d1e-4c5c-bfbd-f06f37b0329d.png", "PNG", 20, brandingPosition - 4, 5, 5);
    } catch (error) {
      console.error("Failed to add logo to PDF:", error);
    }
  }
};
