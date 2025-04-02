
import { jsPDF } from "jspdf";
import { AuditReportStatistics, ComplianceFinding } from '../types';

/**
 * Add summary statistics section to the PDF document
 */
export const addSummarySection = (doc: jsPDF, stats: AuditReportStatistics, startY: number): number => {
  let yPos = startY;
  
  // Add horizontal line after insights
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  // Add summary of findings header
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text('Summary of Findings', 20, yPos);
  yPos += 10;
  
  // Create compliance findings
  const findings: ComplianceFinding[] = generateComplianceFindings(stats);
  
  // Create findings table
  yPos = createFindingsTable(doc, findings, yPos);
  
  // Add summary details
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  yPos += 10;
  doc.text(`Total Events: ${stats.totalEvents}`, 25, yPos);
  yPos += 7;
  doc.text(`System Events: ${stats.systemEvents}`, 25, yPos);
  yPos += 7;
  doc.text(`User Events: ${stats.userEvents}`, 25, yPos);
  yPos += 7;
  doc.text(`Completed Tasks: ${stats.completed}`, 25, yPos);
  yPos += 7;
  doc.text(`In-Progress Tasks: ${stats.inProgress}`, 25, yPos);
  yPos += 7;
  doc.text(`Pending Tasks: ${stats.pending}`, 25, yPos);
  yPos += 10;
  
  // Add compliance score
  doc.setFontSize(12);
  doc.setTextColor(0, 102, 51);
  const score = calculateComplianceScore(findings);
  const status = score >= 80 ? 'Pass' : 'Fail';
  doc.text(`Final Compliance Score: ${score}% (${score >= 80 ? 'Compliant' : 'Non-Compliant'})`, 25, yPos);
  yPos += 7;
  doc.text(`Overall Status: ${status}`, 25, yPos);
  yPos += 10;
  
  return yPos;
};

/**
 * Calculate compliance score based on findings
 */
const calculateComplianceScore = (findings: ComplianceFinding[]): number => {
  if (findings.length === 0) return 100;
  
  // Count passed findings
  const passedCount = findings.filter(f => f.status === 'Pass').length;
  return Math.round((passedCount / findings.length) * 100);
};

/**
 * Generate compliance findings based on audit statistics
 */
const generateComplianceFindings = (stats: AuditReportStatistics): ComplianceFinding[] => {
  const findings: ComplianceFinding[] = [];
  
  // Generate findings based on statistics
  findings.push({
    category: 'Encryption Enabled',
    status: 'Pass',
    criticality: 'High',
    details: 'Data encrypted at rest and in transit'
  });
  
  if (stats.totalEvents > 0 && stats.userEvents / stats.totalEvents > 0.7) {
    findings.push({
      category: 'User Access Control',
      status: stats.inProgress > stats.completed ? 'Failed' : 'Pass',
      criticality: 'Critical',
      details: stats.inProgress > stats.completed 
        ? 'Unauthorized access detected' 
        : 'Access controls properly enforced'
    });
  }
  
  findings.push({
    category: 'Multi-Factor Auth',
    status: 'Pass',
    criticality: 'High',
    details: 'MFA enforced for all admin users'
  });
  
  findings.push({
    category: 'Data Retention Policy',
    status: stats.pending > 3 ? 'Failed' : 'Pass',
    criticality: 'Medium',
    details: stats.pending > 3 
      ? 'Retention exceeds compliance limits' 
      : 'Data retention policies properly enforced'
  });
  
  return findings;
};

/**
 * Create a table for compliance findings
 */
const createFindingsTable = (doc: jsPDF, findings: ComplianceFinding[], startY: number): number => {
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
    
    // Wrap details text if needed
    const detailsText = doc.splitTextToSize(finding.details, 40);
    doc.text(detailsText, 150, yPos);
    
    // Adjust yPos based on length of wrapped text
    yPos += Math.max(7, detailsText.length * 5);
  });
  
  // Draw table bottom line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(20, yPos, 190, yPos);
  yPos += 5;
  
  return yPos;
};
