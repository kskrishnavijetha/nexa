
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
  website: "www.nexabloom.xyz", // Added default website
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
  const pageCount = doc.internal.pages.length - 1;
  
  // Nexabloom logo data URL (blue shield)
  const nexabloomLogoDataURI = "data:image/png;base64,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";
  
  // Security shield logo for verification
  const securityLogoDataURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAM3SURBVHja1JlLSBVRGMfHMlFJe5hlD6jIoCKiKCgSK3pAD6Iogh5kSVBBUC1atWoRRLVsF61qU7SpoE2UESVkD6xUD6Iopah8ZI/7/w/nwjAz9947M3fuLPzhB+fOnO/7n5k559zvJpKpS8lU7nkVqAfrwCKwEMwFWeAVeAPegCEwDkYc1zcF9UXSDlAAlmvffwdfwDcwBSwGc5Tr8uAzmAGOs5T2gMvgB7gNtoLZyrl5oAnMUsoTs0FUewkOqeW1JmgFH8Fd0AqWKvlDYLcmkxSgDTwGd8AW5fgNoEvJd4mbYKQwDD/AL9ALDoOMMi4DzFPKl4BrISmQB+PwKdtiDnRLCj6CXlAnBc2XgAcgJ/9fBeZoF5csSYN7VkkgLx/5EjlezY8NSqAs4XrFataLfGKyVrlogOtnVsk1TNNyuQmeynzwtZGP+BDQ04X4ruQ7QEdSIvwOIq7SLc8/N/KqTCmf9NUK10pP1Mm70caxm+CHXBNXYs2BWeCEUr4NbJYO41IuWAFFJXdQuQbWA30FGnKUPqTlFJRza+UGcbUCJTndBkGrUt4IKiK2+1SgKKfbsxqtSvmxCO09HaBXKd8uro0vPyXHSPylVG6X0YvKthR/klNgEZP4M0vparkjXckEUa1Or9zrO6RLIv0uh+aJDtKe428CpunvC3mQvzanab3mtXPMvHnqScwyVcgDLJNjlSGAWTpe9ipxlEkvJGrR0AeitEiDTurPlXtlFPLej25q7C24DXaBYcmg9EKiAFZIVFgrOZIXYJPEULWS0fF11YWBb5IXUf51luSedyWeSUmOKu6CSJrEHvcljplXjktO7XJaIYJBS+Q8ufdeS46SlFLRtdl/InlQalwziPk47lKgT4FVGGzBNJ8FmeEvN5JfnGPZLm1Z4CkpMEsyLPp/xHaKZOSPSaRf8CLzCL7qmltqJcFZ5c39SLwCgRefnuvJilXgmawO5c61lTFpxaeA+tnzSXGd2QZ4XFL2us0C7HeS1rJZ4ErttaRL/uS9KwFewDvwwxDbVYuLEsajh8ACY+wI+K6MOwPGTQPeUD63fQNnggQ4KQYDz/zx0kuAgnls1FJeHfi0Zb/ItuKqwlJ4QUZBfQuSlh+1/BNgAGwrv/kNs1l6AAAAAElFTkSuQmCC";
  
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
        // Add the Nexabloom logo (first, next to the name)
        doc.addImage(nexabloomLogoDataURI, 'PNG', 82, logoPositionY - 4, 5, 5); 
      } catch (logoError) {
        console.error("Error adding Nexabloom logo:", logoError);
      }
      
      // Add security shield logo if verification metadata exists
      if (verificationMetadata) {
        try {
          doc.addImage(securityLogoDataURI, 'PNG', 75, logoPositionY - 4, 4, 4);
        } catch (secLogoError) {
          console.error("Error adding security logo:", secLogoError);
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
      
      // Add organization name - moved slightly to the right to accommodate logo
      doc.text(branding.name, 90, logoPositionY);
      
      // Add website - ensure we always show www.nexabloom.xyz
      const websiteText = branding.website || "www.nexabloom.xyz";
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.text(websiteText, 160, logoPositionY, { align: 'right' });
      
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
      
      // Ensure website is always displayed in fallback mode too
      const websiteText = branding.website || "www.nexabloom.xyz";
      doc.text(websiteText, 190, 280, { align: 'right' });
      
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
