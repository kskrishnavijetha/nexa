
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
    
    // Add Nexabloom branding
    doc.setTextColor(79, 70, 229); // Indigo color for branding
    doc.text('Nexabloom', 105, 274, { align: 'center' });
    doc.text('www.nexabloom.xyz', 190, 274, { align: 'right' });
    
    // Try to add logo 
    try {
      doc.addImage("/lovable-uploads/02ec954b-2d1e-4c5c-bfbd-f06f37b0329d.png", "PNG", 20, 270, 5, 5);
    } catch (error) {
      console.error("Failed to add logo to PDF:", error);
    }
    
    // Legal disclaimer
    doc.setFontSize(6);
    doc.setTextColor(100, 100, 100);
    const disclaimer = "LEGAL DISCLAIMER: This compliance report is for informational purposes only. It does not constitute legal advice and should not be considered a substitute for consulting with a qualified legal professional.";
    doc.text(disclaimer, 105, 288, { align: 'center', maxWidth: 170 });
  }
};
