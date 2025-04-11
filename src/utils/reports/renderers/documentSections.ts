
import { jsPDF } from 'jspdf';
import { ComplianceReport } from '../../types';
import { SupportedLanguage, translate } from '../../language';

/**
 * Render the document header section
 */
export const renderDocumentHeader = async (
  doc: jsPDF,
  language: SupportedLanguage
): Promise<string> => {
  // Set font size and styles
  doc.setFontSize(22);
  doc.setTextColor(0, 51, 102);
  
  // Add title
  doc.text(translate('compliance_report', language), 20, 20);
  
  // Add horizontal line
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);
  
  return 'header';
};

/**
 * Render the document info section
 */
export const renderDocumentInfo = async (
  doc: jsPDF,
  report: ComplianceReport,
  language: SupportedLanguage
): Promise<string> => {
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
  doc.text(`${translate('generated', language)}: ${new Date().toLocaleDateString()}`, 20, yPos);
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
    
    // Limit regulations to 2 for performance
    if (report.regulations && report.regulations.length > 0) {
      const regulations = report.regulations.slice(0, 2).join(', ');
      doc.text(`${translate('applicable_regulations', language)}: ${regulations}`, 20, yPos);
      yPos += 7;
    }
  }
  
  return 'document-info';
};

/**
 * Render the summary section
 */
export const renderSummarySection = async (
  doc: jsPDF,
  report: ComplianceReport,
  language: SupportedLanguage
): Promise<string> => {
  // Summary Section - with truncated text for performance
  let summaryYPos = 90;
  doc.setFontSize(16);
  doc.setTextColor(0, 51, 102);
  doc.text(translate('summary', language), 20, summaryYPos);
  
  // Set normal font for content
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  
  // Add wrapped summary text - extremely limited length for performance
  summaryYPos += 10;
  const summaryText = report.summary.length > 200
    ? report.summary.substring(0, 200) + '...' 
    : report.summary;
  const summaryLines = doc.splitTextToSize(summaryText, 170);
  doc.text(summaryLines, 20, summaryYPos);
  
  return 'summary';
};
