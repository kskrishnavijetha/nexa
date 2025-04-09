
import { jsPDF } from "jspdf";

/**
 * Add footer with page numbers and Nexabloom branding to the PDF document
 * Includes integrity verification metadata and legal disclaimer
 */
export const addFooter = (doc: jsPDF, verificationMetadata?: any): void => {
  const pageCount = doc.getNumberOfPages();
  
  // Load Nexabloom logo image (using a data URI for simplicity)
  const logoDataURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADF0lEQVR4nO2Zz08TQRTHNzM0MQH1oAcTLv4FJF48GE/+vBgSE07+OJh49AYJiYke9KAkRtw3I2o88WdjNDQmYsCEB7szbQmiIlZRarH9ku7CUmah3e4uZXm7J5LuzH7m+/3OvPd2Q0j5KU/qlB4cPErp4CjjNMk4zXHO081O872M06LJaCnVTE61bu56SjmNMUaLjNNuo9FysQZfQ6sa1BzrNTnNkqOukJckzTzkjJZONdqHKsU3GS2bsVWdJkddareKT3zwUZIOlRucY2Wn2SanBXLcFXbLQP7BUTfzl9OSBL9vMrrZlXx44JPX7tD5a4ZInF8zxMzcknvw4pVE0m5jgg8+4IPPGedjF675+GDnN/Slnl65yxkt9pUI+AR6+eZz5xKJ8cb7L14l+OBrtObKlfl87xKM045PJTj41KyQiMUMkYzHxcjoZxmRGzIiJf+XM7rjC4C2gWV8NtXfG3O1e68QwnHJ0fDTgnTrnJZdAawn0NvAcxmRHJub/yUdryK1KxEVYD2BnoW85JNPrcpUrqSjnEZFuxN2BKCx4VmR7O8V0/MLUkI5pzElMToC0FC8R44NzTHOb0oASBRdVwB6NDLj1QE5YzNSQrHTwoipC9BTcgY4zXUFwNl8KRzseOzQgegISEl82zUA1+a2cwY4HYwEQOdxxd+9AgCs//c5YjFDJBJxr30QEYDhyVlvi/x7usKwXCQAIAcnZ1U1WogEABB4B6Yqt1RJO7gLxRdIxGOitzcmxqbmlLQsHQdA6OVrJ1QBwJ9aAXDxBQDpCnDlekypVaZMSsepVgAi/VAHQILTe2UAoFoBiA5wBoAEwneKAADVCkCE5HPdAPKc31YCAC0CUD0ATQ80zmvkQEMrXAVgvVSqaXJAlNd4H3BWBGCc0/NIAJSQ0MTcF5GIx8XA0HQkAHI5nL3UWBd3oWICVenHePLMA9UWagUgt8n24emzDxW6kO0JQE5Vi1e6kMfxjCxkrJxP4HMbqfSUFxt8eDQuEqelVLtssc/Da0rfAvmxq6nsv4pVJ59mBXmZ8TWyB54Y/zc7TwKN7MY/92PsUSJJ0lZbDk95ylOeRjv/AKp9lEGAOsJnAAAAAElFTkSuQmCC";
  
  // Security shield logo for integrity indicator
  const shieldLogoURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAM3SURBVHja1JlLSBVRGMfHMlFJe5hlD6jIoCKiKCgSK3pAD6Iogh5kSVBBUC1atWoRRLVsF61qU7SpoE2UESVkD6xUD6Iopah8ZI/7/w/nwjAz9947M3fuLPzhB+fOnO/7n5k559zvJpKpS8lU7nkVqAerwBKwEMwFWeAVeAPegCEwDkYc1zcF9UXSDlAAlmvffwdfwDcwBSwGc5Tr8uAzmAGOs5T2gMvgB7gNtoLZyrl5oAnMUsoTs0FUewkOqeW1JmgFH8Fd0AqWKvlDYLcmkxSgDTwGd8AW5fgNoEvJd4mbYKQwDD/AL9ALDoOMMi4DzFPKl4BrISmQB+PwKdtiDnRLCj6CXlAnBc2XgAcgJ/9fBeZoF5csSYN7VkkgLx/5EjlezY8NSqAs4XrFataLfGKyVrlogOtnVsk1TNNyuQmeynzwtZGP+BDQ04X4ruQ7QEdSIvwOIq7SLc8/N/KqTCmf9NUK10pP1Mm70caxm+CHXBNXYs2BWeCEUr4NbJYO41IuWAFFJXdQuQbWA30FGnKUPqTlFJRza+UGcbUCJTndBkGrUt4IKiK2+1SgKKfbsxqtSvmxCO09HaBXKd8uro0vPyXHSPylVG6X0YvKthR/klNgEZP4M0vparkjXckEUa1Or9zrO6RLIv0uh+aJDtKe428CpunvC3mQvzanab3mtXPMvHnqScwyVcgDLJNjlSGAWTpe9ipxlEkvJGrR0AeitEiDTurPlXtlFPLej25q7C24DXaBYcmg9EKiAFZIVFgrOZIXYJPEULWS0fF11YWBb5IXUf51luSedyWeSUmOKu6CSJrEHvcljplXjktO7XJaIYJBS+Q8ufdeS46SlFLRtdl/InlQalwziPk47lKgT4FVGGzBNJ8FmeEvN5JfnGPZLm1Z4CkpMEsyLPp/xHaKZOSPSaRf8CLzCL7qmltqJcFZ5c39SLwCgRefnuvJilXgmawO5c61lTFpxaeA+tnzSXGd2QZ4XFL2us0C7HeS1rJZ4ErttaRL/uS9KwFewDvwwxDbVYuLEsajh8ACY+wI+K6MOwPGTQPeUD63fQNnggQ4KQYDz/zx0kuAgnls1FJeHfi0Zb/ItuKqwlJ4QUZBfQuSlh+1/BNgAGwrv/kNs1l6AAAAAElFTkSuQmCC";
  
  try {
    // Add footer to each page
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Add a horizontal line at the top of the footer
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(20, 265, 190, 265);
      
      // Add integrity verification text if available (in green color)
      if (verificationMetadata && verificationMetadata.hash) {
        doc.setFontSize(8);
        doc.setTextColor(0, 128, 0); // Green color for integrity verification
        doc.text(`Integrity Verified: ${verificationMetadata.shortHash}`, 190, 272, { align: 'right' });
      }
      
      // Add legal disclaimer centered
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const disclaimer = "LEGAL DISCLAIMER: This report is for informational purposes only and does not constitute legal advice. Integrity protected by SHA-256 verification.";
      doc.text(disclaimer, 105, 280, { align: 'center' });
      
      // Add Nexabloom branding (centered)
      doc.setTextColor(79, 70, 229); // Indigo color for branding
      doc.text('Nexabloom', 105, 276, { align: 'center' });
      
      // Add Nexabloom URL (right aligned)
      doc.text('nexabloom.xyz', 190, 276, { align: 'right' });
      
      // Add shield logo on the left
      doc.addImage(shieldLogoURI, 'PNG', 20, 272, 6, 6);
      
      // Add page number
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, 30, 276);
    }
  } catch (error) {
    console.error("Error adding footer to PDF:", error);
    
    // Fallback to simpler text-only footer if image loading fails
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(20, 265, 190, 265);
      
      // Add verification info if available
      if (verificationMetadata && verificationMetadata.hash) {
        doc.setFontSize(8);
        doc.setTextColor(0, 128, 0);
        doc.text(`Integrity Verified: ${verificationMetadata.shortHash}`, 190, 272, { align: 'right' });
      }
      
      // Add legal disclaimer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const disclaimer = "LEGAL DISCLAIMER: This report is for informational purposes only and does not constitute legal advice. Integrity protected by SHA-256 verification.";
      doc.text(disclaimer, 105, 280, { align: 'center' });
      
      // Add Nexabloom branding
      doc.setTextColor(79, 70, 229);
      doc.text('Nexabloom', 105, 276, { align: 'center' });
      doc.text('nexabloom.xyz', 190, 276, { align: 'right' });
      
      // Add page number text
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, 30, 276);
    }
  }
};
