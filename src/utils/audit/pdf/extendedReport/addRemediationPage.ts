
import { jsPDF } from 'jspdf';
import { RemediationItem } from '@/components/audit/extended-report/types';

/**
 * Add remediation suggestions page to the extended report
 */
export const addRemediationPage = (
  doc: jsPDF,
  remediations: RemediationItem[]
): void => {
  // Page margin
  const margin = 20;
  let yPos = margin;
  
  // Add section title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 51, 102);
  doc.text('Remediation Suggestions', margin, yPos);
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
  const descriptionText = 'This section provides actionable guidance for addressing identified compliance issues, prioritized by severity and with estimated time to fix.';
  const descriptionLines = doc.splitTextToSize(descriptionText, 210 - margin * 2);
  doc.text(descriptionLines, margin, yPos);
  yPos += descriptionLines.length * 5 + 10;
  
  // If no remediation items, show a message
  if (remediations.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.text('No remediation items required.', margin, yPos);
    doc.addPage(); // Still add a page break
    return;
  }
  
  // Sort remediation items by priority (Critical, High, Medium, Low)
  const sortedRemediations = [...remediations].sort((a, b) => {
    const priorityOrder: Record<string, number> = {
      'Critical': 0,
      'High': 1,
      'Medium': 2,
      'Low': 3
    };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  // Draw each remediation item
  for (const item of sortedRemediations) {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = margin;
    }
    
    // Draw priority indicator with color coding
    let priorityColor: number[] = [0, 0, 0];
    switch (item.priority) {
      case 'Critical':
        priorityColor = [139, 0, 0]; // Dark red
        break;
      case 'High':
        priorityColor = [220, 53, 69]; // Red
        break;
      case 'Medium':
        priorityColor = [255, 165, 0]; // Orange
        break;
      case 'Low':
        priorityColor = [0, 128, 0]; // Green
        break;
    }
    
    // Draw priority indicator circle
    doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
    doc.circle(margin + 3, yPos + 3, 3, 'F');
    
    // Draw item title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const titleLines = doc.splitTextToSize(item.title, 210 - margin * 2 - 10);
    doc.text(titleLines, margin + 10, yPos + 4);
    yPos += titleLines.length * 5 + 2;
    
    // Draw priority and time to fix
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
    doc.text(`Priority: ${item.priority}`, margin + 10, yPos);
    doc.setTextColor(80, 80, 80);
    doc.text(`Estimated time to fix: ${item.timeToFix}`, margin + 50, yPos);
    yPos += 5;
    
    // Draw related regulation if available
    if (item.relatedRegulation) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(0, 51, 102);
      doc.text(`Related regulation: ${item.relatedRegulation}`, margin + 10, yPos);
      yPos += 5;
    }
    
    // Draw description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const descLines = doc.splitTextToSize(item.description, 210 - margin * 2 - 10);
    doc.text(descLines, margin + 10, yPos);
    yPos += descLines.length * 5 + 2;
    
    // Add separator between items
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(margin, yPos, 210 - margin, yPos);
    yPos += 8;
  }
  
  // Add page break
  doc.addPage();
};
