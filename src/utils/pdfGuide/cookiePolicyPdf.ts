
import { jsPDF } from 'jspdf';
import { FONT_SIZES, COLORS } from './pdfConstants';
import { addFooter } from '../audit/pdf/addFooter';

/**
 * Generates a PDF with the cookie policy content
 */
export const generateCookiePolicyPdf = (): Blob => {
  const pdf = new jsPDF();
  
  // Title
  pdf.setFontSize(FONT_SIZES.TITLE);
  const primaryColor = COLORS.PRIMARY;
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text('Nexabloom Cookie Policy', 20, 20);
  
  // Date
  pdf.setFontSize(FONT_SIZES.BODY);
  const secondaryColor = COLORS.SECONDARY;
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  pdf.text(`Last Updated: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Content
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  const textColor = COLORS.TEXT;
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('1. Our No-Cookie Policy', 20, 45);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('At Nexabloom, we prioritize your privacy and data protection. Our website does not use', 20, 55);
  pdf.text('cookies, web beacons, tracking pixels, or similar technologies that collect or track your', 20, 63);
  pdf.text('personal information or browsing behavior.', 20, 71);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('2. What Are Cookies?', 20, 86);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Cookies are small text files that websites place on your device to store information about', 20, 96);
  pdf.text('your preferences, login status, browsing history, or other data. They are commonly used to', 20, 104);
  pdf.text('enhance user experience and collect data for analytics and marketing purposes.', 20, 112);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('3. Why We Don\'t Use Cookies', 20, 127);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('We believe that your privacy is paramount. By not using cookies, we ensure that your', 20, 137);
  pdf.text('browsing behavior on our site is not tracked, stored, or analyzed. This approach aligns with', 20, 145);
  pdf.text('our commitment to privacy and data minimization.', 20, 153);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('4. Essential Functions Without Cookies', 20, 168);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Our platform is designed to provide all essential functions without relying on cookies.', 20, 178);
  pdf.text('We use alternative technologies that don\'t compromise your privacy while still delivering', 20, 186);
  pdf.text('a seamless user experience.', 20, 194);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('5. Third-Party Services', 20, 209);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('If you choose to use integrations with third-party services through our platform, please be', 20, 219);
  pdf.text('aware that those third parties may use cookies according to their own policies. We encourage', 20, 227);
  pdf.text('you to review the privacy and cookie policies of any third-party services you connect to.', 20, 235);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('6. Changes to This Cookie Policy', 20, 250);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('We may update our Cookie Policy from time to time. We will notify you of any changes by', 20, 260);
  pdf.text('posting the new policy on this page and updating the "Last Updated" date.', 20, 268);
  
  pdf.addPage();
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('7. Contact Us', 20, 20);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('If you have any questions about our cookie practices, please contact us at:', 20, 30);
  pdf.text('contact@nexabloom.com', 20, 38);
  
  // Add footer with page numbers
  addFooter(pdf);
  
  return pdf.output('blob');
};

/**
 * Get a download URL for the cookie policy PDF
 */
export const getCookiePolicyPdfUrl = (): string => {
  const pdfBlob = generateCookiePolicyPdf();
  return URL.createObjectURL(pdfBlob);
};
