
import { jsPDF } from 'jspdf';
import { FONT_SIZES, COLORS, INTEGRATIONS, PRICING_PLANS } from './pdfConstants';

/**
 * Adds the integrations and pricing sections to the PDF
 */
export const addIntegrationsAndPricing = (pdf: jsPDF): void => {
  // Add page
  pdf.addPage();
  
  // Integrations Section
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('Available Integrations', 20, 20);
  
  let integrationsYPos = 40;
  pdf.setFontSize(FONT_SIZES.BODY);
  
  // Add integrations
  INTEGRATIONS.forEach((integration, index) => {
    pdf.text(`- ${integration}`, 20, integrationsYPos + (index * 10));
  });
  
  // Pricing and Plans
  integrationsYPos += 50;
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('Pricing Plans', 20, integrationsYPos);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('We offer multiple subscription tiers to fit your organization\'s needs:', 20, integrationsYPos + 10);
  
  // Add pricing plans
  PRICING_PLANS.forEach((plan, index) => {
    pdf.text(`- ${plan}`, 20, integrationsYPos + 20 + (index * 10));
  });
};
