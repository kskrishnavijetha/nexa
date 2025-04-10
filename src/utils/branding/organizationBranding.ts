
import { jsPDF } from 'jspdf';

export interface OrganizationBranding {
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  contactEmail?: string;
  website?: string;
  legalDisclaimer?: string;
}

// Default branding used when no custom branding is provided
const defaultBranding: OrganizationBranding = {
  name: "Nexabloom",
  primaryColor: "rgb(79, 70, 229)", // Indigo color
  legalDisclaimer: "LEGAL DISCLAIMER: This report is for informational purposes only and does not constitute legal advice."
};

// Storage key for local storage
const BRANDING_STORAGE_KEY = "organization_branding";

/**
 * Save organization branding to local storage
 */
export function saveOrganizationBranding(branding: OrganizationBranding): void {
  localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(branding));
}

/**
 * Get organization branding from local storage
 * Returns default branding if none is found
 */
export function getOrganizationBranding(): OrganizationBranding {
  const savedBranding = localStorage.getItem(BRANDING_STORAGE_KEY);
  if (savedBranding) {
    try {
      return { ...defaultBranding, ...JSON.parse(savedBranding) };
    } catch (error) {
      console.error("Error parsing branding:", error);
    }
  }
  return { ...defaultBranding };
}

/**
 * Apply organization branding to PDF document footer
 */
export const applyBrandingToFooter = (
  doc: jsPDF, 
  branding: OrganizationBranding = getOrganizationBranding(),
  verificationMetadata?: any
): void => {
  // Get page count using internal.pages.length instead of getNumberOfPages()
  const pageCount = doc.internal.pages.length - 1;
  
  // Security shield logo for verification - updated with the new blue shield logo
  const securityLogoDataURI = "data:image/png;base64,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";
  
  // Nexabloom logo
  const nexabloomLogo = "data:image/png;base64,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";
  
  try {
    // Add footer to each page
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Page number footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, 20, 280);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 190, 280, { align: 'right' });
      
      // Draw a light separator line above the footer
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.line(20, 268, 190, 268);
      
      // Add branding logo and name with proper spacing
      const logoPositionY = 274;
      
      // Add Nexabloom logo
      try {
        doc.addImage(nexabloomLogo, 'PNG', 75, logoPositionY - 5, 6, 6);
      } catch (logoError) {
        console.error("Error adding Nexabloom logo:", logoError);
      }
      
      // Add security shield logo if verification metadata exists
      if (verificationMetadata) {
        try {
          doc.addImage(securityLogoDataURI, 'PNG', 88, logoPositionY - 4, 4, 4);
        } catch (shieldError) {
          console.error("Error adding security shield logo:", shieldError);
        }
      }
      
      // Add organization name with custom color if provided
      if (branding.primaryColor) {
        const color = hexToRgb(branding.primaryColor);
        if (color) {
          doc.setTextColor(color.r, color.g, color.b);
        }
      } else {
        // Default color for organization name
        doc.setTextColor(79, 70, 229);
      }
      
      // Add organization name
      doc.setFontSize(10);
      doc.text(branding.name, 98, logoPositionY);
      
      // Remove website display - we don't show the website URL anymore
      
      // Add hash verification information if available
      if (verificationMetadata && verificationMetadata.hash) {
        doc.setFontSize(7);
        doc.setTextColor(90, 90, 90);
        doc.text(`Integrity Verified: SHA-256 [${verificationMetadata.shortHash}]`, 180, 274, { align: 'right' });
      }
      
      // Legal disclaimer - use custom if provided
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      const disclaimer = branding.legalDisclaimer || defaultBranding.legalDisclaimer;
      doc.text(disclaimer, 105, 288, { align: 'center', maxWidth: 170 });
    }
  } catch (error) {
    console.error("Error adding branded footer to PDF:", error);
    
    // Fallback to text-only footer if error occurs
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, 20, 280);
      doc.text(branding.name, 105, 280, { align: 'center' });
      
      // Remove website URL from fallback as well
      
      // Add simple disclaimer
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      doc.text(branding.legalDisclaimer || defaultBranding.legalDisclaimer, 105, 288, { align: 'center', maxWidth: 170 });
    }
  }
};

/**
 * Convert hex color to RGB object
 */
function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
