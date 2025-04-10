
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
 * Optimized for better performance and error handling
 */
export const applyBrandingToFooter = (
  doc: jsPDF, 
  branding: OrganizationBranding = getOrganizationBranding(),
  verificationMetadata?: any
): void => {
  // Get page count in a more reliable way
  // Using -1 because jsPDF page count is 1-based but internal.pages is 0-based with an initial empty page
  const pageCount = doc.internal.getNumberOfPages();
  
  // Pre-load images before entering the page loop to avoid repeated operations
  // Nexabloom logo data URL (blue shield)
  const nexabloomLogoDataURI = "data:image/png;base64,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";
  
  // Security shield logo for verification
  const securityLogoDataURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAM3SURBVHja1JlLSBVRGMfHMlFJe5hlD6jIoCKiKCgSK3pAD6Iogh5kSVBBUC1atWoRRLVsF61qU7SpoE2UESVkD6xUD6Iopah8ZI/7/w/nwjAz9947M3fuLPzhB+fOnO/7n5k559zvJpKpS8lU7nkVqAfrwCKwEMwFWeAVeAPegCEwDkYc1zcF9UXSDlAAlmvffwdfwDcwBSwGc5Tr8uAzmAGOs5T2gMvgB7gNtoLZyrl5oAnMUsoTs0FUewkOqeW1JmgFH8Fd0AqWKvlDYLcmkxSgDTwGd8AW5fgNoEvJd4mbYKQwDD/AL9ALDoOMMi4DzFPKl4BrISmQB+PwKdtiDnRLCj6CXlAnBc2XgAcgJ/9fBeZoF5csSYN7VkkgLx/5EjlezY8NSqAs4XrFataLfGKyVrlogOtnVsk1TNNyuQmeynzwtZGP+BDQ04X4ruQ7QEdSIvwOIq7SLc8/N/KqTCmf9NUK10pP1Mm70caxm+CHXBNXYs2BWeCEUr4NbJYO41IuWAFFJXdQuQbWA30FGnKUPqTlFJRza+UGcbUCJTndBkGrUt4IKiK2+1SgKKfbsxqtSvmxCO09HaBXKd8uro0vPyXHSPylVG6X0YvKthR/klNgEZP4M0vpankjXckEUa1Or9zrO6RLIv0uh+aJDtKe428CpunvC3mQvzanab3mtXPMvHnqScwyVcgDLJNjlSGAWTpe9ipxlEkvJGrR0AeitEiDTurPlXtlFPLej25q7C24DXaBYcmg9EKiAFZIVFgrOZIXYJPEULWS0fF11YWBb5IXUf51luSedyWeSUmOKu6CSJrEHvcljplXjktO7XJaIYJBS+Q8ufdeS46SlFLRtdl/InlQalwziPk47lKgT4FVGGzBNJ8FmeEvN5JfnGPZLm1Z4CkpMEsyLPp/xHaKZOSPSaRf8CLzCL7qmltqJcFZ5c39SLwCgRefnuvJilXgmawO5c61lTFpxaeA+tnzSXGd2QZ4XFL2us0C7HeS1rJZ4ErttaRL/uS9KwFewDvwwxDbVYuLEsajh8ACY+wI+K6MOwPGTQPeUD63fQNnggQ4KQYDz/zx0kuAgnls1FJeHfi0Zb/ItuKqwlJ4QUZBfQuSlh+1/BNgAGwrv/kNs1l6AAAAAElFTkSuQmCC";
  
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
