
import { ApiResponse } from '../types';
import { GoogleServiceConnection, mockGoogleConnections } from './types';

// Connect to a cloud service
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

// Disconnect from a cloud service
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

// Get all cloud service connections
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
