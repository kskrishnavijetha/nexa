
import { SupportedLanguage } from '@/utils/language';
import { ApiResponse, ComplianceReport, Industry, Region } from '@/utils/types';
import { requestComplianceCheck } from '@/utils/complianceService';

// Types for Zoom services integration
export interface ZoomConnection {
  id: string;
  name: string;
  connected: boolean;
  lastScanned?: string;
  meetingsCount?: number;
}

export interface ZoomMeeting {
  id: string;
  topic: string;
  startTime: string;
  duration: number;
  participantsCount: number;
  hasRecording: boolean;
  hasTranscript: boolean;
}

export interface ZoomScanResult {
  meetingsScanned: number;
  recordingsScanned: number;
  transcriptsScanned: number;
  violationsFound: number;
  scanDate: string;
  reports: ComplianceReport[];
}

// Mock Zoom account
const mockZoomConnection: ZoomConnection = {
  id: 'zoom-account-1',
  name: 'Zoom Account',
  connected: false
};

// Mock Zoom meetings data
const generateMockMeetings = (count: number): ZoomMeeting[] => {
  const meetings: ZoomMeeting[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 14); // Within last 2 weeks
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysAgo);
    
    meetings.push({
      id: `meeting-${i}`,
      topic: `${['Weekly', 'Monthly', 'Project', 'Team'][i % 4]} ${['Status', 'Planning', 'Review', 'Discussion'][i % 4]} Meeting`,
      startTime: startDate.toISOString(),
      duration: Math.floor(Math.random() * 90) + 30, // 30-120 minutes
      participantsCount: Math.floor(Math.random() * 15) + 2, // 2-16 participants
      hasRecording: Math.random() > 0.3, // 70% chance to have recording
      hasTranscript: Math.random() > 0.5 // 50% chance to have transcript
    });
  }
  
  return meetings;
};

// Connect to Zoom
export const connectZoom = async (
  authToken?: string
): Promise<ApiResponse<ZoomConnection>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Update mock connection status
    mockZoomConnection.connected = true;
    mockZoomConnection.lastScanned = new Date().toISOString();
    mockZoomConnection.meetingsCount = Math.floor(Math.random() * 50) + 10; // 10-60 meetings
    
    return {
      success: true,
      data: mockZoomConnection,
      status: 200
    };
  } catch (error) {
    console.error('Error connecting to Zoom:', error);
    return {
      success: false,
      error: 'Failed to connect to Zoom. Please try again.',
      status: 500
    };
  }
};

// Disconnect from Zoom
export const disconnectZoom = async (): Promise<ApiResponse<ZoomConnection>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update mock connection status
    mockZoomConnection.connected = false;
    mockZoomConnection.lastScanned = undefined;
    mockZoomConnection.meetingsCount = undefined;
    
    return {
      success: true,
      data: mockZoomConnection,
      status: 200
    };
  } catch (error) {
    console.error('Error disconnecting from Zoom:', error);
    return {
      success: false,
      error: 'Failed to disconnect from Zoom. Please try again.',
      status: 500
    };
  }
};

// Get Zoom meetings
export const getZoomMeetings = async (): Promise<ApiResponse<ZoomMeeting[]>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 900));
    
    if (!mockZoomConnection.connected) {
      return {
        success: false,
        error: 'Not connected to Zoom',
        status: 400
      };
    }
    
    const meetingsCount = mockZoomConnection.meetingsCount || 0;
    const meetings = generateMockMeetings(meetingsCount);
    
    return {
      success: true,
      data: meetings,
      status: 200
    };
  } catch (error) {
    console.error('Error getting Zoom meetings:', error);
    return {
      success: false,
      error: 'Failed to get Zoom meetings. Please try again.',
      status: 500
    };
  }
};

// Scan Zoom meetings for compliance issues
export const scanZoomMeetings = async (
  industry?: Industry,
  language?: SupportedLanguage,
  region?: Region
): Promise<ApiResponse<ZoomScanResult>> => {
  try {
    // Simulate API latency for a longer scan operation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    if (!mockZoomConnection.connected) {
      return {
        success: false,
        error: 'Not connected to Zoom',
        status: 400
      };
    }
    
    // Get mock meetings
    const meetingsResponse = await getZoomMeetings();
    if (!meetingsResponse.data) {
      return {
        success: false,
        error: 'Failed to retrieve Zoom meetings',
        status: 500
      };
    }
    
    const meetings = meetingsResponse.data;
    
    // Count recordings and transcripts
    const recordingsCount = meetings.filter(m => m.hasRecording).length;
    const transcriptsCount = meetings.filter(m => m.hasTranscript).length;
    
    // Generate random violations (between 1 and 8)
    const violationsCount = Math.floor(Math.random() * 8) + 1;
    
    // Generate mock compliance reports for violations
    const reports: ComplianceReport[] = [];
    
    for (let i = 0; i < violationsCount; i++) {
      // Pick a random meeting
      const meeting = meetings[Math.floor(Math.random() * meetings.length)];
      
      // Decide if violation is in recording or transcript
      const isRecording = Math.random() > 0.5;
      
      const docName = isRecording 
        ? `Recording: ${meeting.topic} (${new Date(meeting.startTime).toLocaleDateString()})`
        : `Transcript: ${meeting.topic} (${new Date(meeting.startTime).toLocaleDateString()})`;
      
      // Generate a compliance report for this meeting
      const reportResponse = await requestComplianceCheck(
        `zoom-meeting-${meeting.id}`,
        docName,
        industry,
        language,
        region
      );
      
      if (reportResponse.data) {
        reports.push(reportResponse.data);
      }
    }
    
    // Update last scanned time
    mockZoomConnection.lastScanned = new Date().toISOString();
    
    // Return scan results
    const scanResult: ZoomScanResult = {
      meetingsScanned: meetings.length,
      recordingsScanned: recordingsCount,
      transcriptsScanned: transcriptsCount,
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
    console.error('Error scanning Zoom meetings:', error);
    return {
      success: false,
      error: 'Failed to scan Zoom meetings. Please try again.',
      status: 500
    };
  }
};

// Get Zoom connection status
export const getZoomConnection = async (): Promise<ApiResponse<ZoomConnection>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: mockZoomConnection,
      status: 200
    };
  } catch (error) {
    console.error('Error getting Zoom connection:', error);
    return {
      success: false,
      error: 'Failed to get Zoom connection status. Please try again.',
      status: 500
    };
  }
};

// Check if Zoom is connected
export const isZoomConnected = (): boolean => {
  return mockZoomConnection.connected;
};
