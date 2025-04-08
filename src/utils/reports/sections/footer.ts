
import { jsPDF } from 'jspdf';

/**
 * Add footer with page numbers and legal disclaimer to the PDF document
 */
export const addFooter = (doc: jsPDF): void => {
  const pageCount = doc.getNumberOfPages();
  
  // Load Nexabloom logo image (using a data URI for simplicity)
  const logoSize = 5; // Height in mm
  const logoDataURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADF0lEQVR4nO2Zz08TQRTHNzM0MQH1oAcTLv4FJF48GE/+vBgSE07+OJh49AYJiYke9KAkRtw3I2o88WdjNDQmYsCEB7szbQmiIlZRarH9ku7CUmah3e4uZXm7J5LuzH7m+/3OvPd2Q0j5KU/qlB4cPErp4CjjNMk4zXHO081O872M06LJaCnVTE61bu56SjmNMUaLjNNuo9FysQZfQ6sa1BzrNTnNkqOukJckzTzkjJZONdqHKsU3GS2bsVWdJkddareKT3zwUZIOlRucY2Wn2SanBXLcFXbLQP7BUTfzl9OSBL9vMrrZlXx44JPX7tD5a4ZInF8zxMzcknvw4pVE0m5jgg8+4IPPGedjF675+GDnN/Slnl65yxkt9pUI+AR6+eZz5xKJ8cb7L14l+OBrtObKlfl87xKM045PJTj41KyQiMUMkYzHxcjoZxmRGzIiJf+XM7rjC4C2gWV8NtXfG3O1e68QwnHJ0fDTgnTrnJZdAawn0NvAcxmRHJub/yUdryK1KxEVYD2BnoW85JNPrcpUrqSjnEZFuxN2BKCx4VmR7O8V0/MLUkI5pzElMToC0FC8R44NzTHOb0oASBRdVwB6NDLj1QE5YzNSQrHTwoipC9BTcgY4zXUFwNl8KRzseOzQgegISEl82zUA1+a2cwY4HYwEQOdxxd+9AgCs//c5YjFDJBJxr30QEYDhyVlvi/x7usKwXCQAIAcnZ1U1WogEABB4B6Yqt1RJO7gLxRdIxGOitzcmxqbmlLQsHQdA6OVrJ1QBwJ9aAXDxBQDpCnDlekypVaZMSsepVgAi/VAHQILTe2UAoFoBiA5wBoAEwneKAADVCkCE5HPdAPKc31YCAC0CUD0ATQ80zmvkQEMrXAVgvVSqaXJAlNd4H3BWBGCc0/NIAJSQ0MTcF5GIx8XA0HQkAHI5nL3UWBd3oWICVenHePLMA9UWagUgt8n24emzDxW6kO0JQE5Vi1e6kMfxjCxkrJxP4HMbqfSUFxt8eDQuEqelVLtssc/Da0rfAvmxq6nsv4pVJ59mBXmZ8TWyB54Y/zc7TwKN7MY/92PsUSJJ0lZbDk95ylOeRjv/AKp9lEGAOsJnAAAAAElFTkSuQmCC";
  
  try {
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Page number footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, 20, 280);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 190, 280, { align: 'right' });
      
      // Add Nexabloom logo and branding
      const logoPositionY = 278;
      doc.addImage(logoDataURI, 'PNG', 92, logoPositionY - 4, 4, 4);
      doc.setTextColor(79, 70, 229); // Indigo color for branding
      doc.text('Nexabloom', 98, logoPositionY);
      
      // Legal disclaimer
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      const disclaimer = "LEGAL DISCLAIMER: This compliance report is for informational purposes only. It does not constitute legal advice and should not be considered a substitute for consulting with a qualified legal professional.";
      doc.text(disclaimer, 105, 288, { align: 'center', maxWidth: 170 });
    }
  } catch (error) {
    console.error("Error adding logo to PDF footer:", error);
    
    // Fallback to text-only footer
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, 105, 280, { align: 'center' });
      
      // Add Nexabloom branding (text only)
      doc.setTextColor(79, 70, 229);
      doc.text('Nexabloom', 105, 285, { align: 'center' });
      
      // Legal disclaimer
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      const disclaimer = "LEGAL DISCLAIMER: This compliance report is for informational purposes only. It does not constitute legal advice.";
      doc.text(disclaimer, 105, 288, { align: 'center', maxWidth: 170 });
    }
  }
};
