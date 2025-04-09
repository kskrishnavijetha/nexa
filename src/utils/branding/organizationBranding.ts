
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
  const pageCount = doc.getNumberOfPages();
  
  // Security shield logo for verification (blue shield)
  const shieldLogoDataURI = "data:image/png;base64,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";
  
  try {
    // Add footer to each page
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Draw a light separator line across the page
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(20, 268, 190, 268);
      
      // Add page number at bottom left
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, 47, 280);
      
      // Add organization logo and shield icon
      if (verificationMetadata && verificationMetadata.hash) {
        // Add integrity verification text at top of footer
        doc.setFontSize(8);
        doc.setTextColor(0, 128, 0); // Green color for verified text
        doc.text(`Integrity Verified: ${verificationMetadata.shortHash}`, 105, 275, { align: 'center' });
      }
      
      // Add shield logo at the left
      doc.addImage(shieldLogoDataURI, 'PNG', 25, 275, 12, 12);
      
      // Add organization name in center with custom color
      if (branding.primaryColor) {
        const color = hexToRgb(branding.primaryColor);
        if (color) {
          doc.setTextColor(color.r, color.g, color.b);
        }
      } else {
        // Default indigo color
        doc.setTextColor(79, 70, 229);
      }
      doc.setFontSize(11);
      doc.text(branding.name, 105, 280, { align: 'center' });
      
      // Add website if provided on right
      if (branding.website) {
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 238); // Link blue color
        doc.text(branding.website, 190, 280, { align: 'right' });
      }
      
      // Add legal disclaimer centered at bottom
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const disclaimer = branding.legalDisclaimer || defaultBranding.legalDisclaimer;
      doc.text(`${disclaimer}${verificationMetadata?.hash ? " Integrity protected by SHA-256 verification." : ""}`, 105, 290, { align: 'center' });
    }
  } catch (error) {
    console.error("Error adding branded footer to PDF:", error);
    
    // Fallback to simple text-only footer if error occurs
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, 20, 280);
      doc.text(branding.name, 105, 280, { align: 'center' });
      
      if (branding.website) {
        doc.text(branding.website, 190, 280, { align: 'right' });
      }
      
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
