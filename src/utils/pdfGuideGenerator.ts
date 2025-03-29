
import { jsPDF } from 'jspdf';
import { INDUSTRY_REGULATIONS, REGION_REGULATIONS } from './types';

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
  
  // Industry-Specific Functions and Features
  pdf.addPage();
  pdf.setFontSize(20);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Industry-Specific Functions and Features', 20, 20);
  
  // Finance & Banking
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Finance & Banking', 20, 40);
  pdf.setFontSize(12);
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
  pdf.setFontSize(16);
  pdf.text('Healthcare', 20, 155);
  pdf.setFontSize(12);
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
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Cloud & SaaS', 20, 20);
  pdf.setFontSize(12);
  pdf.text('Features:', 20, 30);
  pdf.text('• Cloud infrastructure security assessment', 20, 40);
  pdf.text('• Data storage compliance verification', 20, 50);
  pdf.text('• API security and access control analysis', 20, 60);
  
  pdf.text('Applicable Regulations:', 20, 75);
  pdf.text('• SOC 2 for service providers', 20, 85);
  pdf.text('• GDPR for data processing operations', 20, 95);
  pdf.text('• ISO/IEC 27001 for information security', 20, 105);
  
  // E-commerce & Retail
  pdf.setFontSize(16);
  pdf.text('E-commerce & Retail', 20, 125);
  pdf.setFontSize(12);
  pdf.text('Features:', 20, 135);
  pdf.text('• Customer data protection compliance', 20, 145);
  pdf.text('• Payment processing security verification', 20, 155);
  pdf.text('• Cookie and tracking technology compliance', 20, 165);
  
  pdf.text('Applicable Regulations:', 20, 180);
  pdf.text('• PCI-DSS for payment processing', 20, 190);
  pdf.text('• GDPR for EU customer data', 20, 200);
  pdf.text('• CCPA (California Consumer Privacy Act) for California residents', 20, 210);
  
  // Regional Regulations
  pdf.addPage();
  pdf.setFontSize(20);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Regional Regulations and Compliance Features', 20, 20);
  
  // United States
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('United States', 20, 40);
  pdf.setFontSize(12);
  pdf.text('Key Regulations:', 20, 50);
  pdf.text('• CCPA (California Consumer Privacy Act)', 20, 60);
  pdf.text('• HIPAA (Health Insurance Portability and Accountability Act)', 20, 70);
  pdf.text('• SOX (Sarbanes-Oxley Act) for financial reporting', 20, 80);
  
  pdf.text('CompliZen Features for US Regulations:', 20, 95);
  pdf.text('• State-by-state privacy law compliance monitoring', 20, 105);
  pdf.text('• CCPA-specific consent management', 20, 115);
  pdf.text('• US healthcare data handling assessments', 20, 125);
  
  // European Union
  pdf.setFontSize(16);
  pdf.text('European Union', 20, 145);
  pdf.setFontSize(12);
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
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('United Kingdom', 20, 20);
  pdf.setFontSize(12);
  pdf.text('Key Regulations:', 20, 30);
  pdf.text('• UK GDPR', 20, 40);
  pdf.text('• Data Protection Act 2018', 20, 50);
  pdf.text('• PECR (Privacy and Electronic Communications Regulations)', 20, 60);
  
  pdf.text('CompliZen Features for UK Regulations:', 20, 75);
  pdf.text('• UK-specific data protection compliance', 20, 85);
  pdf.text('• Post-Brexit data transfer assessments', 20, 95);
  pdf.text('• ICO regulatory alignment monitoring', 20, 105);
  
  // Asia Pacific
  pdf.setFontSize(16);
  pdf.text('Asia Pacific', 20, 125);
  pdf.setFontSize(12);
  pdf.text('Key Regulations:', 20, 135);
  pdf.text('• China\'s PIPL (Personal Information Protection Law)', 20, 145);
  pdf.text('• Japan\'s APPI (Act on Protection of Personal Information)', 20, 155);
  pdf.text('• Australia\'s Privacy Act', 20, 165);
  pdf.text('• Singapore\'s PDPA (Personal Data Protection Act)', 20, 175);
  
  pdf.text('CompliZen Features for APAC Regulations:', 20, 190);
  pdf.text('• Multi-jurisdictional compliance assessments', 20, 200);
  pdf.text('• Data localization requirement verification', 20, 210);
  pdf.text('• Cross-border data transfer compliance for APAC regulations', 20, 220);
  
  // Global Compliance Framework
  pdf.addPage();
  pdf.setFontSize(20);
  pdf.setTextColor(0, 51, 102);
  pdf.text('Global Compliance Framework', 20, 20);
  
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text('CompliZen offers a unified global compliance framework that helps organizations', 20, 40);
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
  
  // Integrations Section
  pdf.addPage();
  pdf.setFontSize(16);
  pdf.text('Available Integrations', 20, 20);
  
  let integrationsYPos = 40;
  pdf.setFontSize(12);
  pdf.text('- Google Services (Drive, Gmail, Docs)', 20, integrationsYPos);
  pdf.text('- Slack', 20, integrationsYPos + 10);
  pdf.text('- Microsoft 365', 20, integrationsYPos + 20);
  pdf.text('- AWS, Azure, and other cloud platforms', 20, integrationsYPos + 30);
  
  // Pricing and Plans
  integrationsYPos += 50;
  pdf.setFontSize(16);
  pdf.text('Pricing Plans', 20, integrationsYPos);
  
  pdf.setFontSize(12);
  pdf.text('We offer multiple subscription tiers to fit your organization\'s needs:', 20, integrationsYPos + 10);
  pdf.text('- Free: Basic compliance scanning (1 scan per month)', 20, integrationsYPos + 20);
  pdf.text('- Basic: 10 scans per month with standard features', 20, integrationsYPos + 30);
  pdf.text('- Pro: 50 scans per month with advanced features and integrations', 20, integrationsYPos + 40);
  pdf.text('- Enterprise: Unlimited scans with all features and priority support', 20, integrationsYPos + 50);
  
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
