
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
      itemCount: Math.floor(Math.random() * 100) + 5, // Random number of items
      isAuthenticated: true // Mark as authenticated
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
      itemCount: undefined,
      isAuthenticated: false
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

// Upload a file to Google Drive
export const uploadToGoogleDrive = async (
  file: File
): Promise<ApiResponse<{ fileId: string; fileName: string; }>> => {
  try {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      data: {
        fileId: `file-${Date.now()}`,
        fileName: file.name
      },
      status: 200
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    return {
      error: 'Failed to upload file to Google Drive. Please try again.',
      status: 500
    };
  }
};

// Send an email via Gmail
export const sendGmailEmail = async (
  to: string,
  subject: string,
  body: string
): Promise<ApiResponse<{ messageId: string; }>> => {
  try {
    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      data: {
        messageId: `msg-${Date.now()}`
      },
      status: 200
    };
  } catch (error) {
    console.error('Error sending Gmail:', error);
    return {
      error: 'Failed to send email. Please try again.',
      status: 500
    };
  }
};

// Create a Google Doc
export const createGoogleDoc = async (
  title: string,
  content: string
): Promise<ApiResponse<{ docId: string; docTitle: string; }>> => {
  try {
    // Simulate creation delay
    await new Promise(resolve => setTimeout(resolve, 1700));
    
    return {
      data: {
        docId: `doc-${Date.now()}`,
        docTitle: title
      },
      status: 200
    };
  } catch (error) {
    console.error('Error creating Google Doc:', error);
    return {
      error: 'Failed to create Google Doc. Please try again.',
      status: 500
    };
  }
};
