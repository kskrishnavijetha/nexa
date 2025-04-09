
import { jsPDF } from "jspdf";
import { getOrganizationBranding, applyBrandingToFooter } from '@/utils/branding/organizationBranding';

/**
 * Add footer with page numbers and organization branding to the PDF document
 * Now supports customizable branding and includes integrity verification metadata
 */
export const addFooter = (doc: jsPDF, verificationMetadata?: any): void => {
  // Get organization branding (will use defaults if none set)
  const branding = getOrganizationBranding();
  
  // Apply the branding to the footer
  applyBrandingToFooter(doc, branding, verificationMetadata);
};
