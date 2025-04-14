
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
  const securityLogoDataURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE9klEQVR4nO2Za2xURRTH/7O73e3r9rHbvra0pYJYECzKo4IKYgXxEYkmJCIaP/hFvxgTDSZqoiaaqPGLL4IaH9GIUfQDGo1R0ET5ICiIWpBqtZXS0pa22223j91298w5s6V0H7vdvXdBE85kknvnzpw5/zlnzpyZC0RIkSJFihQJIDEpZzwKadCYOQUcQgwhWPg/5f9PMMpCilAwnEKhgPF483FsDcOx02GGi1AAk0R9mZ9CIWM4drrx4+0YCiZEAYwPzifHEDaTjQUwfDyNU0IDw4UoEE7PeozGua1oTuIDRESiEBPuQ+gr7DXDaeQKYIJD6fzYT+bkGsJFixRcjZ0SLQBdRI5xlJHCEjcWcjIMXTAK0dOSlYi7IMaKuXEikHNUGGdBiYmRg/F8wPTF6t9xbdkxfrzTdRn2JvXj9/YFWNU8F5dO/Y1nqrYzme5YFFIXSUTG9BFMr/6Yp0apz49Xs7djZ5sHry2+hVlr83Rj/9wq/Nm+GIfa5+H+6h9xWelJVjfBhJjAQAoeIvNQ7TwBNQ1L8LZvFfbMWIprK9oYeVe/jRkxNvdusH+j0AtTr33Jf3sH5Ig7RIhGWv01Vs9DygM5SQ6Skm53i4cF+PNKLa4+cQEOdFXgEV8tolIMMzLqMT31NO8a3SkUoruvbCCblfIOSpICWV6OIzYb9vdWQQmTfabeE1iXeZSPt5N1N3RX4ClvHfpiCUxPn8JTDcUw1Ids0iHPzsmsL0jgEDOaKRWiOaB3aZDCmZfW4cMrP8HlE/PQG03HpqwDWDF5Bj47fwq7OpdgwYQL+M5ditbBEjxedRALM1uYDGaoUckoRHoOJrvQYf8kLLoF+LB+GXZX1WHXsi9xcdohZt4Xj2PN4fn4/MJJvLX4XmJoAB8cvx7zXOfQPVSCnCQXCpI9ZH+iRz+R0sgqHjBXpNBwJOnzxZaV72KCLcQFm9J8zyRCJ6NwAT2DMXTpSb1oeyT2ZjrhUDtQP1CKg70VeKr2MAs3Y/wBbmsJ7Hb3Ob+/YS8zf6KrBK2DBUSOIfw5MBUdwwV8OxVVl8XJCZiR04SbCo9iftYFOP2n2V7o70OV0879qv1HkOfqQ9Db4x8TU1KF5OYwmSbEJQzGVDbXE0nGHs+F+PlKObt5KnmcR6upbz7mF9GgswvzXp/6s/eY+D0FaeuRg7iKRPYfeWZiS8tSdEZc2MzI84hHLSFvWQr1R9Rwpb+KRmAreYQ+Kv6mwrPITfLzxaZRztJiRn9fBjbbWzQBaM9b7wOvXnwS3kAebKKKOlIA6QkXuUmPgXVYSKllzAcezv+NfUYqM/aQaNPnhD35PpYpWYkeEoDDxn1GTVOTteXlRBOiXdcnif3Tp76J+sE8nuNLs8+zQ+0OpfOxnx1tcHgwDSG5BD/0TMHnvjLc5G5iXaDlCXMVLBYK9e58tAUXIt8epIVKQEFKCFVZQbbsO4kcJCWhKL2fj+kZVbVaFFAsiDolEQzmonOghBYpN337bulLIJhKxBT2LeUCLF2FeoN2xGIqkr1vwOS9my/AWFofOTNj8RuyZMr3B+34M3AD+6awJZjnNCf4qiYPhzCVDRlqCLlJZ8lWMwIXRd4CITSjjuRBxGN5kOJOpMi07MVZE4w1TGtfAK+uge+cvHqG0/xFgMhMeR/yTI3j15Yov56liO7lZs3FaGHbX89SpEiRIkXC+Bd/aBUKWR4XTQAAAABJRU5ErkJggg==";

  // New shield logo for footer
  const shieldLogoDataURI = "data:image/png;base64,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";
  
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
        doc.addImage(nexabloomLogo, 'PNG', 70, logoPositionY - 5, 6, 6);
      } catch (logoError) {
        console.error("Error adding Nexabloom logo:", logoError);
      }
      
      // Add new shield logo as main verification icon
      try {
        doc.addImage(shieldLogoDataURI, 'PNG', 82, logoPositionY - 5, 6, 6);
      } catch (shieldError) {
        console.error("Error adding shield logo:", shieldError);
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
      doc.text(branding.name, 94, logoPositionY);
      
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

