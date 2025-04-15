
import { jsPDF } from 'jspdf';
import { CompanyDetails } from '@/components/audit/types';

interface ElectronicSignatureProps {
  documentName: string;
  companyDetails?: CompanyDetails;
}

/**
 * Add an electronic signature page to the extended audit report
 */
export const addElectronicSignaturePage = (
  pdf: jsPDF,
  props: ElectronicSignatureProps
): void => {
  // Set up page title
  pdf.setFontSize(16);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Electronic Signature & Certification', 20, 30);
  
  // Add horizontal line
  pdf.setDrawColor(0, 51, 102);
  pdf.setLineWidth(0.5);
  pdf.line(20, 34, 190, 34);
  
  // Add description text
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  let yPos = 45;
  
  pdf.text('This document is electronically certified by:', 20, yPos);
  yPos += 15;
  
  // Add signature box
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.2);
  pdf.rect(20, yPos, 170, 40);
  yPos += 10;
  
  // Add signature details
  const companyName = props.companyDetails?.companyName || 'Compliance Officer';
  // Use the contactName or designation property which exists in the CompanyDetails interface
  // instead of authorizedName which doesn't exist
  const authorizedName = props.companyDetails?.contactName || 
                         props.companyDetails?.designation || 
                         'Authorized Signatory';
  
  pdf.setFontSize(12);
  pdf.text(`${companyName}`, 105, yPos, { align: 'center' });
  yPos += 8;
  
  pdf.setFontSize(10);
  pdf.text(`Authorized Representative: ${authorizedName}`, 105, yPos, { align: 'center' });
  yPos += 6;
  
  // Add date
  const currentDate = new Date().toLocaleDateString();
  pdf.text(`Date: ${currentDate}`, 105, yPos, { align: 'center' });
  yPos += 6;
  
  // Add electronic verification text
  pdf.text(`Document: ${props.documentName}`, 105, yPos, { align: 'center' });
  yPos += 25;
  
  // Add legal disclaimer for electronic signature
  pdf.setFontSize(9);
  pdf.setTextColor(80, 80, 80);
  
  const disclaimer = [
    'This document has been electronically certified in accordance with applicable regulations. Electronic signatures on',
    'this document are as legally binding as a physical signature. This certification confirms that the contents of this',
    'compliance report have been reviewed and approved by the authorized representative of the reporting organization.',
    'Any unauthorized modification or tampering with this certification constitutes fraud.'
  ];
  
  disclaimer.forEach(line => {
    pdf.text(line, 20, yPos);
    yPos += 5;
  });
  
  // Add verification box
  yPos += 10;
  pdf.setDrawColor(0, 51, 102);
  pdf.setFillColor(245, 247, 250);
  pdf.rect(20, yPos, 170, 30, 'FD');
  yPos += 10;
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Electronic Verification Statement', 105, yPos, { align: 'center' });
  yPos += 7;
  
  pdf.setFontSize(8);
  pdf.setTextColor(0, 0, 0);
  pdf.text('By receiving this document, you can verify its authenticity and integrity through the verification hash', 105, yPos, { align: 'center' });
  yPos += 5;
  pdf.text('provided in the Integrity Verification page of this report.', 105, yPos, { align: 'center' });
};
