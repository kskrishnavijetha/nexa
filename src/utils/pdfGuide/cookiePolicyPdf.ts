
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
  pdf.text('Nexabloom is committed to user privacy and data protection. We operate with a strict', 20, 55);
  pdf.text('no-cookie policy, which means we do not use cookies or similar tracking technologies', 20, 63);
  pdf.text('to collect or store information about your browsing activities on our website.', 20, 71);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('2. What Are Cookies', 20, 86);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Cookies are small text files that websites place on your device to store information about', 20, 96);
  pdf.text('your browsing session, preferences, or activity. They are commonly used across the web to', 20, 104);
  pdf.text('remember user preferences, authenticate users, and collect analytics data.', 20, 112);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('3. Our Approach to Privacy', 20, 127);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Instead of using cookies, our platform operates by processing information locally on your', 20, 137);
  pdf.text('device. We have designed our service to function without the need to track user activity', 20, 145);
  pdf.text('or store persistent identifiers on your browser. Your privacy is our priority.', 20, 153);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('4. Essential Technical Functions', 20, 168);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('While we do not use cookies for tracking or marketing purposes, your browser may store', 20, 178);
  pdf.text('temporary session information that is necessary for the basic functionality of our website.', 20, 186);
  pdf.text('This information is not used to identify you and is deleted when you close your browser.', 20, 194);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('5. Third-Party Services', 20, 209);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('If you choose to use third-party integrations with our platform (such as payment processors', 20, 219);
  pdf.text('or external authentication services), those services may use their own cookies according to', 20, 227);
  
  pdf.addPage();
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('their respective privacy policies. We encourage you to review the privacy policies of any', 20, 20);
  pdf.text('third-party services you connect to our platform.', 20, 28);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('6. Your Browser Settings', 20, 43);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Most web browsers allow you to control cookies through their settings preferences. You can', 20, 53);
  pdf.text('typically delete cookies and set your browser to block or notify you when cookies are being', 20, 61);
  pdf.text('sent to your device. However, as we do not use cookies, changing these settings will not', 20, 69);
  pdf.text('affect your experience on our platform.', 20, 77);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('7. Changes to This Policy', 20, 92);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('We may update our Cookie Policy from time to time to reflect changes in technology, regulation,', 20, 102);
  pdf.text('or our business practices. We will notify you of any changes by posting the new policy on our', 20, 110);
  pdf.text('website and updating the "Last Updated" date.', 20, 118);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('8. Contact Us', 20, 133);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('If you have any questions or concerns about our Cookie Policy or privacy practices, please', 20, 143);
  pdf.text('contact us at: contact@nexabloom.xyz', 20, 151);
  
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
