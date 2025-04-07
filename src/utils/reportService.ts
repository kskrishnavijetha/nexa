
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
    doc.setFontSize(22);
    doc.setTextColor(0, 51, 102);
    
    // Add title
    doc.text(translate('compliance_report', language), 20, 20);
    
    // Add horizontal line
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    // Document Details Section
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text('Document Information', 20, 40);
    
    // Set normal font for content
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    // Add document information
    let yPos = 50;
    doc.text(`${translate('document', language)}: ${report.documentName}`, 20, yPos);
    yPos += 7;
    doc.text(`${translate('generated', language)}: ${new Date().toLocaleString()}`, 20, yPos);
    yPos += 7;
    
    // Add industry and region information with more prominence
    if (report.industry) {
      doc.setFontSize(11);
      doc.setTextColor(0, 70, 140);
      doc.text(`${translate('industry', language)}: ${report.industry}`, 20, yPos);
      yPos += 7;
      
      if (report.region) {
        doc.text(`${translate('region', language)}: ${report.region}`, 20, yPos);
        yPos += 7;
      }
      
      // List applicable regulations if available
      if (report.regulations && report.regulations.length > 0) {
        doc.text(`${translate('applicable_regulations', language)}: ${report.regulations.join(', ')}`, 20, yPos);
        yPos += 7;
      }
    }
    
    // Summary Section
    yPos += 5;
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text(translate('summary', language), 20, yPos);
    
    // Set normal font for content
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    // Add wrapped summary text
    yPos += 10;
    const summaryLines = doc.splitTextToSize(report.summary, 170);
    doc.text(summaryLines, 20, yPos);
    
    // Calculate Y position after summary
    yPos += (summaryLines.length * 7) + 10;
    
    // Compliance Scores Section
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text('Compliance Scores', 20, yPos);
    yPos += 10;
    
    // Add scores with colored indicators
    doc.setFontSize(11);
    
    // Overall score
    const overallScoreColor = getScoreColor(report.overallScore);
    // Fix: Use apply to spread the array properly
    doc.setTextColor.apply(doc, overallScoreColor);
    doc.text(`${translate('overall_compliance', language)}: ${report.overallScore}%`, 25, yPos);
    yPos += 8;
    
    // Add standard scores
    const gdprColor = getScoreColor(report.gdprScore);
    // Fix: Use apply to spread the array properly
    doc.setTextColor.apply(doc, gdprColor);
    doc.text(`${translate('gdpr_compliance', language)}: ${report.gdprScore}%`, 25, yPos);
    yPos += 8;
    
    const hipaaColor = getScoreColor(report.hipaaScore);
    // Fix: Use apply to spread the array properly
    doc.setTextColor.apply(doc, hipaaColor);
    doc.text(`${translate('hipaa_compliance', language)}: ${report.hipaaScore}%`, 25, yPos);
    yPos += 8;
    
    const soc2Color = getScoreColor(report.soc2Score);
    // Fix: Use apply to spread the array properly
    doc.setTextColor.apply(doc, soc2Color);
    doc.text(`${translate('soc2_compliance', language)}: ${report.soc2Score}%`, 25, yPos);
    yPos += 8;
    
    if (report.pciDssScore) {
      const pciColor = getScoreColor(report.pciDssScore);
      // Fix: Use apply to spread the array properly
      doc.setTextColor.apply(doc, pciColor);
      doc.text(`${translate('pci_dss_compliance', language)}: ${report.pciDssScore}%`, 25, yPos);
      yPos += 8;
    }
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Add industry-specific scores if available
    if (report.industryScores && Object.keys(report.industryScores).length > 0) {
      yPos += 3;
      doc.setTextColor(0, 51, 102);
      doc.text(`${translate('industry_specific_compliance', language)}:`, 25, yPos);
      yPos += 7;
      
      for (const [regulation, score] of Object.entries(report.industryScores)) {
        const color = getScoreColor(score as number);
        // Fix: Use apply to spread the array properly
        doc.setTextColor.apply(doc, color);
        doc.text(`${regulation}: ${score}%`, 30, yPos);
        yPos += 7;
        
        // If we're near the end of the page, create a new page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      }
    }
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Check if we need a new page
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }
    
    // Compliance Issues Section
    yPos += 10;
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text(translate('compliance_issues', language), 20, yPos);
    yPos += 10;
    
    // Set normal font for content
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    // Add each risk with better formatting
    for (const risk of report.risks) {
      // Check if we need a page break
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      // Add risk title with severity indicator
      let severityColor: [number, number, number];
      if (risk.severity === 'high') {
        severityColor = [187, 10, 30]; // Red
      } else if (risk.severity === 'medium') {
        severityColor = [204, 102, 0]; // Orange
      } else {
        severityColor = [0, 102, 51]; // Green
      }
      
      // Draw severity indicator - Fix: Use apply to spread the array properly
      doc.setFillColor.apply(doc, severityColor);
      doc.circle(20, yPos - 3, 2, 'F');
      
      // Add risk title
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(risk.title, 25, yPos);
      yPos += 6;
      
      // Add risk description
      doc.setFontSize(10);
      const descriptionLines = doc.splitTextToSize(risk.description, 160);
      doc.text(descriptionLines, 25, yPos);
      yPos += (descriptionLines.length * 5) + 2;
      
      // Add regulation reference if available
      if (risk.regulation || risk.section) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`${translate('regulation', language)}: ${risk.regulation || 'General'}${risk.section ? ` - ${risk.section}` : ''}`, 25, yPos);
        yPos += 5;
      }
      
      // Add mitigation suggestion if available
      if (risk.mitigation) {
        doc.setFontSize(9);
        doc.setTextColor(0, 70, 140);
        doc.text(`Recommendation: ${risk.mitigation}`, 25, yPos);
        yPos += 8;
      }
      
      // Add a small gap between risks
      yPos += 5;
    }
    
    // Add suggestions section if available
    if (report.suggestions && report.suggestions.length > 0) {
      // Check if we need a new page
      if (yPos > 230) {
        doc.addPage();
        yPos = 20;
      }
      
      yPos += 5;
      doc.setFontSize(16);
      doc.setTextColor(0, 51, 102);
      doc.text(translate('improvement_suggestions', language), 20, yPos);
      yPos += 10;
      
      // Set normal font for content
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      // Add each suggestion
      for (const suggestion of report.suggestions) {
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
        
        // Add bullet point
        doc.text('•', 20, yPos);
        
        // Add suggestion text with wrapping
        // Fix: Use suggestion.description instead of suggestion directly
        const suggestionLines = doc.splitTextToSize(suggestion.description, 165);
        doc.text(suggestionLines, 25, yPos);
        yPos += (suggestionLines.length * 5) + 5;
      }
    }
    
    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 190, 290, { align: 'right' });
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

/**
 * Get RGB color based on compliance score
 */
const getScoreColor = (score: number): [number, number, number] => {
  if (score >= 80) {
    return [0, 128, 0]; // Green for good scores
  } else if (score >= 60) {
    return [204, 102, 0]; // Orange for moderate scores
  } else {
    return [187, 10, 30]; // Red for poor scores
  }
};
