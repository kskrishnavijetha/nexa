
import { jsPDF } from 'jspdf';
import { ComplianceReport } from '@/utils/types';
import { ReportConfig } from '@/components/audit/extended-report/types';

/**
 * Add executive summary page to the extended report
 */
export const addExecutiveSummaryPage = (
  doc: jsPDF,
  report: ComplianceReport,
  config: ReportConfig
): void => {
  // Page margin
  const margin = 20;
  let yPos = margin;
  
  // Add section title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 51, 102);
  doc.text('Executive Summary', margin, yPos);
  yPos += 10;
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, 210 - margin, yPos);
  yPos += 10;
  
  // Overview of document scanned
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Document Overview', margin, yPos);
  yPos += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Document Name: ${report.documentName}`, margin, yPos);
  yPos += 5;
  
  if (report.originalFileName && report.originalFileName !== report.documentName) {
    doc.text(`Original Filename: ${report.originalFileName}`, margin, yPos);
    yPos += 5;
  }
  
  if (report.pageCount) {
    doc.text(`Pages: ${report.pageCount}`, margin, yPos);
    yPos += 5;
  }
  
  if (report.industry) {
    doc.text(`Industry: ${report.industry}`, margin, yPos);
    yPos += 5;
  }
  
  if (report.region) {
    doc.text(`Region: ${report.region}`, margin, yPos);
    yPos += 5;
  }
  
  if (report.organization) {
    doc.text(`Organization: ${report.organization}`, margin, yPos);
    yPos += 5;
  }
  
  yPos += 5;
  
  // Purpose of audit
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Purpose of Audit', margin, yPos);
  yPos += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const purposeText = `This compliance audit was conducted to evaluate the document's alignment with ${config.complianceTypes.join(', ')} regulations and standards. The assessment identifies potential compliance gaps, security risks, and provides actionable remediation steps to achieve and maintain regulatory compliance.`;
  const purposeLines = doc.splitTextToSize(purposeText, 210 - margin * 2);
  doc.text(purposeLines, margin, yPos);
  yPos += purposeLines.length * 5 + 5;
  
  // Compliance framework applied
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Compliance Framework', margin, yPos);
  yPos += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  if (config.complianceTypes.length > 0) {
    config.complianceTypes.forEach(type => {
      doc.text(`• ${type}`, margin, yPos);
      yPos += 5;
    });
  } else {
    doc.text('• General compliance standards', margin, yPos);
    yPos += 5;
  }
  
  yPos += 5;
  
  // AI-assigned risk score
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('AI-Assigned Risk Score', margin, yPos);
  yPos += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Overall Score: ${report.overallScore}%`, margin, yPos);
  yPos += 5;
  
  // Color-coded score indicator
  let scoreColor = [0, 128, 0]; // Green for good score
  if (report.overallScore < 70) {
    scoreColor = [220, 53, 69]; // Red for bad score
  } else if (report.overallScore < 90) {
    scoreColor = [255, 165, 0]; // Orange for moderate score
  }
  
  // Draw score indicator
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.circle(margin + 40, yPos - 2, 3, 'F');
  
  // Add score breakdown for specific regulations
  if (report.gdprScore) {
    doc.text(`GDPR Score: ${report.gdprScore}%`, margin, yPos);
    yPos += 5;
  }
  
  if (report.hipaaScore) {
    doc.text(`HIPAA Score: ${report.hipaaScore}%`, margin, yPos);
    yPos += 5;
  }
  
  if (report.soc2Score) {
    doc.text(`SOC 2 Score: ${report.soc2Score}%`, margin, yPos);
    yPos += 5;
  }
  
  if (report.pciDssScore) {
    doc.text(`PCI DSS Score: ${report.pciDssScore}%`, margin, yPos);
    yPos += 5;
  }
  
  yPos += 5;
  
  // Status
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Status', margin, yPos);
  yPos += 7;
  
  let status = 'Compliant';
  let statusColor = [0, 128, 0]; // Green
  
  if (report.overallScore < 60) {
    status = 'Critical';
    statusColor = [220, 53, 69]; // Red
  } else if (report.overallScore < 80) {
    status = 'Needs Remediation';
    statusColor = [255, 165, 0]; // Orange
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(status, margin, yPos);
  yPos += 10;
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Key Findings
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Key Findings', margin, yPos);
  yPos += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  if (report.risks && report.risks.length > 0) {
    const findingsText = `The compliance analysis identified ${report.risks.length} potential issues that require attention. ${report.risks.filter(r => r.severity === 'high').length} high-severity issues were detected that may present significant compliance risks.`;
    const findingsLines = doc.splitTextToSize(findingsText, 210 - margin * 2);
    doc.text(findingsLines, margin, yPos);
    yPos += findingsLines.length * 5 + 5;
    
    // List top 3 risks (if available)
    const highRisks = report.risks.filter(r => r.severity === 'high' || r.severity === 'critical');
    if (highRisks.length > 0) {
      doc.text('Top issues:', margin, yPos);
      yPos += 5;
      
      const topRisks = highRisks.slice(0, 3);
      topRisks.forEach((risk, index) => {
        const riskText = `${index + 1}. ${risk.title || risk.description}`;
        const riskLines = doc.splitTextToSize(riskText, 210 - margin * 2 - 5);
        doc.text(riskLines, margin + 5, yPos);
        yPos += riskLines.length * 5;
      });
    }
  } else {
    doc.text('No compliance issues were detected based on the selected frameworks.', margin, yPos);
    yPos += 5;
  }
  
  // Add summary
  if (yPos < 250 && report.summary) { // Only if we have space on the page
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Summary', margin, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(report.summary, 210 - margin * 2);
    doc.text(summaryLines, margin, yPos);
  }
  
  // Add page break
  doc.addPage();
};
