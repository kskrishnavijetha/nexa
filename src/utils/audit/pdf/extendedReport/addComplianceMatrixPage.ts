
import { jsPDF } from 'jspdf';
import { ComplianceMatrixItem } from '@/components/audit/extended-report/types';
import { ReportConfig } from '@/components/audit/extended-report/types';

/**
 * Add compliance matrix page to the extended report
 */
export const addComplianceMatrixPage = (
  doc: jsPDF,
  complianceMatrix: ComplianceMatrixItem[],
  config: ReportConfig
): void => {
  // Page margin
  const margin = 20;
  let yPos = margin;
  
  // Add section title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 51, 102);
  doc.text('Compliance Matrix', margin, yPos);
  yPos += 10;
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, 210 - margin, yPos);
  yPos += 10;
  
  // Add description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const descriptionText = `This compliance matrix maps detected issues to ${config.complianceTypes.join(', ')} requirements, indicating status, severity, and providing recommendations.`;
  const descriptionLines = doc.splitTextToSize(descriptionText, 210 - margin * 2);
  doc.text(descriptionLines, margin, yPos);
  yPos += descriptionLines.length * 5 + 10;
  
  // If no compliance items, show a message
  if (complianceMatrix.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.text('No compliance issues were detected in the document.', margin, yPos);
    doc.addPage(); // Still add a page break
    return;
  }
  
  // Set up table headers
  const headers = ['Category', 'Regulation', 'Status', 'Severity', 'Details'];
  const colWidths = [30, 35, 20, 20, 75];
  
  // Calculate table width
  const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
  
  // Draw table header
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos, tableWidth, 7, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  
  let xPos = margin;
  headers.forEach((header, i) => {
    doc.text(header, xPos + 2, yPos + 5);
    xPos += colWidths[i];
  });
  
  yPos += 7;
  
  // Draw header underline
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.2);
  doc.line(margin, yPos, margin + tableWidth, yPos);
  
  // Draw table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  for (const item of complianceMatrix) {
    // Check if we need to add a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = margin;
      
      // Redraw table header on new page
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos, tableWidth, 7, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      
      xPos = margin;
      headers.forEach((header, i) => {
        doc.text(header, xPos + 2, yPos + 5);
        xPos += colWidths[i];
      });
      
      yPos += 7;
      
      // Draw header underline
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.2);
      doc.line(margin, yPos, margin + tableWidth, yPos);
      
      // Reset text settings
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
    }
    
    // Calculate row height based on content
    const detailsLines = doc.splitTextToSize(item.details, colWidths[4] - 4);
    const rowHeight = Math.max(6, detailsLines.length * 4);
    
    // Draw alternating row background
    if ((complianceMatrix.indexOf(item) % 2) === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPos, tableWidth, rowHeight, 'F');
    }
    
    // Draw cell content
    doc.setTextColor(0, 0, 0);
    
    // Category
    doc.text(item.category, margin + 2, yPos + 4);
    
    // Regulation
    doc.text(item.regulation, margin + colWidths[0] + 2, yPos + 4);
    
    // Status
    let statusColor = [0, 0, 0];
    switch (item.status) {
      case 'Pass':
        statusColor = [0, 128, 0]; // Green
        break;
      case 'Warning':
        statusColor = [255, 165, 0]; // Orange
        break;
      case 'Failed':
        statusColor = [220, 53, 69]; // Red
        break;
    }
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(item.status, margin + colWidths[0] + colWidths[1] + 2, yPos + 4);
    
    // Severity
    let severityColor = [0, 0, 0];
    switch (item.severity) {
      case 'Critical':
        severityColor = [139, 0, 0]; // Dark red
        break;
      case 'High':
        severityColor = [220, 53, 69]; // Red
        break;
      case 'Medium':
        severityColor = [255, 165, 0]; // Orange
        break;
      case 'Low':
        severityColor = [0, 128, 0]; // Green
        break;
    }
    doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
    doc.text(item.severity, margin + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPos + 4);
    
    // Details
    doc.setTextColor(0, 0, 0);
    doc.text(detailsLines, margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 2, yPos + 4);
    
    // Draw cell borders
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.1);
    
    // Horizontal line at bottom of row
    doc.line(margin, yPos + rowHeight, margin + tableWidth, yPos + rowHeight);
    
    // Vertical lines between cells
    let cellX = margin;
    for (let i = 0; i < colWidths.length; i++) {
      cellX += colWidths[i];
      doc.line(cellX, yPos, cellX, yPos + rowHeight);
    }
    
    // Also draw the left border
    doc.line(margin, yPos, margin, yPos + rowHeight);
    
    // Move to next row
    yPos += rowHeight;
  }
  
  // Add page break
  doc.addPage();
};
