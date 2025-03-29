
import { jsPDF } from 'jspdf';
import { FONT_SIZES, COLORS } from './pdfConstants';

/**
 * Adds the industry-specific features section to the PDF
 */
export const addIndustryFeatures = (pdf: jsPDF): void => {
  // Add page
  pdf.addPage();
  
  // Title
  pdf.setFontSize(FONT_SIZES.SUB_SECTION);
  const primaryColor = COLORS.PRIMARY;
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text('Industry-Specific Functions and Features', 20, 20);
  
  // Finance & Banking
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  const textColor = COLORS.TEXT;
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('Finance & Banking', 20, 40);
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Features:', 20, 50);
  pdf.text('• Automated KYC/AML compliance monitoring', 20, 60);
  pdf.text('• Transaction pattern analysis for fraud detection', 20, 70);
  pdf.text('• Financial regulation compliance assessment', 20, 80);
  
  pdf.text('Applicable Regulations:', 20, 95);
  pdf.text('• PCI-DSS (Payment Card Industry Data Security Standard)', 20, 105);
  pdf.text('• GDPR (General Data Protection Regulation) for customer data', 20, 115);
  pdf.text('• SOC 2 (Service Organization Control) for service providers', 20, 125);
  pdf.text('• ISO/IEC 27001 for information security management', 20, 135);
  
  // Healthcare
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('Healthcare', 20, 155);
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Features:', 20, 165);
  pdf.text('• Protected Health Information (PHI) security assessments', 20, 175);
  pdf.text('• Medical records compliance verification', 20, 185);
  pdf.text('• Patient data access controls and monitoring', 20, 195);
  
  pdf.text('Applicable Regulations:', 20, 210);
  pdf.text('• HIPAA (Health Insurance Portability and Accountability Act)', 20, 220);
  pdf.text('• GDPR for patient data in EU jurisdictions', 20, 230);
  pdf.text('• ISO/IEC 27001 for general information security', 20, 240);
  
  // Cloud & SaaS
  pdf.addPage();
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('Cloud & SaaS', 20, 20);
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Features:', 20, 30);
  pdf.text('• Cloud infrastructure security assessment', 20, 40);
  pdf.text('• Data storage compliance verification', 20, 50);
  pdf.text('• API security and access control analysis', 20, 60);
  
  pdf.text('Applicable Regulations:', 20, 75);
  pdf.text('• SOC 2 for service providers', 20, 85);
  pdf.text('• GDPR for data processing operations', 20, 95);
  pdf.text('• ISO/IEC 27001 for information security', 20, 105);
  
  // E-commerce & Retail
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('E-commerce & Retail', 20, 125);
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Features:', 20, 135);
  pdf.text('• Customer data protection compliance', 20, 145);
  pdf.text('• Payment processing security verification', 20, 155);
  pdf.text('• Cookie and tracking technology compliance', 20, 165);
  
  pdf.text('Applicable Regulations:', 20, 180);
  pdf.text('• PCI-DSS for payment processing', 20, 190);
  pdf.text('• GDPR for EU customer data', 20, 200);
  pdf.text('• CCPA (California Consumer Privacy Act) for California residents', 20, 210);
};
