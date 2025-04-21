
// Import Region type for region property
import { Region } from '@/utils/types/common';

export interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

export interface AuditEvent {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  documentName: string;
  status: 'pending' | 'in-progress' | 'completed' | 'critical';
  comments: Comment[];
  icon?: React.ReactNode | string;
}

// Update CompanyDetails with proper Region type for region instead of string
export interface CompanyDetails {
  companyName: string;
  complianceType: string;
  logo?: string | null;
  contactName?: string;
  designation?: string;
  email?: string;
  phone?: string;
  industry?: string;
  region?: Region;  // Changed from string to Region
}

export interface AuditTrailContextType {
  auditEvents: AuditEvent[];
  isLoading: boolean;
  isGeneratingReport: boolean;
  isGeneratingLogs: boolean;
  downloadAuditReport: () => Promise<void>;
  downloadAuditLogs: () => Promise<void>;
  addAuditEvent: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void;
  updateTaskStatus: (eventId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  updateAuditEvents: (events: AuditEvent[]) => void;
  setLastActivity: (date: Date) => void;
  industry?: string;
  verifyAuditIntegrity?: () => Promise<boolean>;
  currentAuditHash?: string;
}
