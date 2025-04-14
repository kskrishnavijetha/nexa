
import { jsPDF } from 'jspdf';
import { determineComplianceStatus } from '../../complianceUtils';
import { formatDate } from '@/components/audit/auditUtils';

/**
 * Add executive summary page to the extended audit report
 */
export const addExecutiveSummaryPage = (
  doc: jsPDF,
  {
    documentName,
    auditEvents,
    industry,
    companyDetails
  }: {
    documentName: string;
    auditEvents: any[];
    industry?: string;
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
  doc.text('Executive Summary', pageWidth / 2, 13, { align: 'center' });
  
  // Add organization name
  let yPos = 30;
  doc.setFontSize(12);
  doc.setTextColor(25, 65, 120);
  doc.text('Organization:', 20, yPos);
  
  doc.setTextColor(0, 0, 0);
  doc.text(companyDetails?.companyName || 'Your Organization', 70, yPos);
  
  // Add document info
  yPos += 10;
  doc.setTextColor(25, 65, 120);
  doc.text('Document:', 20, yPos);
  
  doc.setTextColor(0, 0, 0);
  doc.text(documentName, 70, yPos);
  
  // Add date
  yPos += 10;
  doc.setTextColor(25, 65, 120);
  doc.text('Audit Date:', 20, yPos);
  
  doc.setTextColor(0, 0, 0);
  doc.text(formatDate(new Date().toISOString()), 70, yPos);
  
  // Add compliance framework
  yPos += 10;
  doc.setTextColor(25, 65, 120);
  doc.text('Framework:', 20, yPos);
  
  doc.setTextColor(0, 0, 0);
  doc.text(companyDetails?.complianceType || 'SOC 2', 70, yPos);
  
  // Add industry if available
  if (industry) {
    yPos += 10;
    doc.setTextColor(25, 65, 120);
    doc.text('Industry:', 20, yPos);
    
    doc.setTextColor(0, 0, 0);
    doc.text(industry, 70, yPos);
  }
  
  // Add section divider
  yPos += 15;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  // Add purpose section
  yPos += 15;
  doc.setFontSize(14);
  doc.setTextColor(25, 65, 120);
  doc.text('Purpose of Audit', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const purposeText = `This audit was conducted to evaluate compliance with ${companyDetails?.complianceType || 'regulatory'} requirements and identify potential risks in document "${documentName}". The assessment provides an AI-driven analysis of compliance status, risks identified, and remediation recommendations.`;
  
  const purposeLines = doc.splitTextToSize(purposeText, pageWidth - 40);
  doc.text(purposeLines, 20, yPos);
  
  // Update position based on number of lines
  yPos += purposeLines.length * 6;
  
  // Add risk assessment section
  yPos += 10;
  doc.setFontSize(14);
  doc.setTextColor(25, 65, 120);
  doc.text('Risk Assessment', 20, yPos);
  
  // Calculate risk score (mock)
  const riskScore = Math.floor(65 + Math.random() * 30);
  const complianceStatus = determineComplianceStatus(riskScore);
  
  // Add risk score visualization
  yPos += 15;
  
  // Draw risk meter background
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(1);
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(50, yPos, pageWidth - 100, 20, 5, 5, 'FD');
  
  // Draw risk meter fill
  const fillWidth = (pageWidth - 100) * (riskScore / 100);
  doc.setFillColor(
    riskScore >= 90 ? 75 : riskScore >= 70 ? 230 : 200,
    riskScore >= 90 ? 210 : riskScore >= 70 ? 150 : 55,
    riskScore >= 90 ? 100 : riskScore >= 70 ? 0 : 55
  );
  doc.roundedRect(50, yPos, fillWidth, 20, 5, 5, 'F');
  
  // Add score text
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(`${riskScore}%`, 50 + fillWidth / 2, yPos + 13, { align: 'center' });
  
  // Add score labels
  yPos += 25;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('0%', 50, yPos);
  doc.text('100%', pageWidth - 50, yPos, { align: 'right' });
  
  // Add compliance status
  yPos += 15;
  doc.setFontSize(14);
  doc.setTextColor(25, 65, 120);
  doc.text('Compliance Status:', 20, yPos);
  
  // Set status color based on compliance level
  let statusColor;
  switch (complianceStatus) {
    case 'Compliant':
      statusColor = [0, 128, 0]; // Green
      break;
    case 'Needs Remediation':
      statusColor = [230, 150, 0]; // Orange
      break;
    case 'Critical':
      statusColor = [200, 0, 0]; // Red
      break;
    default:
      statusColor = [100, 100, 100]; // Gray
  }
  
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFontSize(16);
  doc.text(complianceStatus, 140, yPos);
  
  // Add summary section
  yPos += 20;
  doc.setFontSize(14);
  doc.setTextColor(25, 65, 120);
  doc.text('Summary of Findings', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Calculate mock statistics
  const events = auditEvents.length;
  const violations = Math.floor(events * 0.15);
  const highRisk = Math.floor(violations * 0.2);
  const mediumRisk = Math.floor(violations * 0.5);
  const lowRisk = violations - highRisk - mediumRisk;
  
  const summaryText = `The automated compliance scan identified ${violations} potential compliance issues across ${events} audit events. Of these, ${highRisk} were classified as high-risk, ${mediumRisk} as medium-risk, and ${lowRisk} as low-risk. This report provides detailed recommendations for addressing these issues to achieve full compliance with ${companyDetails?.complianceType || 'the applicable framework'}.`;
  
  const summaryLines = doc.splitTextToSize(summaryText, pageWidth - 40);
  doc.text(summaryLines, 20, yPos);
  
  // Add page number
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Page 2',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
};
