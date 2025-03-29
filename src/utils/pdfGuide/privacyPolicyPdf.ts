
import { jsPDF } from 'jspdf';
import { FONT_SIZES, COLORS } from './pdfConstants';
import { addFooter } from '../audit/pdf/addFooter';

/**
 * Generates a PDF with the privacy policy content
 */
export const generatePrivacyPolicyPdf = (): Blob => {
  const pdf = new jsPDF();
  
  // Title
  pdf.setFontSize(FONT_SIZES.TITLE);
  const primaryColor = COLORS.PRIMARY;
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text('CompliZen Privacy Policy', 20, 20);
  
  // Date
  pdf.setFontSize(FONT_SIZES.BODY);
  const secondaryColor = COLORS.SECONDARY;
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  pdf.text(`Last Updated: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Content
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  const textColor = COLORS.TEXT;
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('1. Introduction', 20, 45);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('CompliZen ("we", "our", or "us") is committed to protecting your privacy. This Privacy', 20, 55);
  pdf.text('Policy explains how we collect, use, disclose, and safeguard your information when', 20, 63);
  pdf.text('you use our compliance automation platform and related services.', 20, 71);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('2. Information We Collect', 20, 86);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('We may collect information about you in various ways, including:', 20, 96);
  pdf.text('• Personal Information: Name, email address, phone number, and billing information.', 20, 106);
  pdf.text('• Usage Data: Information on how you use our platform, features accessed, and time spent.', 20, 114);
  pdf.text('• Compliance Documents: Documents you upload for analysis and compliance assessment.', 20, 122);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('3. How We Use Your Information', 20, 137);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('We use the information we collect for various purposes, including:', 20, 147);
  pdf.text('• To provide and maintain our services.', 20, 155);
  pdf.text('• To process payments and send invoices.', 20, 163);
  pdf.text('• To improve and personalize your experience.', 20, 171);
  pdf.text('• To communicate with you about service updates and offers.', 20, 179);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('4. Data Security', 20, 194);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('We implement appropriate technical and organizational measures to protect the security', 20, 204);
  pdf.text('of your personal information. However, no method of transmission over the Internet or', 20, 212);
  pdf.text('electronic storage is 100% secure, so we cannot guarantee absolute security.', 20, 220);
  
  pdf.addPage();
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('5. Your Rights', 20, 20);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Depending on your location, you may have certain rights regarding your personal information:', 20, 30);
  pdf.text('• Access and receive a copy of your data.', 20, 38);
  pdf.text('• Rectify inaccurate or incomplete information.', 20, 46);
  pdf.text('• Request deletion of your personal data.', 20, 54);
  pdf.text('• Restrict or object to our processing of your data.', 20, 62);
  pdf.text('• Data portability rights.', 20, 70);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('6. Third-Party Services', 20, 85);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Our services may contain links to third-party websites and services. We are not responsible', 20, 95);
  pdf.text('for the content or privacy practices of these third parties. We encourage you to read the', 20, 103);
  pdf.text('privacy policies of any third-party services you access through our platform.', 20, 111);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('7. Changes to This Privacy Policy', 20, 126);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('We may update our Privacy Policy from time to time. We will notify you of any changes by', 20, 136);
  pdf.text('posting the new Privacy Policy on this page and updating the "Last Updated" date.', 20, 144);
  
  // Removed the "8. Contact Us" section as requested
  
  // Add footer with page numbers
  addFooter(pdf);
  
  return pdf.output('blob');
};

/**
 * Get a download URL for the privacy policy PDF
 */
export const getPrivacyPolicyPdfUrl = (): string => {
  const pdfBlob = generatePrivacyPolicyPdf();
  return URL.createObjectURL(pdfBlob);
};
