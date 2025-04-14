
import { ReactNode } from 'react';
import { Industry } from '@/utils/types';
import { Region } from '@/utils/types/common';

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  documentName: string;
  user: string;
  status: 'pending' | 'in-progress' | 'completed';
  comments: string[];
  icon?: ReactNode;
}

export interface CompanyDetails {
  companyName: string;
  complianceType: string;
  logo?: string | null;
  contactName?: string;
  designation?: string;
  email?: string;
  phone?: string;
  industry?: Industry;
  region?: Region;
}

// Add Comment type for useComments hook
export interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}
