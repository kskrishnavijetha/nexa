
import { ApiResponse, Industry, Region } from '../types';
import { SupportedLanguage } from '../language';
import { ComplianceReport } from '../types';

// Types for cloud services integration
export interface GoogleServiceConnection {
  id: string;
  type: 'gmail' | 'drive' | 'docs';
  name: string;
  connected: boolean;
  lastScanned?: string;
  itemCount?: number;
  provider: 'google';
  isAuthenticated?: boolean;
}

export interface GoogleServiceScanResult {
  serviceType: 'gmail' | 'drive' | 'docs';
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
    provider: 'google',
    isAuthenticated: false
  },
  {
    id: 'drive-1',
    type: 'drive',
    name: 'Google Drive',
    connected: false,
    provider: 'google',
    isAuthenticated: false
  },
  {
    id: 'docs-1',
    type: 'docs',
    name: 'Google Docs',
    connected: false,
    provider: 'google',
    isAuthenticated: false
  }
];
