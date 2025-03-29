
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
  pdf.text('CompliZen Cookie Policy', 20, 20);
  
  // Date
  pdf.setFontSize(FONT_SIZES.BODY);
  const secondaryColor = COLORS.SECONDARY;
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  pdf.text(`Last Updated: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Content
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  const textColor = COLORS.TEXT;
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('1. What Are Cookies', 20, 45);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Cookies are small text files that are stored on your computer or mobile device when you', 20, 55);
  pdf.text('visit a website. They allow the website to recognize your device and remember information', 20, 63);
  pdf.text('about your visit, such as your preferences and settings.', 20, 71);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('2. How We Use Cookies', 20, 86);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('CompliZen uses cookies to improve your experience on our platform in various ways:', 20, 96);
  pdf.text('• Essential cookies: Required for the basic functions of our website to work properly.', 20, 106);
  pdf.text('• Analytical cookies: Help us understand how visitors interact with our website.', 20, 114);
  pdf.text('• Functional cookies: Remember your preferences to provide enhanced functionality.', 20, 122);
  pdf.text('• Targeting cookies: Record your visit, pages visited, and links followed for marketing.', 20, 130);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('3. Types of Cookies We Use', 20, 145);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('We use the following types of cookies on our website:', 20, 155);
  pdf.text('• Session cookies: Temporary cookies that expire when you close your browser.', 20, 163);
  pdf.text('• Persistent cookies: Remain on your device for a specified period or until manually deleted.', 20, 171);
  pdf.text('• First-party cookies: Set by our website domain.', 20, 179);
  pdf.text('• Third-party cookies: Set by other domains that provide services on our website.', 20, 187);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('4. Managing Cookies', 20, 202);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('You can control and manage cookies in various ways. Most web browsers allow you to manage', 20, 212);
  pdf.text('your cookie preferences. You can:', 20, 220);
  
  pdf.addPage();
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('• Delete cookies from your device', 20, 20);
  pdf.text('• Block cookies by activating browser settings that allow you to refuse cookies', 20, 28);
  pdf.text('• Set your browser to notify you when you receive a cookie', 20, 36);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('5. Changes to Our Cookie Policy', 20, 51);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('We may update our Cookie Policy from time to time. Any changes will be posted on this page with', 20, 61);
  pdf.text('an updated revision date. We encourage you to review this policy periodically to stay informed', 20, 69);
  pdf.text('about how we are using cookies.', 20, 77);
  
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('6. Consent', 20, 92);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('By using our website, you consent to our use of cookies in accordance with this Cookie Policy.', 20, 102);
  pdf.text('If you do not agree, you can adjust your browser settings to decline cookies, but this may', 20, 110);
  pdf.text('affect your ability to use some features of our website.', 20, 118);
  
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
