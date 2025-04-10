
import { Industry, Region } from '../../types';
import { SupportedLanguage } from '../../language';
import { requestComplianceCheck } from '../../complianceService';

// Helper function to generate compliance reports
export const generateComplianceReports = async (
  service: any,
  violationsCount: number,
  industry?: Industry,
  language?: SupportedLanguage,
  region?: Region
) => {
  const reports = [];
  
  console.log(`[generateComplianceReports] Generating reports for ${service.type} with selected industry: ${industry || 'unspecified'}`);
  
  for (let i = 0; i < violationsCount; i++) {
    // Create document names that better reflect the service type and industry context
    let docName = '';
    let serviceSpecificIndustryContext = '';
    
    if (industry) {
      // Add industry context to document name for better relevance
      switch(industry) {
        case 'Healthcare':
          serviceSpecificIndustryContext = ['Patient Records', 'Medical Report', 'HIPAA Compliance', 'Clinical Data'][i % 4];
          break;
        case 'Finance & Banking':
          serviceSpecificIndustryContext = ['Financial Report', 'Banking Statement', 'Investment Analysis', 'GLBA Compliance'][i % 4];
          break;
        case 'Retail & Consumer':
          serviceSpecificIndustryContext = ['Customer Data', 'Sales Report', 'Inventory Analysis', 'PCI Compliance'][i % 4];
          break;
        default:
          serviceSpecificIndustryContext = ['Compliance Report', 'Internal Document', 'Analysis Report', 'Regulatory Filing'][i % 4];
      }
    }
    
    if (service.type === 'gmail') {
      docName = `Email: ${serviceSpecificIndustryContext || 'Important'} Communication ${i + 1}`;
    } else if (service.type === 'drive') {
      docName = `File: ${serviceSpecificIndustryContext || ['Confidential', 'Internal', 'Client', 'Project'][i % 4]} Document ${i + 1}.pdf`;
    } else {
      docName = `Google Doc: ${serviceSpecificIndustryContext || ['Report', 'Agreement', 'Contract', 'Plan'][i % 4]} ${i + 1}`;
    }
    
    // Generate a compliance report for this "document"
    // Always pass the explicit industry to ensure it's used
    const reportResponse = await requestComplianceCheck(
      `${service.id}-doc-${i}`,
      docName,
      industry, // Pass explicit industry, never fall back to auto-detection
      language,
      region
    );
    
    if (reportResponse.success && reportResponse.data) {
      reports.push(reportResponse.data);
    }
  }
  
  return reports;
};
