
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
  
  // Security shield logo for verification
  const securityLogoDataURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAM3SURBVHja1JlLSBVRGMfHMlFJe5hlD6jIoCKiKCgSK3pAD6Iogh5kSVBBUC1atWoRRLVsF61qU7SpoE2UESVkD6xUD6Iopah8ZI/7/w/nwjAz9947M3fuLPzhB+fOnO/7n5k559zvJpKpS8lU7nkVqAerwBKwEMwFWeAVeAPegCEwDkYc1zcF9UXSDlAAlmvffwdfwDcwBSwGc5Tr8uAzmAGOs5T2gMvgB7gNtoLZyrl5oAnMUsoTs0FUewkOqeW1JmgFH8Fd0AqWKvlDYLcmkxSgDTwGd8AW5fgNoEvJd4mbYKQwDD/AL9ALDoOMMi4DzFPKl4BrISmQB+PwKdtiDnRLCj6CXlAnBc2XgAcgJ/9fBeZoF5csSYN7VkkgLx/5EjlezY8NSqAs4XrFataLfGKyVrlogOtnVsk1TNNyuQmeynzwtZGP+BDQ04X4ruQ7QEdSIvwOIq7SLc8/N/KqTCmf9NUK10pP1Mm70caxm+CHXBNXYs2BWeCEUr4NbJYO41IuWAFFJXdQuQbWA30FGnKUPqTlFJRza+UGcbUCJTndBkGrUt4IKiK2+1SgKKfbsxqtSvmxCO09HaBXKd8uro0vPyXHSPylVG6X0YvKthR/klNgEZP4M0vparkjXckEUa1Or9zrO6RLIv0uh+aJDtKe428CpunvC3mQvzanab3mtXPMvHnqScwyVcgDLJNjlSGAWTpe9ipxlEkvJGrR0AeitEiDTurPlXtlFPLej25q7C24DXaBYcmg9EKiAFZIVFgrOZIXYJPEULWS0fF11YWBb5IXUf51luSedyWeSUmOKu6CSJrEHvcljplXjktO7XJaIYJBS+Q8ufdeS46SlFLRtdl/InlQalwziPk47lKgT4FVGGzBNJ8FmeEvN5JfnGPZLm1Z4CkpMEsyLPp/xHaKZOSPSaRf8CLzCL7qmltqJcFZ5c39SLwCgRefnuvJilXgmawO5c61lTFpxaeA+tnzSXGd2QZ4XFL2us0C7HeS1rJZ4ErttaRL/uS9KwFewDvwwxDbVYuLEsajh8ACY+wI+K6MOwPGTQPeUD63fQNnggQ4KQYDz/zx0kuAgnls1FJeHfi0Zb/ItuKqwlJ4QUZBfQuSlh+1/BNgAGwrv/kNs1l6AAAAAElFTkSuQmCC";
  
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
      
      // Add security shield logo if verification metadata exists
      if (verificationMetadata) {
        doc.addImage(securityLogoDataURI, 'PNG', 88, logoPositionY - 4, 4, 4);
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
      doc.text(branding.name, 98, logoPositionY);
      
      // Add website if provided
      if (branding.website) {
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text(branding.website, 160, logoPositionY, { align: 'right' });
      }
      
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
