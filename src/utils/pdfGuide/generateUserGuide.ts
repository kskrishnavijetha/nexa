
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
import { addFooter } from '../audit/pdf/addFooter';

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
  pdf.text('Nexabloom User Guide', 20, PDF_POSITIONS.TITLE_Y);
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
  pdf.text('Welcome to Nexabloom - your AI-powered compliance automation platform. This guide', 20, PDF_POSITIONS.INTRO_TEXT_1_Y);
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
  
  // Add legal disclaimer on the last page
  pdf.addPage();
  
  // Legal Disclaimer
  pdf.setFontSize(FONT_SIZES.SECTION_TITLE);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('Legal Disclaimer', 20, 20);
  
  pdf.setFontSize(FONT_SIZES.BODY);
  pdf.text('This user guide and the Nexabloom platform are provided for informational purposes only.', 20, 35);
  pdf.text('The information contained in this guide does not constitute legal advice, and should not be', 20, 43);
  pdf.text('relied upon as such. Nexabloom is a compliance assistance tool, but it is not a substitute', 20, 51);
  pdf.text('for professional legal consultation or advice.', 20, 59);
  
  pdf.text('Compliance regulations vary by jurisdiction and industry, and are subject to frequent changes.', 20, 74);
  pdf.text('It is the responsibility of the user to verify all information and seek appropriate legal', 20, 82);
  pdf.text('counsel for their specific situation.', 20, 90);
  
  pdf.text('Nexabloom makes no warranties, express or implied, regarding the accuracy, completeness,', 20, 105);
  pdf.text('timeliness, or reliability of the information provided through the platform. The use of the', 20, 113);
  pdf.text('Nexabloom platform does not create an attorney-client relationship between the user and', 20, 121);
  pdf.text('Nexabloom or its affiliates.', 20, 129);
  
  // Add footer with page numbers, logo, and disclaimer
  addFooter(pdf);
  
  // Return the PDF as a blob
  return pdf.output('blob');
};
