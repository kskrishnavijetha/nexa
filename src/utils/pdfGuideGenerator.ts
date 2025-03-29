
import { jsPDF } from 'jspdf';

/**
 * Generates a PDF user guide explaining the app's features
 */
export const generateUserGuide = (): Blob => {
  const pdf = new jsPDF();
  
  // Set font size and styles
  pdf.setFontSize(22);
  pdf.setTextColor(0, 51, 102);
  
  // Title
  pdf.text('CompliZen User Guide', 20, 20);
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Introduction
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Introduction', 20, 45);
  pdf.setFontSize(12);
  pdf.text('Welcome to CompliZen - your AI-powered compliance automation platform. This guide', 20, 55);
  pdf.text('will help you understand our main features and how to make the most of our platform.', 20, 63);
  
  // Main Features Section
  pdf.setFontSize(16);
  pdf.text('Key Features', 20, 80);
  
  // Features list
  const features = [
    'AI-Powered Compliance Audits – Identify risks, missing policies & compliance gaps instantly',
    'Automated Policy Generation – Generate & update compliance documents for your industry',
    'Real-Time Risk Monitoring – Get alerts before compliance violations happen',
    'Smart Compliance Reporting – Auto-generate reports for regulators & audits',
    'Seamless Integrations – Works with AWS, Azure, Salesforce, and more'
  ];
  
  let yPos = 90;
  pdf.setFontSize(12);
  features.forEach((feature, index) => {
    pdf.text(`${index + 1}. ${feature}`, 20, yPos);
    yPos += 10;
  });
  
  // Getting Started Section
  pdf.setFontSize(16);
  pdf.text('Getting Started', 20, yPos + 10);
  
  yPos += 20;
  pdf.setFontSize(12);
  pdf.text('1. Sign up for an account or log in to your existing account', 20, yPos);
  pdf.text('2. Upload your compliance documents for analysis', 20, yPos + 10);
  pdf.text('3. Select your industry and relevant regulations', 20, yPos + 20);
  pdf.text('4. Receive an instant compliance assessment', 20, yPos + 30);
  pdf.text('5. Review risks and recommended actions', 20, yPos + 40);
  
  // Integrations Section
  yPos += 60;
  pdf.setFontSize(16);
  pdf.text('Available Integrations', 20, yPos);
  
  yPos += 10;
  pdf.setFontSize(12);
  pdf.text('- Google Services (Drive, Gmail, Docs)', 20, yPos + 10);
  pdf.text('- Slack', 20, yPos + 20);
  pdf.text('- Microsoft 365', 20, yPos + 30);
  pdf.text('- AWS, Azure, and other cloud platforms', 20, yPos + 40);
  
  // Pricing and Plans
  pdf.addPage();
  pdf.setFontSize(16);
  pdf.text('Pricing Plans', 20, 20);
  
  pdf.setFontSize(12);
  pdf.text('We offer multiple subscription tiers to fit your organization\'s needs:', 20, 30);
  pdf.text('- Free: Basic compliance scanning (1 scan per month)', 20, 40);
  pdf.text('- Basic: 10 scans per month with standard features', 20, 50);
  pdf.text('- Pro: 50 scans per month with advanced features and integrations', 20, 60);
  pdf.text('- Enterprise: Unlimited scans with all features and priority support', 20, 70);
  
  // Support Section
  pdf.setFontSize(16);
  pdf.text('Getting Support', 20, 90);
  
  pdf.setFontSize(12);
  pdf.text('If you need assistance, you can:', 20, 100);
  pdf.text('- Visit our comprehensive knowledge base', 20, 110);
  pdf.text('- Contact our support team via email at support@complizen.com', 20, 120);
  pdf.text('- Schedule a demo with one of our compliance experts', 20, 130);
  
  // Return the PDF as a blob
  return pdf.output('blob');
};

/**
 * Creates a download link for the user guide PDF
 */
export const getPdfDownloadUrl = (): string => {
  const pdfBlob = generateUserGuide();
  return URL.createObjectURL(pdfBlob);
};
