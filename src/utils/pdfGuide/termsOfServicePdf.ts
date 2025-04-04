
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
  pdf.text('Nexabloom Terms of Service', 20, 20);
  
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
  pdf.text('By accessing or using Nexabloom ("the Service"), you agree to be bound by these Terms of', 20, 55);
  pdf.text('Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.', 20, 63);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('2. Description of Service', 20, 78);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Nexabloom provides an AI-powered compliance automation platform that helps organizations', 20, 88);
  pdf.text('comply with various regulations. Our services include compliance scanning, document analysis,', 20, 96);
  pdf.text('policy generation, risk monitoring, and compliance reporting.', 20, 104);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('3. No-Data Policy', 20, 119);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Nexabloom operates without collecting personal data. Our platform processes information', 20, 129);
  pdf.text('locally on your device. We do not store your documents, analysis results, or personal', 20, 137);
  pdf.text('information on our servers. Your privacy and data security are our top priorities.', 20, 145);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('4. Account Security', 20, 160);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('You are responsible for maintaining the security of your account credentials. Nexabloom cannot', 20, 170);
  pdf.text('and will not be liable for any loss or damage resulting from your failure to maintain account', 20, 178);
  pdf.text('security. You are responsible for all activities that occur under your account.', 20, 186);
  
  pdf.addPage();
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('5. Subscription Terms', 20, 20);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('The Service is offered on a subscription basis with various tiers. Paid plans are billed in', 20, 30);
  pdf.text('advance on a monthly or annual basis. We do not provide refunds for partial subscription', 20, 38);
  pdf.text('periods or unused services. You can cancel your subscription at any time through your account', 20, 46);
  pdf.text('settings.', 20, 54);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('6. Data Protection', 20, 69);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Nexabloom is committed to data protection through our no-data collection policy. We process', 20, 79);
  pdf.text('your documents in accordance with our Privacy Policy. By using our services, you acknowledge', 20, 87);
  pdf.text('that you have read and understand our Privacy Policy.', 20, 95);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('7. Intellectual Property', 20, 110);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('The Service and its original content, features, and functionality are owned by Nexabloom and', 20, 120);
  pdf.text('are protected by international copyright, trademark, patent, trade secret, and other', 20, 128);
  pdf.text('intellectual property or proprietary rights laws.', 20, 136);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('8. Limitation of Liability', 20, 151);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('In no event shall Nexabloom, nor its directors, employees, partners, agents, suppliers, or', 20, 161);
  pdf.text('affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,', 20, 169);
  pdf.text('including without limitation, loss of profits, data, use, goodwill, or other intangible losses.', 20, 177);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('9. Contact', 20, 192);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('If you have any questions about these Terms of Service, please contact us at:', 20, 202);
  pdf.text('contact@nexabloom.xyz', 20, 210);
  
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
