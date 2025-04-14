
import { jsPDF } from 'jspdf';
import { generateComplianceMatrix } from '../../complianceUtils';

/**
 * Add compliance matrix page to the extended audit report
 */
export const addComplianceMatrixPage = (
  doc: jsPDF,
  {
    documentName,
    auditEvents,
    companyDetails
  }: {
    documentName: string;
    auditEvents: any[];
    companyDetails?: any;
  }
) => {
  // Set page properties
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add page header
  doc.setFillColor(25, 65, 120);
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('Compliance Matrix', pageWidth / 2, 13, { align: 'center' });
  
  // Add section description
  let yPos = 30;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const descriptionText = `This matrix maps identified compliance issues to specific requirements in the ${companyDetails?.complianceType || 'selected'} framework. Each item includes an AI detection status and explanation.`;
  
  const descriptionLines = doc.splitTextToSize(descriptionText, pageWidth - 40);
  doc.text(descriptionLines, 20, yPos);
  
  // Update position based on number of lines
  yPos += descriptionLines.length * 6 + 10;
  
  // Generate compliance matrix data
  const matrix = generateComplianceMatrix(
    companyDetails?.complianceType || 'SOC 2',
    auditEvents,
    documentName
  );
  
  // Add table headers
  const headers = ['Category', 'Regulation', 'Status', 'Severity', 'Explanation'];
  const columnWidths = [25, 30, 20, 20, 80]; // in mm
  const startX = 15;
  const rowHeight = 10;
  
  // Draw header row
  doc.setFillColor(240, 245, 255);
  doc.rect(startX, yPos - 5, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
  
  doc.setFontSize(9);
  doc.setTextColor(25, 65, 120);
  doc.setFont('helvetica', 'bold');
  
  let xPos = startX + 3;
  headers.forEach((header, index) => {
    doc.text(header, xPos, yPos);
    xPos += columnWidths[index];
  });
  
  // Draw table rows
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  matrix.forEach((row, index) => {
    yPos += rowHeight;
    
    // Check if we need a new page
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 30;
      
      // Add continuation header
      doc.setFillColor(25, 65, 120);
      doc.rect(0, 0, pageWidth, 20, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('Compliance Matrix (Continued)', pageWidth / 2, 13, { align: 'center' });
      
      // Re-add table headers
      yPos = 40;
      doc.setFillColor(240, 245, 255);
      doc.rect(startX, yPos - 5, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(25, 65, 120);
      doc.setFont('helvetica', 'bold');
      
      let xHeaderPos = startX + 3;
      headers.forEach((header, index) => {
        doc.text(header, xHeaderPos, yPos);
        xHeaderPos += columnWidths[index];
      });
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      yPos += 5;
    }
    
    // Add light background for alternating rows
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(startX, yPos - 5, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
    }
    
    // Set style for status
    let statusColor;
    if (row.status === 'Pass') {
      statusColor = [0, 128, 0]; // Green
    } else if (row.status === 'Warning') {
      statusColor = [230, 150, 0]; // Orange
    } else {
      statusColor = [200, 0, 0]; // Red
    }
    
    // Write row data
    xPos = startX + 3;
    
    // Category
    doc.text(row.category, xPos, yPos);
    xPos += columnWidths[0];
    
    // Regulation
    doc.text(row.regulations, xPos, yPos);
    xPos += columnWidths[1];
    
    // Status
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(row.status, xPos, yPos);
    xPos += columnWidths[2];
    
    // Severity
    let severityColor;
    if (row.severity === 'High') {
      severityColor = [200, 0, 0]; 
    } else if (row.severity === 'Medium') {
      severityColor = [230, 150, 0]; 
    } else {
      severityColor = [100, 100, 100];
    }
    doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
    doc.text(row.severity, xPos, yPos);
    xPos += columnWidths[3];
    
    // Explanation (wrap text if needed)
    doc.setTextColor(0, 0, 0);
    const explanationLines = doc.splitTextToSize(row.explanation, columnWidths[4] - 5);
    doc.text(explanationLines, xPos, yPos);
    
    // If explanation has multiple lines, adjust yPos
    if (explanationLines.length > 1) {
      yPos += (explanationLines.length - 1) * 5;
    }
  });
  
  // Add page number
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Page 3',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
};
