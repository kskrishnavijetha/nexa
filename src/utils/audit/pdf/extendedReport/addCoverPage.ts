
import { jsPDF } from 'jspdf';
import { formatDate } from '@/components/audit/auditUtils';
import { Industry } from '@/utils/types';
import { Region } from '@/utils/types/common';

/**
 * Add cover page to the extended audit report
 */
export const addCoverPage = (
  doc: jsPDF,
  {
    documentName,
    companyDetails,
    industry,
    verificationMetadata,
    region
  }: {
    documentName: string;
    companyDetails?: any;
    industry?: string;
    verificationMetadata: any;
    region?: Region;
  }
) => {
  // Set page properties
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add background color/gradient
  doc.setFillColor(240, 245, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Add header color block
  doc.setFillColor(25, 65, 120);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Add company logo if provided
  if (companyDetails?.logo) {
    try {
      doc.addImage(
        companyDetails.logo, 
        'JPEG', 
        pageWidth - 60, 
        10, 
        50, 
        25, 
        undefined, 
        'FAST'
      );
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
    }
  }
  
  // Add report title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Extended Audit-Ready Compliance Report', 20, 25);
  
  // Add company name
  doc.setTextColor(25, 65, 120);
  doc.setFontSize(22);
  doc.text(
    companyDetails?.companyName || 'Your Organization',
    pageWidth / 2,
    80,
    { align: 'center' }
  );
  
  // Add compliance type
  doc.setFontSize(18);
  doc.text(
    companyDetails?.complianceType || 'Compliance Framework',
    pageWidth / 2,
    100,
    { align: 'center' }
  );
  
  // Add document name
  doc.setFontSize(16);
  doc.text(
    `Document: ${documentName}`,
    pageWidth / 2,
    120,
    { align: 'center' }
  );
  
  // Add industry if available - use company details first, then fallback to parameter
  const industryToShow = companyDetails?.industry || industry;
  if (industryToShow) {
    doc.setFontSize(14);
    doc.text(
      `Industry: ${industryToShow}`,
      pageWidth / 2,
      135,
      { align: 'center' }
    );
  }
  
  // Add region if available - use company details first, then fallback to parameter
  const regionToShow = companyDetails?.region || region;
  if (regionToShow) {
    doc.setFontSize(14);
    doc.text(
      `Region: ${regionToShow}`,
      pageWidth / 2,
      145,
      { align: 'center' }
    );
  }
  
  // Add contact information if provided
  if (companyDetails?.contactName) {
    let yPos = 165;
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Contact: ${companyDetails.contactName}`, pageWidth / 2, yPos, { align: 'center' });
    
    if (companyDetails?.designation) {
      yPos += 10;
      doc.text(`Designation: ${companyDetails.designation}`, pageWidth / 2, yPos, { align: 'center' });
    }
    
    if (companyDetails?.email) {
      yPos += 10;
      doc.text(`Email: ${companyDetails.email}`, pageWidth / 2, yPos, { align: 'center' });
    }
    
    if (companyDetails?.phone) {
      yPos += 10;
      doc.text(`Phone: ${companyDetails.phone}`, pageWidth / 2, yPos, { align: 'center' });
    }
  }
  
  // Add date and version
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(
    `Report Date: ${formatDate(new Date().toISOString())}`,
    pageWidth / 2,
    220,
    { align: 'center' }
  );
  
  doc.setFontSize(12);
  doc.text(
    `Version: 1.0`,
    pageWidth / 2,
    230,
    { align: 'center' }
  );
  
  // Add verification hash
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Document ID: ${verificationMetadata.shortHash}`,
    pageWidth / 2,
    pageHeight - 20,
    { align: 'center' }
  );
  
  // Add footer
  doc.setDrawColor(25, 65, 120);
  doc.setLineWidth(1);
  doc.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);
  
  // Add page number
  doc.setFontSize(8);
  doc.text(
    'Page 1',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
};
