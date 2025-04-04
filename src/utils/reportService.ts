
import { ApiResponse, ComplianceReport } from './types';
import { SupportedLanguage, translate } from './language';
import jsPDF from 'jspdf';

/**
 * Generate a downloadable compliance report PDF
 */
export const generateReportPDF = async (
  report: ComplianceReport,
  language: SupportedLanguage = 'en'
): Promise<ApiResponse<Blob>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Set font size and styles
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102);
    
    // Add title
    doc.text(translate('compliance_report', language), 20, 20);
    
    // Add horizontal line
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    // Set normal font for content
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Add document information
    doc.text(`${translate('document', language)}: ${report.documentName}`, 20, 35);
    doc.text(`${translate('generated', language)}: ${new Date(report.timestamp).toLocaleString()}`, 20, 42);
    
    // Add industry if available
    if (report.industry) {
      doc.text(`${translate('industry', language)}: ${report.industry}`, 20, 49);
      
      // List applicable regulations if available
      if (report.regulations && report.regulations.length > 0) {
        doc.text(`${translate('applicable_regulations', language)}: ${report.regulations.join(', ')}`, 20, 56);
      }
    }
    
    // Adjust Y position based on whether industry info was added
    let yPos = report.industry ? 70 : 55;
    
    // Add scores section
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text(translate('summary', language), 20, yPos);
    
    // Set normal font for content
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Add scores
    yPos += 10;
    doc.text(`${translate('overall_compliance', language)}: ${report.overallScore}%`, 25, yPos);
    yPos += 7;
    
    // Add standard scores
    doc.text(`${translate('gdpr_compliance', language)}: ${report.gdprScore}%`, 25, yPos);
    yPos += 7;
    doc.text(`${translate('hipaa_compliance', language)}: ${report.hipaaScore}%`, 25, yPos);
    yPos += 7;
    doc.text(`${translate('soc2_compliance', language)}: ${report.soc2Score}%`, 25, yPos);
    yPos += 7;
    
    if (report.pciDssScore) {
      doc.text(`${translate('pci_dss_compliance', language)}: ${report.pciDssScore}%`, 25, yPos);
      yPos += 7;
    }
    
    // Add industry-specific scores if available
    if (report.industryScores && Object.keys(report.industryScores).length > 0) {
      yPos += 3;
      doc.text(`${translate('industry_specific_compliance', language)}:`, 25, yPos);
      yPos += 7;
      
      for (const [regulation, score] of Object.entries(report.industryScores)) {
        doc.text(`${regulation}: ${score}%`, 30, yPos);
        yPos += 7;
        
        // If we're near the end of the page, create a new page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      }
    }
    
    // Add summary section
    yPos += 5;
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text(translate('summary', language), 20, yPos);
    
    // Set normal font for content
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Add wrapped summary text
    yPos += 10;
    const summaryLines = doc.splitTextToSize(report.summary, 170);
    doc.text(summaryLines, 20, yPos);
    
    // Calculate Y position after summary
    yPos += (summaryLines.length * 7);
    
    // Add suggestions section
    if (report.suggestions && report.suggestions.length > 0) {
      yPos += 10;
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text(translate('improvement_suggestions', language), 20, yPos);
      
      // Set normal font for content
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      yPos += 10;
      
      // Add each suggestion
      for (const suggestion of report.suggestions) {
        // Handle both string and object formats for suggestions
        const suggestionText = typeof suggestion === 'string' 
          ? suggestion 
          : suggestion.title || suggestion.description;
          
        const suggestionLines = doc.splitTextToSize(`• ${suggestionText}`, 170);
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
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text(translate('compliance_issues', language), 20, yPos);
    
    // Set normal font for content
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    yPos += 10;
    
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
      doc.text(`${translate('regulation', language)}: ${risk.regulation}${risk.section ? ` - ${risk.section}` : ''}`, 45, yPos);
      
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
      success: true,
      data: pdfBlob,
      status: 200
    };
  } catch (error) {
    console.error('Report generation error:', error);
    return {
      success: false,
      error: 'Failed to generate the PDF report. Please try again.',
      status: 500
    };
  }
};
