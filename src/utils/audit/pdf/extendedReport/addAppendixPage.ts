
import { jsPDF } from 'jspdf';
import { Industry, Region } from '@/utils/types';

/**
 * Add appendix page to extended audit report
 */
export const addAppendixPage = (
  doc: jsPDF,
  {
    documentName,
    industry,
    region,
    companyDetails
  }: {
    documentName: string;
    industry?: Industry | string;
    region?: Region;
    companyDetails?: any;
  }
) => {
  // Set page properties
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add background color
  doc.setFillColor(250, 250, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Add header
  doc.setFillColor(40, 80, 140);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('Appendix: Additional Information', pageWidth / 2, 13, { align: 'center' });
  
  // Add content
  let yPos = 40;
  doc.setTextColor(50, 50, 50);
  
  // Document information
  doc.setFontSize(12);
  doc.text('Document Information', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(10);
  doc.text(`Document Name: ${documentName}`, 25, yPos);
  yPos += 10;
  
  // Add industry information if available
  if (industry) {
    doc.text(`Industry: ${industry}`, 25, yPos);
    yPos += 10;
  }
  
  // Add region information if available
  if (region) {
    doc.text(`Region: ${region}`, 25, yPos);
    yPos += 10;
  }
  
  // Add organization information if available
  if (companyDetails?.companyName) {
    doc.text(`Organization: ${companyDetails.companyName}`, 25, yPos);
    yPos += 10;
  }
  
  yPos += 15;
  
  // Add relevant regulations section
  doc.setFontSize(12);
  doc.text('Relevant Regulations', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(10);
  
  // Display industry-specific regulations
  if (industry) {
    const industryText = `Industry regulations for ${industry} typically include standards for data protection, 
    information security, and compliance reporting. These may include industry-specific frameworks 
    and best practices for audit documentation and record-keeping.`;
    
    const industryLines = doc.splitTextToSize(industryText, pageWidth - 50);
    doc.text(industryLines, 25, yPos);
    yPos += industryLines.length * 7;
  }
  
  // Display region-specific regulations
  if (region) {
    yPos += 10;
    const regionText = `Regional requirements for ${region} include local privacy laws, data sovereignty regulations,
    and jurisdiction-specific reporting requirements. Organizations should ensure 
    compliance with these regional standards in addition to industry frameworks.`;
    
    const regionLines = doc.splitTextToSize(regionText, pageWidth - 50);
    doc.text(regionLines, 25, yPos);
  }
  
  // Add footer
  doc.setDrawColor(40, 80, 140);
  doc.setLineWidth(1);
  doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
  
  // Add page number
  doc.setFontSize(8);
  doc.text('Appendix Page', pageWidth - 25, pageHeight - 10);
};
