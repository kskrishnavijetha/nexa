
export interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  documentName: string;
  user: string;
  status: 'pending' | 'in-progress' | 'completed';
  comments: string[];
  icon?: string;
}

export interface CompanyDetails {
  companyName: string;
  complianceType: string;
  logo?: string | null;
}
