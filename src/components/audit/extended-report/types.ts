
import { AuditEvent } from '@/components/audit/types';
import { ComplianceReport } from '@/utils/types';

export interface ReportConfig {
  organizationName: string;
  complianceTypes: string[];
  includeSignature: boolean;
  includeAppendix: boolean;
  logoUrl: string;
  contactInfo: string;
  reportTitle: string;
  reportVersion: string;
}

export interface ComplianceMatrixItem {
  category: string;
  regulation: string;
  status: 'Pass' | 'Warning' | 'Failed' | 'N/A';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  details: string;
}

export interface RemediationItem {
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  timeToFix: string;
  relatedRegulation?: string;
}

export interface ExtendedReport {
  config: ReportConfig;
  baseReport: ComplianceReport;
  auditEvents: AuditEvent[];
  complianceMatrix: ComplianceMatrixItem[];
  remediations: RemediationItem[];
  documentHash?: string;
  pdfBlob?: Blob;
}
