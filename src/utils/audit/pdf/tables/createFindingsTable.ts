
import { jsPDF } from "jspdf";
import { ComplianceFinding } from '../../types';

/**
 * Create a table for compliance findings
 */
export const createFindingsTable = (doc: jsPDF, findings: ComplianceFinding[], startY: number): number => {
  let yPos = startY;
  
  // Set column headers
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  
  doc.text('Category', 20, yPos);
  doc.text('Status', 80, yPos);
  doc.text('Criticality', 110, yPos);
  doc.text('Details', 150, yPos);
  
  // Draw header underline
  yPos += 2;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(20, yPos, 190, yPos);
  yPos += 5;
  
  // Reset font
  doc.setFont('helvetica', 'normal');
  
  // Add each finding row
  findings.forEach(finding => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setTextColor(0, 0, 0);
    doc.text(finding.category, 20, yPos);
    
    // Set status color
    if (finding.status === 'Pass') {
      doc.setTextColor(0, 128, 0); // Green for pass
    } else if (finding.status === 'Failed') {
      doc.setTextColor(200, 0, 0); // Red for failed
    } else if (finding.status === 'Warning') {
      doc.setTextColor(255, 165, 0); // Orange for warning
    } else {
      doc.setTextColor(100, 100, 100); // Gray for N/A
    }
    
    doc.text(finding.status, 80, yPos);
    
    // Set criticality color
    if (finding.criticality === 'Critical') {
      doc.setTextColor(128, 0, 0); // Dark red for critical
    } else if (finding.criticality === 'High') {
      doc.setTextColor(200, 0, 0); // Red for high
    } else if (finding.criticality === 'Medium') {
      doc.setTextColor(255, 165, 0); // Orange for medium
    } else {
      doc.setTextColor(0, 128, 0); // Green for low
    }
    
    doc.text(finding.criticality, 110, yPos);
    
    // Details in normal color
    doc.setTextColor(0, 0, 0);
    
    // Wrap details text if needed - ensure wrapping works correctly
    const detailsText = doc.splitTextToSize(finding.details, 40);
    doc.text(detailsText, 150, yPos);
    
    // Adjust yPos based on length of wrapped text - ensure enough space
    const textHeight = Math.max(7, detailsText.length * 5);
    yPos += textHeight;
  });
  
  // Draw table bottom line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(20, yPos, 190, yPos);
  yPos += 5;
  
  return yPos;
};
