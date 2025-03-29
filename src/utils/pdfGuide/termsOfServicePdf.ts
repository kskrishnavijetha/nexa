
import { jsPDF } from 'jspdf';
import { FONT_SIZES, COLORS } from './pdfConstants';
import { addFooter } from '../audit/pdf/addFooter';

/**
 * Generates a PDF with the terms of service content
 */
export const generateTermsOfServicePdf = (): Blob => {
  const pdf = new jsPDF();
  
  // Title
  pdf.setFontSize(FONT_SIZES.TITLE);
  const primaryColor = COLORS.PRIMARY;
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text('CompliZen Terms of Service', 20, 20);
  
  // Date
  pdf.setFontSize(FONT_SIZES.BODY);
  const secondaryColor = COLORS.SECONDARY;
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  pdf.text(`Last Updated: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Content
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  const textColor = COLORS.TEXT;
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('1. Acceptance of Terms', 20, 45);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('By accessing or using CompliZen ("the Service"), you agree to be bound by these Terms of', 20, 55);
  pdf.text('Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.', 20, 63);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('2. Description of Service', 20, 78);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('CompliZen provides an AI-powered compliance automation platform that helps organizations', 20, 88);
  pdf.text('comply with various regulations. Our services include compliance scanning, document analysis,', 20, 96);
  pdf.text('policy generation, risk monitoring, and compliance reporting.', 20, 104);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('3. Account Terms', 20, 119);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('You are responsible for maintaining the security of your account and password. The company', 20, 129);
  pdf.text('cannot and will not be liable for any loss or damage from your failure to comply with this', 20, 137);
  pdf.text('security obligation. You are responsible for all content posted and activity that occurs under', 20, 145);
  pdf.text('your account.', 20, 153);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('4. Payment Terms', 20, 168);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('The Service is offered on a subscription basis. Paid plans are billed in advance on a monthly', 20, 178);
  pdf.text('or annual basis. There will be no refunds for upgrade or downgrade of service, or for unused', 20, 186);
  pdf.text('portions of a subscription period.', 20, 194);
  
  pdf.addPage();
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('5. Cancellation and Termination', 20, 20);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('You are solely responsible for properly canceling your account. An email or phone request to', 20, 30);
  pdf.text('cancel your account is not considered cancellation. You can cancel your account at any time', 20, 38);
  pdf.text('through the account settings page. All of your content will be immediately deleted from the', 20, 46);
  pdf.text('Service upon cancellation.', 20, 54);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('6. Data Protection and Privacy', 20, 69);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('CompliZen will make commercially reasonable efforts to protect customer data. We process your', 20, 79);
  pdf.text('data in accordance with our Privacy Policy. By using our services, you acknowledge that you have', 20, 87);
  pdf.text('read and understand our Privacy Policy.', 20, 95);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('7. Intellectual Property', 20, 110);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('The Service and its original content, features, and functionality are owned by CompliZen and', 20, 120);
  pdf.text('are protected by international copyright, trademark, patent, trade secret, and other', 20, 128);
  pdf.text('intellectual property or proprietary rights laws.', 20, 136);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('8. Limitation of Liability', 20, 151);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('In no event shall CompliZen, nor its directors, employees, partners, agents, suppliers, or', 20, 161);
  pdf.text('affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,', 20, 169);
  pdf.text('including without limitation, loss of profits, data, use, goodwill, or other intangible losses.', 20, 177);
  
  // Add footer with page numbers
  addFooter(pdf);
  
  return pdf.output('blob');
};

/**
 * Get a download URL for the terms of service PDF
 */
export const getTermsOfServicePdfUrl = (): string => {
  const pdfBlob = generateTermsOfServicePdf();
  return URL.createObjectURL(pdfBlob);
};
