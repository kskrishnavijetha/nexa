
import { jsPDF } from "jspdf";
import { getOrganizationBranding, applyBrandingToFooter } from '@/utils/branding/organizationBranding';

/**
 * Add footer with page numbers and organization branding to the PDF document
 * Now supports customizable branding and includes integrity verification metadata
 * Optimized for better performance
 */
export const addFooter = (doc: jsPDF, verificationMetadata?: any): void => {
  // Get organization branding (will use defaults if none set)
  const branding = getOrganizationBranding();
  
  try {
    // Apply the branding to the footer with verification metadata if available
    applyBrandingToFooter(doc, branding, verificationMetadata);
  } catch (error) {
    console.error('Error applying branding to footer:', error);
    
    // Fallback to simpler footer if branding footer fails
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount} | Nexabloom | www.nexabloom.xyz`, 105, 285, { align: 'center' });
    }
  }
};
