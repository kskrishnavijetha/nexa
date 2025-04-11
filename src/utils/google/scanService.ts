
import { Industry, Region, ApiResponse } from '../types';
import { SupportedLanguage } from '../language';
import { requestComplianceCheck } from '../complianceService';
import { GoogleServiceScanResult, mockGoogleConnections } from './types';

// Scan cloud service for compliance issues
export const scanGoogleService = async (
  serviceId: string,
  industry?: Industry,
  language?: SupportedLanguage,
  region?: Region
): Promise<ApiResponse<GoogleServiceScanResult>> => {
  try {
    // Simulate API latency for a longer scan operation
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Find the service to scan
    const service = mockGoogleConnections.find(s => s.id === serviceId);
    
    if (!service) {
      return {
        success: false,
        error: 'Service not found',
        status: 404
      };
    }
    
    if (!service.connected) {
      return {
        success: false,
        error: 'Service is not connected',
        status: 400
      };
    }
    
    // Generate mock item count (or use existing)
    const itemCount = service.itemCount || Math.floor(Math.random() * 100) + 5;
    
    // Generate random violations (between 1 and itemCount/4)
    const violationsCount = Math.floor(Math.random() * (itemCount / 4)) + 1;
    
    console.log(`[scanGoogleService] Scanning service ${service.type} for industry: ${industry || 'unspecified'}`);
    
    // Generate mock compliance reports for violations
    const reports = await generateComplianceReports(
      service,
      violationsCount,
      industry,
      language,
      region
    );
    
    // Update service with last scanned time
    const serviceIndex = mockGoogleConnections.findIndex(s => s.id === serviceId);
    if (serviceIndex !== -1) {
      mockGoogleConnections[serviceIndex] = {
        ...mockGoogleConnections[serviceIndex],
        lastScanned: new Date().toISOString(),
        itemCount
      };
    }
    
    // Return scan results
    const scanResult: GoogleServiceScanResult = {
      serviceType: service.type,
      itemsScanned: itemCount,
      violationsFound: reports.length,
      scanDate: new Date().toISOString(),
      reports
    };
    
    return {
      success: true,
      data: scanResult,
      status: 200
    };
  } catch (error) {
    console.error('Error scanning Google service:', error);
    return {
      success: false,
      error: 'Failed to scan the Google service. Please try again.',
      status: 500
    };
  }
};

// Helper function to generate compliance reports
const generateComplianceReports = async (
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
