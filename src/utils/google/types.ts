
import { ApiResponse, Industry, Region } from '../types';
import { SupportedLanguage } from '../language';
import { ComplianceReport } from '../types';

// Types for cloud services integration
export interface GoogleServiceConnection {
  id: string;
  type: 'gmail' | 'drive' | 'docs' | 'sharepoint' | 'outlook' | 'teams';
  name: string;
  connected: boolean;
  lastScanned?: string;
  itemCount?: number;
  provider: 'google' | 'microsoft';
}

export interface GoogleServiceScanResult {
  serviceType: 'gmail' | 'drive' | 'docs' | 'sharepoint' | 'outlook' | 'teams';
  itemsScanned: number;
  violationsFound: number;
  scanDate: string;
  reports: ComplianceReport[];
}

// Mock data for service connections
export const mockGoogleConnections: GoogleServiceConnection[] = [
  {
    id: 'gmail-1',
    type: 'gmail',
    name: 'Gmail',
    connected: false,
    provider: 'google'
  },
  {
    id: 'drive-1',
    type: 'drive',
    name: 'Google Drive',
    connected: false,
    provider: 'google'
  },
  {
    id: 'docs-1',
    type: 'docs',
    name: 'Google Docs',
    connected: false,
    provider: 'google'
  },
  // Add Microsoft services
  {
    id: 'sharepoint-1',
    type: 'sharepoint',
    name: 'SharePoint',
    connected: false,
    provider: 'microsoft'
  },
  {
    id: 'outlook-1',
    type: 'outlook',
    name: 'Outlook',
    connected: false,
    provider: 'microsoft'
  },
  {
    id: 'teams-1',
    type: 'teams',
    name: 'Teams',
    connected: false,
    provider: 'microsoft'
  }
];
