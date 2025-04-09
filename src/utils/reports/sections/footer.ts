
import { jsPDF } from 'jspdf';
import { getOrganizationBranding, applyBrandingToFooter } from '@/utils/branding/organizationBranding';

/**
 * Add footer with page numbers and organization branding to the PDF document
 */
export const addFooter = (doc: jsPDF): void => {
  // Get organization branding (will use defaults if none set)
  const branding = getOrganizationBranding();
  
  // Apply the branding to the footer without verification metadata
  applyBrandingToFooter(doc, branding);
};
