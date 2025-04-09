
import { jsPDF } from "jspdf";

/**
 * Add footer with page numbers and Nexabloom branding to the PDF document
 */
export const addFooter = (doc: jsPDF): void => {
  const pageCount = doc.getNumberOfPages();
  
  // Load Nexabloom logo image (using a data URI for simplicity)
  const logoSize = 5; // Height in mm
  const logoDataURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADF0lEQVR4nO2Zz08TQRTHNzM0MQH1oAcTLv4FJF48GE/+vBgSE07+OJh49AYJiYke9KAkRtw3I2o88WdjNDQmYsCEB7szbQmiIlZRarH9ku7CUmah3e4uZXm7J5LuzH7m+/3OvPd2Q0j5KU/qlB4cPErp4CjjNMk4zXHO081O872M06LJaCnVTE61bu56SjmNMUaLjNNuo9FysQZfQ6sa1BzrNTnNkqOukJckzTzkjJZONdqHKsU3GS2bsVWdJkddareKT3zwUZIOlRucY2Wn2SanBXLcFXbLQP7BUTfzl9OSBL9vMrrZlXx44JPX7tD5a4ZInF8zxMzcknvw4pVE0m5jgg8+4IPPGedjF675+GDnN/Slnl65yxkt9pUI+AR6+eZz5xKJ8cb7L14l+OBrtObKlfl87xKM045PJTj41KyQiMUMkYzHxcjoZxmRGzIiJf+XM7rjC4C2gWV8NtXfG3O1e68QwnHJ0fDTgnTrnJZdAawn0NvAcxmRHJub/yUdryK1KxEVYD2BnoW85JNPrcpUrqSjnEZFuxN2BKCx4VmR7O8V0/MLUkI5pzElMToC0FC8R44NzTHOb0oASBRdVwB6NDLj1QE5YzNSQrHTwoipC9BTcgY4zXUFwNl8KRzseOzQgegISEl82zUA1+a2cwY4HYwEQOdxxd+9AgCs//c5YjFDJBJxr30QEYDhyVlvi/x7usKwXCQAIAcnZ1U1WogEABB4B6Yqt1RJO7gLxRdIxGOitzcmxqbmlLQsHQdA6OVrJ1QBwJ9aAXDxBQDpCnDlekypVaZMSsepVgAi/VAHQILTe2UAoFoBiA5wBoAEwneKAADVCkCE5HPdAPKc31YCAC0CUD0ATQ80zmvkQEMrXAVgvVSqaXJAlNd4H3BWBGCc0/NIAJSQ0MTcF5GIx8XA0HQkAHI5nL3UWBd3oWICVenHePLMA9UWagUgt8n24emzDxW6kO0JQE5Vi1e6kMfxjCxkrJxP4HMbqfSUFxt8eDQuEqelVLtssc/Da0rfAvmxq6nsv4pVJ59mBXmZ8TWyB54Y/zc7TwKN7MY/92PsUSJJ0lZbDk95ylOeRjv/AKp9lEGAOsJnAAAAAElFTkSuQmCC";
  
  // New security shield logo
  const securityLogoDataURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAM3SURBVHja1JlLSBVRGMfHMlFJe5hlD6jIoCKiKCgSK3pAD6Iogh5kSVBBUC1atWoRRLVsF61qU7SpoE2UESVkD6xUD6Iopah8ZI/7/w/nwjAz9947M3fuLPzhB+fOnO/7n5k559zvJpKpS8lU7nkVqAerwBKwEMwFWeAVeAPegCEwDkYc1zcF9UXSDlAAlmvffwdfwDcwBSwGc5Tr8uAzmAGOs5T2gMvgB7gNtoLZyrl5oAnMUsoTs0FUewkOqeW1JmgFH8Fd0AqWKvlDYLcmkxSgDTwGd8AW5fgNoEvJd4mbYKQwDD/AL9ALDoOMMi4DzFPKl4BrISmQB+PwKdtiDnRLCj6CXlAnBc2XgAcgJ/9fBeZoF5csSYN7VkkgLx/5EjlezY8NSqAs4XrFataLfGKyVrlogOtnVsk1TNNyuQmeynzwtZGP+BDQ04X4ruQ7QEdSIvwOIq7SLc8/N/KqTCmf9NUK10pP1Mm70caxm+CHXBNXYs2BWeCEUr4NbJYO41IuWAFFJXdQuQbWA30FGnKUPqTlFJRza+UGcbUCJTndBkGrUt4IKiK2+1SgKKfbsxqtSvmxCO09HaBXKd8uro0vPyXHSPylVG6X0YvKthR/klNgEZP4M0vparkjXckEUa1Or9zrO6RLIv0uh+aJDtKe428CpunvC3mQvzanab3mtXPMvHnqScwyVcgDLJNjlSGAWTpe9ipxlEkvJGrR0AeitEiDTurPlXtlFPLej25q7C24DXaBYcmg9EKiAFZIVFgrOZIXYJPEULWS0fF11YWBb5IXUf51luSedyWeSUmOKu6CSJrEHvcljplXjktO7XJaIYJBS+Q8ufdeS46SlFLRtdl/InlQalwziPk47lKgT4FVGGzBNJ8FmeEvN5JfnGPZLm1Z4CkpMEsyLPp/xHaKZOSPSaRf8CLzCL7qmltqJcFZ5c39SLwCgRefnuvJilXgmawO5c61lTFpxaeA+tnzSXGd2QZ4XFL2us0C7HeS1rJZ4ErttaRL/uS9KwFewDvwwxDbVYuLEsajh8ACY+wI+K6MOwPGTQPeUD63fQNnggQ4KQYDz/zx0kuAgnls1FJeHfi0Zb/ItuKqwlJ4QUZBfQuSlh+1/BNgAGwrv/kNs1l6AAAAAElFTkSuQmCC";
  
  try {
    // Add footer to each page with adjusted positioning
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Page number footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, 20, 280);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 190, 280, { align: 'right' });
      
      // Add security shield logo and Nexabloom branding with proper spacing
      const logoPositionY = 278;
      
      // Add security shield logo
      doc.addImage(securityLogoDataURI, 'PNG', 88, logoPositionY - 4, 4, 4);
      
      // Add Nexabloom logo with slight spacing
      doc.addImage(logoDataURI, 'PNG', 93, logoPositionY - 4, 4, 4);
      
      // Add Nexabloom text
      doc.setTextColor(79, 70, 229); // Indigo color for branding
      doc.text('Nexabloom', 98, logoPositionY);
      
      // Legal disclaimer
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      const disclaimer = "LEGAL DISCLAIMER: This report is for informational purposes only and does not constitute legal advice.";
      doc.text(disclaimer, 100, 274, { align: 'center' });
      
      // Add new legal footnote
      const legalNote = "This tool is not a substitute for professional legal consultation. Always seek qualified legal advice for your specific situation.";
      doc.text(legalNote, 100, 268, { align: 'center' });
      
      // Draw a light separator line above the footer
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.line(20, 274 - 5, 190, 274 - 5);
    }
  } catch (error) {
    console.error("Error adding logo to PDF footer:", error);
    
    // Fallback to text-only footer if image loading fails
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Set smaller font size for more space
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      
      // Add page numbers
      doc.text(`Page ${i} of ${pageCount}`, 20, 285);
      
      // Add Nexabloom branding (text only as fallback)
      doc.setTextColor(79, 70, 229);
      doc.text('Nexabloom', 100, 280, { align: 'center' });
      doc.text('nexabloom.xyz', 180, 280, { align: 'right' });
      
      // Add legal disclaimer even in fallback mode
      doc.setFontSize(6);
      doc.setTextColor(90, 90, 90);
      const disclaimer = "LEGAL DISCLAIMER: This report is for informational purposes only and does not constitute legal advice.";
      doc.text(disclaimer, 100, 274, { align: 'center' });
      
      // Add legal footnote in fallback mode
      const legalNote = "This tool is not a substitute for professional legal consultation. Always seek qualified legal advice for your specific situation.";
      doc.text(legalNote, 100, 268, { align: 'center' });
    }
  }
};
