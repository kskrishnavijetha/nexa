
import { jsPDF } from 'jspdf';
import { calculateEstimatedTimeToFix } from '../../complianceUtils';

/**
 * Add remediation suggestions page to the extended audit report
 */
export const addRemediationPage = (
  doc: jsPDF,
  auditEvents: any[],
  documentName: string
) => {
  // Set page properties
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add page header
  doc.setFillColor(25, 65, 120);
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('Remediation Suggestions', pageWidth / 2, 13, { align: 'center' });
  
  // Add section description
  let yPos = 30;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const descriptionText = `This section provides actionable recommendations to address compliance issues identified in document "${documentName}". Each item includes an estimated time to fix and priority level.`;
  
  const descriptionLines = doc.splitTextToSize(descriptionText, pageWidth - 40);
  doc.text(descriptionLines, 20, yPos);
  
  // Update position based on number of lines
  yPos += descriptionLines.length * 6 + 10;
  
  // Generate remediation items from audit events
  const remediationItems = generateRemediationItems(auditEvents);
  
  // Add remediation table
  if (remediationItems.length === 0) {
    doc.setFontSize(12);
    doc.setTextColor(0, 128, 0);
    doc.text('No remediation actions required. All compliance checks passed.', 20, yPos + 10);
  } else {
    // Add table headers
    const headers = ['Issue', 'Recommendation', 'Priority', 'Est. Time to Fix'];
    const columnWidths = [50, 80, 25, 25]; // in mm
    const startX = 15;
    const rowHeight = 20;
    
    // Draw header row
    doc.setFillColor(240, 245, 255);
    doc.rect(startX, yPos, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(25, 65, 120);
    doc.setFont('helvetica', 'bold');
    
    let xPos = startX + 3;
    headers.forEach((header, index) => {
      doc.text(header, xPos, yPos + 12);
      xPos += columnWidths[index];
    });
    
    // Draw table rows
    yPos += rowHeight;
    doc.setFont('helvetica', 'normal');
    
    remediationItems.forEach((item, index) => {
      // Check if we need a new page
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 30;
        
        // Add continuation header
        doc.setFillColor(25, 65, 120);
        doc.rect(0, 0, pageWidth, 20, 'F');
        
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.text('Remediation Suggestions (Continued)', pageWidth / 2, 13, { align: 'center' });
        
        // Re-add table headers
        yPos = 40;
        doc.setFillColor(240, 245, 255);
        doc.rect(startX, yPos, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
        
        doc.setFontSize(10);
        doc.setTextColor(25, 65, 120);
        doc.setFont('helvetica', 'bold');
        
        let xHeaderPos = startX + 3;
        headers.forEach((header, index) => {
          doc.text(header, xHeaderPos, yPos + 12);
          xHeaderPos += columnWidths[index];
        });
        
        doc.setFont('helvetica', 'normal');
        yPos += rowHeight;
      }
      
      // Calculate row height based on content
      const issueLines = doc.splitTextToSize(item.issue, columnWidths[0] - 5);
      const recommendationLines = doc.splitTextToSize(item.recommendation, columnWidths[1] - 5);
      const maxLines = Math.max(issueLines.length, recommendationLines.length);
      const dynamicRowHeight = Math.max(rowHeight, maxLines * 10);
      
      // Add light background for alternating rows
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(startX, yPos, columnWidths.reduce((a, b) => a + b, 0), dynamicRowHeight, 'F');
      }
      
      // Write row data
      xPos = startX + 3;
      
      // Issue
      doc.setTextColor(0, 0, 0);
      doc.text(issueLines, xPos, yPos + 10);
      xPos += columnWidths[0];
      
      // Recommendation
      doc.text(recommendationLines, xPos, yPos + 10);
      xPos += columnWidths[1];
      
      // Priority
      doc.setTextColor(
        item.priority === 'High' ? 200 : item.priority === 'Medium' ? 230 : 100,
        item.priority === 'High' ? 0 : item.priority === 'Medium' ? 150 : 150,
        item.priority === 'High' ? 0 : item.priority === 'Medium' ? 0 : 100
      );
      doc.text(item.priority, xPos, yPos + 10);
      xPos += columnWidths[2];
      
      // Estimated time to fix
      doc.setTextColor(0, 0, 0);
      doc.text(item.timeToFix, xPos, yPos + 10);
      
      // Update position for next row
      yPos += dynamicRowHeight;
    });
  }
  
  // Add page number
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Page 5',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
};

/**
 * Generate remediation items based on audit events
 */
const generateRemediationItems = (auditEvents: any[]) => {
  const items = [];
  
  // Look for events indicating issues
  const issueEvents = auditEvents.filter(event => 
    event.action.toLowerCase().includes('violation') ||
    event.action.toLowerCase().includes('failed') ||
    event.action.toLowerCase().includes('warning') ||
    event.status === 'pending'
  );
  
  // Generate remediation items from issues
  for (const event of issueEvents) {
    const category = getCategoryFromEvent(event);
    const severity = getSeverityFromEvent(event);
    
    items.push({
      issue: event.action,
      recommendation: generateRecommendation(category, event.action),
      priority: severity,
      timeToFix: calculateEstimatedTimeToFix(severity, 1)
    });
  }
  
  // Add some default remediation items if none were found
  if (items.length === 0) {
    items.push({
      issue: 'Data access controls need improvement',
      recommendation: 'Implement role-based access control (RBAC) and least privilege principles for all data access',
      priority: 'Medium',
      timeToFix: '8 hours'
    });
    
    items.push({
      issue: 'Encryption standards not consistently applied',
      recommendation: 'Ensure all sensitive data is encrypted at rest and in transit using industry-standard algorithms',
      priority: 'High',
      timeToFix: '16 hours'
    });
    
    items.push({
      issue: 'Incomplete audit logging',
      recommendation: 'Configure comprehensive audit logging for all system access and data modifications',
      priority: 'Medium',
      timeToFix: '8 hours'
    });
  }
  
  return items;
};

/**
 * Extract category from an audit event
 */
const getCategoryFromEvent = (event: any) => {
  const action = event.action.toLowerCase();
  
  if (action.includes('access') || action.includes('permission') || action.includes('auth')) {
    return 'Access Control';
  } else if (action.includes('data') || action.includes('privacy') || action.includes('personal')) {
    return 'Data Privacy';
  } else if (action.includes('encrypt') || action.includes('secure') || action.includes('ssl')) {
    return 'Encryption';
  } else if (action.includes('log') || action.includes('audit') || action.includes('monitor')) {
    return 'Logging';
  } else {
    return 'General Compliance';
  }
};

/**
 * Extract severity from an audit event
 */
const getSeverityFromEvent = (event: any) => {
  const action = event.action.toLowerCase();
  
  if (action.includes('critical') || action.includes('severe')) {
    return 'High';
  } else if (action.includes('warning') || action.includes('moderate')) {
    return 'Medium';
  } else {
    return 'Low';
  }
};

/**
 * Generate recommendation based on category and issue
 */
const generateRecommendation = (category: string, issue: string) => {
  switch (category) {
    case 'Access Control':
      return 'Implement proper access controls with role-based permissions and regular access reviews. Ensure principle of least privilege is applied.';
    case 'Data Privacy':
      return 'Review data handling practices to ensure personal information is properly protected. Implement data classification and handling policies.';
    case 'Encryption':
      return 'Enable industry-standard encryption for data at rest and in transit. Review and update encryption protocols regularly.';
    case 'Logging':
      return 'Configure comprehensive audit logging and monitoring. Set up alerts for suspicious activities and review logs regularly.';
    default:
      return 'Review compliance requirements and establish policies to address the identified issues. Document procedures and train staff accordingly.';
  }
};
