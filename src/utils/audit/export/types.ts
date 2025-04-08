
import { AuditEvent } from '@/components/audit/types';

export type AuditExportFormat = 'json' | 'csv' | 'pdf';

export interface ExportOptions {
  documentName: string;
  auditEvents: AuditEvent[];
}
