
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
  
  // Security shield logo for verification
  const securityLogoDataURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAM3SURBVHja1JlLSBVRGMfHMlFJe5hlD6jIoCKiKCgSK3pAD6Iogh5kSVBBUC1atWoRRLVsF61qU7SpoE2UESVkD6xUD6Iopah8ZI/7/w/nwjAz9947M3fuLPzhB+fOnO/7n5k559zvJpKpS8lU7nkVqAerwBKwEMwFWeAVeAPegCEwDkYc1zcF9UXSDlAAlmvffwdfwDcwBSwGc5Tr8uAzmAGOs5T2gMvgB7gNtoLZyrl5oAnMUsoTs0FUewkOqeW1JmgFH8Fd0AqWKvlDYLcmkxSgDTwGd8AW5fgNoEvJd4mbYKQwDD/AL9ALDoOMMi4DzFPKl4BrISmQB+PwKdtiDnRLCj6CXlAnBc2XgAcgJ/9fBeZoF5csSYN7VkkgLx/5EjlezY8NSqAs4XrFataLfGKyVrlogOtnVsk1TNNyuQmeynzwtZGP+BDQ04X4ruQ7QEdSIvwOIq7SLc8/N/KqTCmf9NUK10pP1Mm70caxm+CHXBNXYs2BWeCEUr4NbJYO41IuWAFFJXdQuQbWA30FGnKUPqTlFJRza+UGcbUCJTndBkGrUt4IKiK2+1SgKKfbsxqtSvmxCO09HaBXKd8uro0vPyXHSPylVG6X0YvKthR/klNgEZP4M0vparkjXckEUa1Or9zrO6RLIv0uh+aJDtKe428CpunvC3mQvzanab3mtXPMvHnqScwyVcgDLJNjlSGAWTpe9ipxlEkvJGrR0AeitEiDTurPlXtlFPLej25q7C24DXaBYcmg9EKiAFZIVFgrOZIXYJPEULWS0fF11YWBb5IXUf51luSedyWeSUmOKu6CSJrEHvcljplXjktO7XJaIYJBS+Q8ufdeS46SlFLRtdl/InlQalwziPk47lKgT4FVGGzBNJ8FmeEvN5JfnGPZLm1Z4CkpMEsyLPp/xHaKZOSPSaRf8CLzCL7qmltqJcFZ5c39SLwCgRefnuvJilXgmawO5c61lTFpxaeA+tnzSXGd2QZ4XFL2us0C7HeS1rJZ4ErttaRL/uS9KwFewDvwwxDbVYuLEsajh8ACY+wI+K6MOwPGTQPeUD63fQNnggQ4KQYDz/zx0kuAgnls1FJeHfi0Zb/ItuKqwlJ4QUZBfQuSlh+1/BNgAGwrv/kNs1l6AAAAAElFTkSuQmCC";
  
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

