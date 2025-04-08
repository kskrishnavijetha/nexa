
import { jsPDF } from "jspdf";

/**
 * Add footer with page numbers and Nexabloom branding to the PDF document
 */
export const addFooter = (doc: jsPDF): void => {
  const pageCount = doc.getNumberOfPages();
  
  // Load Nexabloom logo image (using a data URI for simplicity)
  const logoSize = 5; // Height in mm
  const logoDataURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADF0lEQVR4nO2Zz08TQRTHNzM0MQH1oAcTLv4FJF48GE/+vBgSE07+OJh49AYJiYke9KAkRtw3I2o88WdjNDQmYsCEB7szbQmiIlZRarH9ku7CUmah3e4uZXm7J5LuzH7m+/3OvPd2Q0j5KU/qlB4cPErp4CjjNMk4zXHO081O872M06LJaCnVTE61bu56SjmNMUaLjNNuo9FysQZfQ6sa1BzrNTnNkqOukJckzTzkjJZONdqHKsU3GS2bsVWdJkddareKT3zwUZIOlRucY2Wn2SanBXLcFXbLQP7BUTfzl9OSBL9vMrrZlXx44JPX7tD5a4ZInF8zxMzcknvw4pVE0m5jgg8+4IPPGedjF675+GDnN/Slnl65yxkt9pUI+AR6+eZz5xKJ8cb7L14l+OBrtObKlfl87xKM045PJTj41KyQiMUMkYzHxcjoZxmRGzIiJf+XM7rjC4C2gWV8NtXfG3O1e68QwnHJ0fDTgnTrnJZdAawn0NvAcxmRHJub/yUdryK1KxEVYD2BnoW85JNPrcpUrqSjnEZFuxN2BKCx4VmR7O8V0/MLUkI5pzElMToC0FC8R44NzTHOb0oASBRdVwB6NDLj1QE5YzNSQrHTwoipC9BTcgY4zXUFwNl8KRzseOzQgegISEl82zUA1+a2cwY4HYwEQOdxxd+9AgCs//c5YjFDJBJxr30QEYDhyVlvi/x7usKwXCQAIAcnZ1U1WogEABB4B6Yqt1RJO7gLxRdIxGOitzcmxqbmlLQsHQdA6OVrJ1QBwJ9aAXDxBQDpCnDlekypVaZMSsepVgAi/VAHQILTe2UAoFoBiA5wBoAEwneKAADVCkCE5HPdAPKc31YCAC0CUD0ATQ80zmvkQEMrXAVgvVSqaXJAlNd4H3BWBGCc0/NIAJSQ0MTcF5GIx8XA0HQkAHI5nL3UWBd3oWICVenHePLMA9UWagUgt8n24emzDxW6kO0JQE5Vi1e6kMfxjCxkrJxP4HMbqfSUFxt8eDQuEqelVLtssc/Da0rfAvmxq6nsv4pVJ59mBXmZ8TWyB54Y/zc7TwKN7MY/92PsUSJJ0lZbDk95ylOeRjv/AKp9lEGAOsJnAAAAAElFTkSuQmCC";
  
  // Create a base64 encoded logo image
  try {
    // Add footer to each page with adjusted positioning
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Set smaller font size for more space
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      
      // Adjusted y-position to ensure visibility
      const footerPosition = 285;
      const brandingPosition = 280;
      const disclaimerPosition = 274;
      
      // Add page numbers with more space
      doc.text(`Page ${i} of ${pageCount}`, 20, footerPosition);
      
      // Add Nexabloom logo and branding
      doc.addImage(logoDataURI, 'PNG', 90, brandingPosition - logoSize, logoSize, logoSize);
      
      // Position the text next to the logo
      doc.setTextColor(79, 70, 229); // Indigo color for branding
      doc.text('Nexabloom', 97, brandingPosition);
      doc.text('nexabloom.xyz', 180, brandingPosition, { align: 'right' });
      
      // Add legal disclaimer
      doc.setFontSize(6);
      doc.setTextColor(90, 90, 90);
      const disclaimer = "LEGAL DISCLAIMER: This report is for informational purposes only and does not constitute legal advice.";
      doc.text(disclaimer, 100, disclaimerPosition, { align: 'center' });
      
      // Draw a light separator line above the footer
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.line(20, disclaimerPosition - 5, 190, disclaimerPosition - 5);
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
    }
  }
};
