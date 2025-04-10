
import { Industry, Region, ApiResponse } from '../../types';
import { SupportedLanguage } from '../../language';
import { GoogleServiceScanResult, mockGoogleConnections } from '../types';
import { generateComplianceReports } from './complianceReportGenerator';
import { scanRealGoogleDrive } from './driveScanner';

// Scan cloud service for compliance issues
export const scanGoogleService = async (
  serviceId: string,
  industry?: Industry,
  language?: SupportedLanguage,
  region?: Region
): Promise<ApiResponse<GoogleServiceScanResult>> => {
  try {
    // For Google Drive, use real scanning if possible
    if (serviceId === 'drive-1' && window.gapi && window.gapi.client && window.gapi.client.drive) {
      return await scanRealGoogleDrive(industry, language, region);
    }
    
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
