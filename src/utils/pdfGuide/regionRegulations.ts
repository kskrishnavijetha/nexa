
import { jsPDF } from 'jspdf';
import { FONT_SIZES, COLORS } from './pdfConstants';

/**
 * Adds the regional regulations section to the PDF
 */
export const addRegionalRegulations = (pdf: jsPDF): void => {
  // Add page
  pdf.addPage();
  
  // Title
  pdf.setFontSize(FONT_SIZES.SUB_SECTION);
  const primaryColor = COLORS.PRIMARY;
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text('Regional Regulations and Compliance Features', 20, 20);
  
  // United States
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  const textColor = COLORS.TEXT;
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('United States', 20, 40);
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Key Regulations:', 20, 50);
  pdf.text('• CCPA (California Consumer Privacy Act)', 20, 60);
  pdf.text('• HIPAA (Health Insurance Portability and Accountability Act)', 20, 70);
  pdf.text('• SOX (Sarbanes-Oxley Act) for financial reporting', 20, 80);
  
  pdf.text('CompliZen Features for US Regulations:', 20, 95);
  pdf.text('• State-by-state privacy law compliance monitoring', 20, 105);
  pdf.text('• CCPA-specific consent management', 20, 115);
  pdf.text('• US healthcare data handling assessments', 20, 125);
  
  // European Union
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('European Union', 20, 145);
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Key Regulations:', 20, 155);
  pdf.text('• GDPR (General Data Protection Regulation)', 20, 165);
  pdf.text('• ePrivacy Directive', 20, 175);
  pdf.text('• NIS2 Directive for cybersecurity', 20, 185);
  
  pdf.text('CompliZen Features for EU Regulations:', 20, 200);
  pdf.text('• Data subject rights management', 20, 210);
  pdf.text('• Data processing impact assessments', 20, 220);
  pdf.text('• Cross-border data transfer compliance', 20, 230);
  pdf.text('• Cookie consent management', 20, 240);
  
  // UK
  pdf.addPage();
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('United Kingdom', 20, 20);
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Key Regulations:', 20, 30);
  pdf.text('• UK GDPR', 20, 40);
  pdf.text('• Data Protection Act 2018', 20, 50);
  pdf.text('• PECR (Privacy and Electronic Communications Regulations)', 20, 60);
  
  pdf.text('CompliZen Features for UK Regulations:', 20, 75);
  pdf.text('• UK-specific data protection compliance', 20, 85);
  pdf.text('• Post-Brexit data transfer assessments', 20, 95);
  pdf.text('• ICO regulatory alignment monitoring', 20, 105);
  
  // Asia Pacific
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('Asia Pacific', 20, 125);
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Key Regulations:', 20, 135);
  pdf.text('• China\'s PIPL (Personal Information Protection Law)', 20, 145);
  pdf.text('• Japan\'s APPI (Act on Protection of Personal Information)', 20, 155);
  pdf.text('• Australia\'s Privacy Act', 20, 165);
  pdf.text('• Singapore\'s PDPA (Personal Data Protection Act)', 20, 175);
  
  pdf.text('CompliZen Features for APAC Regulations:', 20, 190);
  pdf.text('• Multi-jurisdictional compliance assessments', 20, 200);
  pdf.text('• Data localization requirement verification', 20, 210);
  pdf.text('• Cross-border data transfer compliance for APAC regulations', 20, 220);
};
