
import { jsPDF } from 'jspdf';
import { getOrganizationBranding, applyBrandingToFooter } from '@/utils/branding/organizationBranding';
import { generateVerificationMetadata } from '@/utils/audit/hashVerification';

/**
 * Add footer with page numbers and organization branding to the PDF document
 */
export const addFooter = async (doc: jsPDF, data?: any[]): Promise<void> => {
  // Get organization branding (will use defaults if none set)
  const branding = getOrganizationBranding();
  
  // Generate verification metadata if we have data to hash
  let verificationMetadata;
  if (data && data.length > 0) {
    try {
      verificationMetadata = await generateVerificationMetadata(data);
    } catch (error) {
      console.error('Error generating verification metadata for footer:', error);
    }
  }
  
  // Apply the branding to the footer with verification metadata if available
  applyBrandingToFooter(doc, branding, verificationMetadata);
};
