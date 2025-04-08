
import { jsPDF } from "jspdf";
import { AuditEvent } from '@/components/audit/types';
import { AuditReportStatistics, AIInsight } from './types';
import { Industry } from '@/utils/types';
import { addExecutiveSummary } from './pdf/addExecutiveSummary';
import { addInsightsSection } from './pdf/addInsightsSection';
import { addSummarySection } from './pdf/addSummarySection';
import { addEventsSection } from './pdf/addEventsSection';
import { addFooter } from './pdf/addFooter';
import { generateAIInsights } from './insights';
import { calculateReportStatistics } from './reportStatistics';

/**
 * Generate a PDF report from audit trail events
 */
export const generatePDFReport = async (
  documentName: string,
  auditEvents: AuditEvent[],
  industry?: Industry
): Promise<Blob> => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });
  
  try {
    // Calculate report statistics
    const stats: AuditReportStatistics = calculateReportStatistics(auditEvents);
    
    // Generate AI insights
    const insights: AIInsight[] = await generateAIInsights(auditEvents, industry);
    
    // Add executive summary to first page
    let yPos = addExecutiveSummary(doc, auditEvents, documentName, industry);
    
    // Start insights section on a new page
    doc.addPage();
    yPos = 0;
    
    // Add insights section
    yPos = addInsightsSection(doc, insights, yPos + 20);
    
    // Add summary section (with findings)
    yPos = addSummarySection(doc, stats, yPos, documentName, industry);
    
    // Start events section on a new page
    doc.addPage();
    yPos = 0;
    
    // Add events section
    yPos = addEventsSection(doc, auditEvents, yPos + 20);
    
    // Add final compliance page on a new page
    doc.addPage();
    
    // Add compliance results title
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102);
    doc.text('Compliance Results & Final Score', 20, 30);
    
    // Add horizontal line
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Calculate compliance score based on completed tasks
    const complianceScore = Math.round((stats.completed / stats.totalEvents) * 100);
    
    // Get color based on score
    const getScoreColor = () => {
      if (complianceScore >= 80) return [0, 128, 0]; // Green
      if (complianceScore >= 70) return [255, 165, 0]; // Orange
      return [255, 0, 0]; // Red
    };
    
    const scoreColor = getScoreColor();
    
    // Add final score with appropriate color
    doc.setFontSize(24);
    doc.setTextColor(...scoreColor);
    doc.text(`Final Compliance Score: ${complianceScore}%`, 105, 60, { align: 'center' });
    
    // Add compliance status
    doc.setFontSize(18);
    doc.text(`(${complianceScore >= 75 ? 'Compliant' : 'Non-Compliant'})`, 105, 70, { align: 'center' });
    
    // Add overall pass/fail status
    doc.setFontSize(18);
    doc.setTextColor(complianceScore >= 75 ? 0 : 255, complianceScore >= 75 ? 128 : 0, 0);
    doc.text(`Overall Status: ${complianceScore >= 75 ? 'PASS' : 'FAIL'}`, 105, 90, { align: 'center' });
    
    // Add score implications
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Score Implications:', 20, 120);
    
    // Add implications based on score
    const implications = [
      complianceScore >= 80 
        ? '• High compliance level achieved. Continue maintaining current practices.' 
        : '• Compliance level needs improvement. Review failed audit items.',
      complianceScore >= 75 
        ? '• Meets minimum regulatory requirements for this industry.' 
        : '• Does not meet minimum regulatory requirements for this industry.',
      complianceScore >= 90 
        ? '• Excellent audit trail completeness and quality.' 
        : '• Audit trail may have gaps or quality issues that need attention.'
    ];
    
    implications.forEach((implication, index) => {
      doc.text(implication, 25, 135 + (index * 10));
    });
    
    // Add industry-specific notes if industry is provided
    if (industry) {
      doc.setFontSize(12);
      doc.setTextColor(0, 51, 102);
      doc.text(`${industry} Industry Notes:`, 20, 180);
      
      let industryNotes: string[] = [];
      
      switch(industry) {
        case 'Finance & Banking':
          industryNotes = [
            '• Requires minimum 80% compliance score for regulatory acceptance.',
            '• Audit trail must maintain detailed transaction history.',
            '• Financial controls documentation is critical for compliance.'
          ];
          break;
        case 'Healthcare':
          industryNotes = [
            '• HIPAA compliance requires minimum 85% compliance score.',
            '• Patient data access logs must be complete and accurate.',
            '• Audit trail must track all PHI access and modifications.'
          ];
          break;
        case 'Government & Defense':
          industryNotes = [
            '• Stringent compliance requirements with 90% minimum threshold.',
            '• Complete audit trail with no gaps in documentation required.',
            '• All system access and modifications must be thoroughly tracked.'
          ];
          break;
        default:
          industryNotes = [
            '• Industry standard requires minimum 75% compliance score.',
            '• Regular audit trail reviews recommended to maintain compliance.',
            '• Documentation of all security-related events is essential.'
          ];
      }
      
      industryNotes.forEach((note, index) => {
        doc.text(note, 25, 195 + (index * 10));
      });
    }
    
    // Add footer to all pages
    addFooter(doc);
    
    return doc.output('blob');
  } catch (error) {
    console.error('Error generating PDF report:', error);
    
    // Return a simple error PDF if something goes wrong
    doc.setFontSize(16);
    doc.setTextColor(255, 0, 0);
    doc.text('Error generating audit report', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Please try again or contact support if the issue persists.', 105, 30, { align: 'center' });
    
    return doc.output('blob');
  }
};

