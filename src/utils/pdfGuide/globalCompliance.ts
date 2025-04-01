
import { jsPDF } from 'jspdf';
import { FONT_SIZES, COLORS } from './pdfConstants';

/**
 * Adds the global compliance framework section to the PDF
 */
export const addGlobalComplianceFramework = (pdf: jsPDF): void => {
  // Add page
  pdf.addPage();
  
  // Title
  pdf.setFontSize(FONT_SIZES.SUB_SECTION);
  const primaryColor = COLORS.PRIMARY;
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text('Global Compliance Framework', 20, 20);
  
  // Content
  pdf.setFontSize(FONT_SIZES.BODY);
  const textColor = COLORS.TEXT;
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('Nexabloom offers a unified global compliance framework that helps organizations', 20, 40);
  pdf.text('comply with regulations across multiple jurisdictions simultaneously:', 20, 50);
  
  let globalYPos = 70;
  pdf.text('• Regulatory Change Monitoring', 20, globalYPos);
  pdf.text('  - Real-time updates on changes to global regulations', 25, globalYPos + 10);
  pdf.text('  - Predictive analysis of upcoming regulatory changes', 25, globalYPos + 20);
  
  globalYPos += 35;
  pdf.text('• Cross-Regulation Mapping', 20, globalYPos);
  pdf.text('  - Identify overlapping compliance requirements', 25, globalYPos + 10);
  pdf.text('  - Eliminate redundant compliance efforts', 25, globalYPos + 20);
  
  globalYPos += 35;
  pdf.text('• Universal Control Framework', 20, globalYPos);
  pdf.text('  - Single set of controls mapped to multiple regulations', 25, globalYPos + 10);
  pdf.text('  - Simplified auditing and reporting across jurisdictions', 25, globalYPos + 20);
};
