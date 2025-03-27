
import { AuditEvent } from '@/components/audit/types';

export interface AuditReportStatistics {
  totalEvents: number;
  systemEvents: number;
  userEvents: number;
  completed: number;
  inProgress: number;
  pending: number;
}

export interface AIInsight {
  text: string;
  type?: 'observation' | 'recommendation' | 'warning';
}
