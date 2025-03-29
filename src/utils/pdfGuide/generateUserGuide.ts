
import { jsPDF } from 'jspdf';
import { INDUSTRY_REGULATIONS, REGION_REGULATIONS } from '../types';
import { 
  PDF_POSITIONS, 
  FONT_SIZES, 
  COLORS, 
  MAIN_FEATURES, 
  GETTING_STARTED_STEPS 
} from './pdfConstants';
import { addIndustryFeatures } from './industryFeatures';
import { addRegionalRegulations } from './regionRegulations';
import { addGlobalComplianceFramework } from './globalCompliance';
import { addIntegrationsAndPricing } from './integrationsAndPricing';

/**
 * Generates a PDF user guide explaining the app's features
 */
export const generateUserGuide = (): Blob => {
  const pdf = new jsPDF();
  
  // Set font size and styles
  pdf.setFontSize(FONT_SIZES.TITLE);
  const primaryColor = COLORS.PRIMARY;
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  
  // Title
  pdf.text('CompliZen User Guide', 20, PDF_POSITIONS.TITLE_Y);
  pdf.setFontSize(FONT_SIZES.BODY);
  const secondaryColor = COLORS.SECONDARY;
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, PDF_POSITIONS.DATE_Y);
  
  // Introduction
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  const textColor = COLORS.TEXT;
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('Introduction', 20, PDF_POSITIONS.INTRO_TITLE_Y);
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('Welcome to CompliZen - your AI-powered compliance automation platform. This guide', 20, PDF_POSITIONS.INTRO_TEXT_1_Y);
  pdf.text('will help you understand our main features and how to make the most of our platform.', 20, PDF_POSITIONS.INTRO_TEXT_2_Y);
  
  // Main Features Section
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('Key Features', 20, PDF_POSITIONS.FEATURES_TITLE_Y);
  
  // Features list
  let yPos = PDF_POSITIONS.FEATURES_START_Y;
  pdf.setFontSize(FONT_SIZES.BODY);
  MAIN_FEATURES.forEach((feature, index) => {
    pdf.text(`${index + 1}. ${feature}`, 20, yPos);
    yPos += 10;
  });
  
  // Getting Started Section
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.text('Getting Started', 20, yPos + PDF_POSITIONS.GETTING_STARTED_Y_OFFSET);
  
  yPos += 20;
  pdf.setFontSize(FONT_SIZES.BODY);
  GETTING_STARTED_STEPS.forEach((step, index) => {
    pdf.text(`${index + 1}. ${step}`, 20, yPos + (index * 10));
  });
  
  // Add industry-specific features
  addIndustryFeatures(pdf);
  
  // Add regional regulations
  addRegionalRegulations(pdf);
  
  // Add global compliance framework
  addGlobalComplianceFramework(pdf);
  
  // Add integrations and pricing
  addIntegrationsAndPricing(pdf);
  
  // Return the PDF as a blob
  return pdf.output('blob');
};
