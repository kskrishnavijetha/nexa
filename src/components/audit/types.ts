
import { LucideIcon } from 'lucide-react';
import { ComplianceReport } from '@/utils/types';

export interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

export interface AuditComment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  documentName: string;
  user: string;
  status?: 'pending' | 'in-progress' | 'completed';
  comments?: AuditComment[];
  icon?: React.ReactNode;
}

export interface ServiceScanHistory {
  serviceId: string;
  serviceName: string;
  documentName?: string;
  scanDate: string;
  itemsScanned: number;
  violationsFound: number;
  report?: ComplianceReport;
}
