
import { jsPDF } from "jspdf";
import { getOrganizationBranding, applyBrandingToFooter } from '@/utils/branding/organizationBranding';

/**
 * Add footer with page numbers and organization branding to the PDF document
 * Now supports customizable branding and includes integrity verification metadata
 */
export const addFooter = (doc: jsPDF, verificationMetadata?: any): void => {
  // Get organization branding (will use defaults if none set)
  const branding = getOrganizationBranding();
  
  // Add audit verification information if provided
  if (verificationMetadata) {
    // Get total pages for positioning
    const pageCount = doc.internal.pages.length - 1;
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Add verification hash info in small gray text
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      const verificationText = `Verification Hash: ${verificationMetadata.shortHash} | Generated: ${new Date(verificationMetadata.timestamp).toLocaleString()} | Method: ${verificationMetadata.verificationMethod}`;
      doc.text(verificationText, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 7, {
        align: 'center'
      });
      
      // Add tamper-evident notice text
      const tamperText = "This report uses cryptographic verification to detect tampering and ensure data integrity.";
      doc.text(tamperText, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 4, {
        align: 'center'
      });
    }
  }
  
  // Apply the branding to the footer
  applyBrandingToFooter(doc, branding, verificationMetadata);
};
