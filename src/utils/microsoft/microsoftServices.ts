
import { SupportedLanguage } from '@/utils/language';
import { ApiResponse, ComplianceReport, Industry, Region } from '@/utils/types';
import { requestComplianceCheck } from '@/utils/complianceService';

// Types for Microsoft services integration
export interface MicrosoftServiceConnection {
  id: string;
  type: 'sharepoint' | 'outlook' | 'teams';
  name: string;
  connected: boolean;
  lastScanned?: string;
  itemCount?: number;
}

export interface MicrosoftServiceScanResult {
  serviceType: 'sharepoint' | 'outlook' | 'teams';
  itemsScanned: number;
  violationsFound: number;
  scanDate: string;
  reports: ComplianceReport[];
}

// Mock data for Microsoft service connections
const mockMicrosoftConnections: MicrosoftServiceConnection[] = [
  {
    id: 'sharepoint-1',
    type: 'sharepoint',
    name: 'SharePoint',
    connected: false
  },
  {
    id: 'outlook-1',
    type: 'outlook',
    name: 'Outlook',
    connected: false
  },
  {
    id: 'teams-1',
    type: 'teams',
    name: 'Teams',
    connected: false
  }
];

// Connect to a Microsoft service
export const connectMicrosoftService = async (
  serviceId: string,
  authToken?: string
): Promise<ApiResponse<MicrosoftServiceConnection>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find the service to connect
    const updatedConnections = [...mockMicrosoftConnections];
    const serviceIndex = updatedConnections.findIndex(s => s.id === serviceId);
    
    if (serviceIndex === -1) {
      return {
        success: false,
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
    
    // Update the mock data
    mockMicrosoftConnections[serviceIndex] = updatedConnections[serviceIndex];
    
    return {
      success: true,
      data: updatedConnections[serviceIndex],
      status: 200
    };
  } catch (error) {
    console.error('Error connecting to Microsoft service:', error);
    return {
      success: false,
      error: 'Failed to connect to the Microsoft service. Please try again.',
      status: 500
    };
  }
};

// Disconnect from a Microsoft service
export const disconnectMicrosoftService = async (
  serviceId: string
): Promise<ApiResponse<MicrosoftServiceConnection>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find the service to disconnect
    const updatedConnections = [...mockMicrosoftConnections];
    const serviceIndex = updatedConnections.findIndex(s => s.id === serviceId);
    
    if (serviceIndex === -1) {
      return {
        success: false,
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
    mockMicrosoftConnections[serviceIndex] = updatedConnections[serviceIndex];
    
    return {
      success: true,
      data: updatedConnections[serviceIndex],
      status: 200
    };
  } catch (error) {
    console.error('Error disconnecting from Microsoft service:', error);
    return {
      success: false,
      error: 'Failed to disconnect from the Microsoft service. Please try again.',
      status: 500
    };
  }
};

// Scan Microsoft service for compliance issues
export const scanMicrosoftService = async (
  serviceId: string,
  industry?: Industry,
  language?: SupportedLanguage,
  region?: Region
): Promise<ApiResponse<MicrosoftServiceScanResult>> => {
  try {
    // Simulate API latency for a longer scan operation
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Find the service to scan
    const service = mockMicrosoftConnections.find(s => s.id === serviceId);
    
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
    
    // Generate mock compliance reports for violations
    const reports: ComplianceReport[] = [];
    
    for (let i = 0; i < violationsCount; i++) {
      // Create random document names based on service type
      let docName = '';
      if (service.type === 'outlook') {
        docName = `Email: Important ${service.type.charAt(0).toUpperCase() + service.type.slice(1)} Communication ${i + 1}`;
      } else if (service.type === 'sharepoint') {
        docName = `File: ${['Confidential', 'Internal', 'Client', 'Project'][i % 4]} Document ${i + 1}.docx`;
      } else {
        docName = `Teams Message: Team ${['Marketing', 'HR', 'Engineering', 'Sales'][i % 4]} - Channel ${i + 1}`;
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
    const serviceIndex = mockMicrosoftConnections.findIndex(s => s.id === serviceId);
    if (serviceIndex !== -1) {
      mockMicrosoftConnections[serviceIndex] = {
        ...mockMicrosoftConnections[serviceIndex],
        lastScanned: new Date().toISOString(),
        itemCount
      };
    }
    
    // Return scan results
    const scanResult: MicrosoftServiceScanResult = {
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
    console.error('Error scanning Microsoft service:', error);
    return {
      success: false,
      error: 'Failed to scan the Microsoft service. Please try again.',
      status: 500
    };
  }
};

// Get all Microsoft service connections
export const getMicrosoftConnections = async (): Promise<ApiResponse<MicrosoftServiceConnection[]>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: mockMicrosoftConnections,
      status: 200
    };
  } catch (error) {
    console.error('Error getting Microsoft connections:', error);
    return {
      success: false,
      error: 'Failed to get Microsoft service connections. Please try again.',
      status: 500
    };
  }
};
