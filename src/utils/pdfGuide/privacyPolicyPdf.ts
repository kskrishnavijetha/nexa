
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
  pdf.text('Nexabloom Privacy Policy', 20, 20);
  
  // Date
  pdf.setFontSize(FONT_SIZES.BODY);
  const secondaryColor = COLORS.SECONDARY;
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  pdf.text(`Last Updated: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Content
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  const textColor = COLORS.TEXT;
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('1. Our No-Data Collection Policy', 20, 45);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('At Nexabloom, we are committed to your privacy. We have designed our services to operate', 20, 55);
  pdf.text('without collecting your personal data. We do not track, store, or process any personal', 20, 63);
  pdf.text('information from our users.', 20, 71);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('2. How Our Service Works Without Data Collection', 20, 86);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Our compliance platform operates entirely on your device. Any analysis of your documents', 20, 96);
  pdf.text('or compliance evaluations are performed locally, and we never transmit or store your', 20, 104);
  pdf.text('information on our servers. Your documents remain solely in your possession.', 20, 112);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('3. Cookies and Tracking', 20, 127);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('We do not use cookies, web beacons, or similar technologies to track your usage of our', 20, 137);
  pdf.text('service. Our website does not include any third-party analytics or tracking code.', 20, 145);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('4. Third-Party Services', 20, 160);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('While we do not collect your data, if you choose to use third-party integrations (such as', 20, 170);
  pdf.text('connecting to Google services), those third parties may collect information according to', 20, 178);
  pdf.text('their own privacy policies. We encourage you to review the privacy policies of any', 20, 186);
  pdf.text('third-party services you connect to our platform.', 20, 194);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('5. Changes to This Privacy Policy', 20, 209);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('We may update our Privacy Policy from time to time. We will notify you of any changes by', 20, 219);
  pdf.text('posting the new Privacy Policy on this page and updating the "Last Updated" date.', 20, 227);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('6. Contact Us', 20, 242);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('If you have any questions about our privacy practices, please contact us at:', 20, 252);
  pdf.text('contact@nexabloom.xyz', 20, 260);
  
  // Add legal disclaimer before the footer
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('7. Legal Disclaimer', 20, 275);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('This tool is not a substitute for professional legal consultation. Always seek qualified', 20, 285);
  pdf.text('legal advice for your specific situation.', 20, 293);
  
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
