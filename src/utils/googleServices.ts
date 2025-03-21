
import { SupportedLanguage } from './language';
import { ApiResponse, ComplianceReport, Industry, Region } from './types';
import { requestComplianceCheck } from './complianceService';

// Types for Google services integration
export interface GoogleServiceConnection {
  id: string;
  type: 'gmail' | 'drive' | 'docs';
  name: string;
  connected: boolean;
  lastScanned?: string;
  itemCount?: number;
}

export interface GoogleServiceScanResult {
  serviceType: 'gmail' | 'drive' | 'docs';
  itemsScanned: number;
  violationsFound: number;
  scanDate: string;
  reports: ComplianceReport[];
}

// Mock data for Google service connections
export const mockGoogleConnections: GoogleServiceConnection[] = [
  {
    id: 'gmail-1',
    type: 'gmail',
    name: 'Gmail',
    connected: false,
  },
  {
    id: 'drive-1',
    type: 'drive',
    name: 'Google Drive',
    connected: false,
  },
  {
    id: 'docs-1',
    type: 'docs',
    name: 'Google Docs',
    connected: false,
  },
];

// Connect to a Google service
export const connectGoogleService = async (
  serviceId: string,
  authToken?: string
): Promise<ApiResponse<GoogleServiceConnection>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find the service to connect
    const updatedConnections = [...mockGoogleConnections];
    const serviceIndex = updatedConnections.findIndex(s => s.id === serviceId);
    
    if (serviceIndex === -1) {
      return {
        error: 'Service not found',
        status: 404
      };
    }
    
    // Update the connection status
    updatedConnections[serviceIndex] = {
      ...updatedConnections[serviceIndex],
      connected: true,
      lastScanned: new Date().toISOString(),
      itemCount: Math.floor(Math.random() * 100) + 5 // Random number of items
    };
    
    // Update the mock data (in a real app, this would be stored in a database)
    mockGoogleConnections[serviceIndex] = updatedConnections[serviceIndex];
    
    return {
      data: updatedConnections[serviceIndex],
      status: 200
    };
  } catch (error) {
    console.error('Error connecting to Google service:', error);
    return {
      error: 'Failed to connect to the Google service. Please try again.',
      status: 500
    };
  }
};

// Disconnect from a Google service
export const disconnectGoogleService = async (
  serviceId: string
): Promise<ApiResponse<GoogleServiceConnection>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find the service to disconnect
    const updatedConnections = [...mockGoogleConnections];
    const serviceIndex = updatedConnections.findIndex(s => s.id === serviceId);
    
    if (serviceIndex === -1) {
      return {
        error: 'Service not found',
        status: 404
      };
    }
    
    // Update the connection status
    updatedConnections[serviceIndex] = {
      ...updatedConnections[serviceIndex],
      connected: false,
      lastScanned: undefined,
      itemCount: undefined
    };
    
    // Update the mock data
    mockGoogleConnections[serviceIndex] = updatedConnections[serviceIndex];
    
    return {
      data: updatedConnections[serviceIndex],
      status: 200
    };
  } catch (error) {
    console.error('Error disconnecting from Google service:', error);
    return {
      error: 'Failed to disconnect from the Google service. Please try again.',
      status: 500
    };
  }
};

// Scan Google service for compliance issues
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
        error: 'Service not found',
        status: 404
      };
    }
    
    if (!service.connected) {
      return {
        error: 'Service is not connected',
        status: 400
      };
    }
    
    // Generate mock item count (or use existing)
    const itemCount = service.itemCount || Math.floor(Math.random() * 100) + 5;
    
    // Generate random violations (between 1 and itemCount/4)
    const violationsCount = Math.floor(Math.random() * (itemCount / 4)) + 1;
    
    // Generate mock compliance reports for violations
    const reports: ComplianceReport[] = [];
    
    for (let i = 0; i < violationsCount; i++) {
      // Create random document names based on service type
      let docName = '';
      if (service.type === 'gmail') {
        docName = `Email: Important ${service.type.charAt(0).toUpperCase() + service.type.slice(1)} Communication ${i + 1}`;
      } else if (service.type === 'drive') {
        docName = `File: ${['Confidential', 'Internal', 'Client', 'Project'][i % 4]} Document ${i + 1}.pdf`;
      } else {
        docName = `Google Doc: ${['Report', 'Agreement', 'Contract', 'Plan'][i % 4]} ${i + 1}`;
      }
      
      // Generate a compliance report for this "document"
      const reportResponse = await requestComplianceCheck(
        `${service.id}-doc-${i}`,
        docName,
        industry,
        language,
        region
      );
      
      if (reportResponse.data) {
        reports.push(reportResponse.data);
      }
    }
    
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
      data: scanResult,
      status: 200
    };
  } catch (error) {
    console.error('Error scanning Google service:', error);
    return {
      error: 'Failed to scan the Google service. Please try again.',
      status: 500
    };
  }
};

// Get all Google service connections
export const getGoogleConnections = async (): Promise<ApiResponse<GoogleServiceConnection[]>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: mockGoogleConnections,
      status: 200
    };
  } catch (error) {
    console.error('Error getting Google connections:', error);
    return {
      error: 'Failed to get Google service connections. Please try again.',
      status: 500
    };
  }
};
