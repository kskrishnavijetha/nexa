
import { AuditEvent } from '@/components/audit/types';
import { jsPDF } from 'jspdf';
import { calculateReportStatistics } from './reportStatistics';
import { AIInsight } from './types';
import { generateAIInsights } from './insights';
import { addExecutiveSummary } from './pdf/addExecutiveSummary';
import { addInsightsSection } from './pdf/addInsightsSection';
import { addSummarySection } from './pdf/addSummarySection';
import { addFooter } from './pdf/addFooter';
import { Industry } from '@/utils/types';
import { calculateComplianceScore } from './pdf/findings/calculateComplianceScore';
import { generateComplianceFindings } from './pdf/findings/generateComplianceFindings';

/**
 * Generate a PDF report with AI-enhanced insights from audit events
 */
export const generatePDFReport = async (
  documentName: string,
  auditEvents: AuditEvent[],
  selectedIndustry?: Industry
): Promise<Blob> => {
  console.log(`[pdfGenerator] Generating PDF report for ${documentName}`);
  console.log(`[pdfGenerator] Selected industry parameter: ${selectedIndustry || 'not specified'}`);
  
  // Create PDF with a slightly larger page size (a4+ format)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true
  });
  
  // Set reasonable margins
  const margin = 20; // 20mm margins
  pdf.setProperties({
    title: `Audit Report - ${documentName}`,
    subject: 'AI-Enhanced Compliance Report',
    creator: 'Compliance Report Generator'
  });
  
  // Add executive summary with document info - pass the industry explicitly
  let yPos = addExecutiveSummary(pdf, auditEvents, documentName, selectedIndustry);
  
  // Report Statistics
  const stats = calculateReportStatistics(auditEvents);
  
  // AI-Generated Insights based on industry and document
  // Use the document name and industry to help determine the insights
  const insights: AIInsight[] = generateAIInsights(auditEvents, documentName, selectedIndustry);
  
  // Add risk and recommendation insights section with padding
  yPos = addInsightsSection(pdf, insights, yPos + 10);
  
  // Add summary statistics and findings section with padding
  // Pass document name and selected industry to allow industry-specific findings
  yPos = addSummarySection(pdf, stats, yPos + 10, documentName, selectedIndustry);
  
  // Generate compliance findings for final score page
  const findings = generateComplianceFindings(stats, documentName, undefined, selectedIndustry);
  const complianceScore = calculateComplianceScore(findings);
  
  // Add a new page for final compliance score to avoid overlap
  pdf.addPage();
  
  // Add final compliance score section on the new page
  addFinalComplianceScorePage(pdf, complianceScore.score, complianceScore.status, complianceScore.complianceStatus, selectedIndustry);
  
  // Add footer with page numbers to all pages - must be last operation
  addFooter(pdf);
  
  // Return the PDF as a blob
  return pdf.output('blob');
};

/**
 * Add a final compliance score page to the PDF
 */
function addFinalComplianceScorePage(
  pdf: jsPDF, 
  score: number, 
  status: 'Pass' | 'Fail',
  complianceStatus: 'Compliant' | 'Non-Compliant',
  industry?: Industry
): void {
  // Set the title for this page
  pdf.setFontSize(18);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Compliance Results & Final Score', 20, 30);
  
  // Add horizontal separator
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.line(20, 35, 190, 35);
  
  // Display the final score prominently
  pdf.setFontSize(24);
  
  // Set color based on score
  if (score >= 90) {
    pdf.setTextColor(0, 128, 0); // Green for high score
  } else if (score >= 70) {
    pdf.setTextColor(0, 100, 150); // Blue for good score
  } else if (score >= 50) {
    pdf.setTextColor(255, 165, 0); // Orange for medium score
  } else {
    pdf.setTextColor(200, 0, 0); // Red for low score
  }
  
  pdf.text(`Final Compliance Score: ${score}%`, 105, 60, { align: 'center' });
  
  // Display compliance status
  pdf.setFontSize(20);
  pdf.text(`Compliance Status: ${complianceStatus}`, 105, 75, { align: 'center' });
  
  // Display Overall Status (Pass/Fail)
  pdf.setFontSize(18);
  pdf.setTextColor(status === 'Pass' ? 0 : 200, status === 'Pass' ? 128 : 0, 0);
  pdf.text(`Overall Status: ${status}`, 105, 90, { align: 'center' });
  
  // Reset color for rest of content
  pdf.setTextColor(0, 0, 0);
  
  // Add score implications
  pdf.setFontSize(14);
  pdf.text('Score Implications', 20, 115);
  
  pdf.setFontSize(11);
  const implications = [
    '90-100%: Excellent compliance. Minor improvements may still be beneficial.',
    '70-89%: Good compliance. Some areas need attention but overall risk is low.',
    '50-69%: Moderate compliance. Significant improvements needed in several areas.',
    'Below 50%: Poor compliance. Urgent remediation required to address critical issues.'
  ];
  
  let yPos = 125;
  implications.forEach(imp => {
    pdf.text(imp, 30, yPos);
    yPos += 8;
  });
  
  // Add industry-specific notes if available
  if (industry) {
    pdf.setFontSize(14);
    pdf.setTextColor(0, 51, 102);
    pdf.text('Industry-Specific Compliance Notes', 20, yPos + 10);
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    
    let industryNotes: string[] = [];
    
    // Add industry-specific notes
    switch(industry) {
      case 'Healthcare':
        industryNotes = [
          'HIPAA compliance requires regular security risk assessments.',
          'Patient data protection should be prioritized in all systems.',
          'Regular training for staff on privacy practices is essential.'
        ];
        break;
      case 'Finance & Banking':
        industryNotes = [
          'Financial regulations require stringent data protection measures.',
          'Transaction monitoring should be regularly audited.',
          'Customer financial data requires highest level of protection.'
        ];
        break;
      case 'Government':
        industryNotes = [
          'Compliance with FISMA standards is mandatory for federal systems.',
          'Public records management must follow retention guidelines.',
          'Security clearances must be verified and updated regularly.'
        ];
        break;
      default:
        industryNotes = [
          'Regular compliance audits are recommended for all industries.',
          'Document all compliance activities for future reference.',
          'Maintain a continuous improvement approach to compliance.'
        ];
    }
    
    yPos += 20;
    industryNotes.forEach(note => {
      pdf.text(`• ${note}`, 30, yPos);
      yPos += 8;
    });
  }
  
  // Add recommendations based on score
  pdf.setFontSize(14);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Recommended Next Steps', 20, yPos + 10);
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  
  yPos += 20;
  
  // Add recommendations based on score
  if (score >= 90) {
    pdf.text('• Maintain current compliance standards through regular monitoring', 30, yPos);
    yPos += 8;
    pdf.text('• Document successful compliance strategies for future reference', 30, yPos);
    yPos += 8;
    pdf.text('• Consider enhancing already strong areas to achieve excellence', 30, yPos);
  } else if (score >= 70) {
    pdf.text('• Address specific areas noted in the findings section', 30, yPos);
    yPos += 8;
    pdf.text('• Implement regular compliance check-ins to maintain progress', 30, yPos);
    yPos += 8;
    pdf.text('• Review and update compliance policies to address minor gaps', 30, yPos);
  } else if (score >= 50) {
    pdf.text('• Develop a comprehensive remediation plan for identified issues', 30, yPos);
    yPos += 8;
    pdf.text('• Prioritize high-risk compliance failures for immediate action', 30, yPos);
    yPos += 8;
    pdf.text('• Schedule follow-up assessment within 90 days', 30, yPos);
  } else {
    pdf.text('• Urgent action required to address critical compliance failures', 30, yPos);
    yPos += 8;
    pdf.text('• Consider engaging compliance specialists for remediation support', 30, yPos);
    yPos += 8;
    pdf.text('• Implement weekly progress tracking on compliance improvements', 30, yPos);
    yPos += 8;
    pdf.text('• Schedule follow-up assessment within 30 days', 30, yPos);
  }
}
