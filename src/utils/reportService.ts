
import { ApiResponse, ComplianceReport } from './types';
import jsPDF from 'jspdf';

/**
 * Generate a downloadable compliance report PDF
 */
export const generateReportPDF = async (report: ComplianceReport): Promise<ApiResponse<Blob>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Set font size and styles
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102);
    
    // Add title
    doc.text('COMPLIANCE ANALYSIS REPORT', 20, 20);
    
    // Add horizontal line
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    // Set normal font for content
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Add document information
    doc.text(`Document: ${report.documentName}`, 20, 35);
    doc.text(`Generated: ${new Date(report.timestamp).toLocaleString()}`, 20, 42);
    
    // Add scores section
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('COMPLIANCE SCORES', 20, 55);
    
    // Set normal font for content
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Add scores
    doc.text(`Overall Compliance: ${report.overallScore}%`, 25, 65);
    doc.text(`GDPR Compliance: ${report.gdprScore}%`, 25, 72);
    doc.text(`HIPAA Compliance: ${report.hipaaScore}%`, 25, 79);
    doc.text(`SOC 2 Compliance: ${report.soc2Score}%`, 25, 86);
    if (report.pciDssScore) {
      doc.text(`PCI-DSS Compliance: ${report.pciDssScore}%`, 25, 93);
    }
    
    // Add summary section
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('SUMMARY', 20, 105);
    
    // Set normal font for content
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Add wrapped summary text
    const summaryLines = doc.splitTextToSize(report.summary, 170);
    doc.text(summaryLines, 20, 115);
    
    // Calculate Y position after summary
    let yPos = 115 + (summaryLines.length * 7);
    
    // Add suggestions section
    if (report.suggestions && report.suggestions.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text('IMPROVEMENT SUGGESTIONS', 20, yPos + 10);
      
      // Set normal font for content
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      yPos += 20;
      
      // Add each suggestion
      for (const suggestion of report.suggestions) {
        const suggestionLines = doc.splitTextToSize(`• ${suggestion}`, 170);
        doc.text(suggestionLines, 20, yPos);
        yPos += (suggestionLines.length * 7);
        
        // Add a small gap between suggestions
        yPos += 3;
        
        // If we're near the end of the page, create a new page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      }
    }
    
    // Add compliance issues section
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('COMPLIANCE ISSUES', 20, yPos + 10);
    
    // Set normal font for content
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    yPos += 20;
    
    // Add each risk
    for (const risk of report.risks) {
      // Set color based on severity
      if (risk.severity === 'high') {
        doc.setTextColor(187, 10, 30);
      } else if (risk.severity === 'medium') {
        doc.setTextColor(204, 102, 0);
      } else {
        doc.setTextColor(0, 102, 51);
      }
      
      // Add severity label
      doc.setFontSize(9);
      doc.text(`[${risk.severity.toUpperCase()}]`, 20, yPos);
      
      // Reset color for description
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      
      // Add risk description
      const riskLines = doc.splitTextToSize(risk.description, 160);
      doc.text(riskLines, 45, yPos);
      yPos += (riskLines.length * 7);
      
      // Add regulation reference
      doc.setFontSize(9);
      doc.text(`Regulation: ${risk.regulation}${risk.section ? ` - ${risk.section}` : ''}`, 45, yPos);
      
      yPos += 10;
      
      // If we're near the end of the page, create a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    }
    
    // Generate the PDF as a blob
    const pdfBlob = doc.output('blob');
    
    return {
      data: pdfBlob,
      status: 200
    };
  } catch (error) {
    console.error('Report generation error:', error);
    return {
      error: 'Failed to generate the PDF report. Please try again.',
      status: 500
    };
  }
};
