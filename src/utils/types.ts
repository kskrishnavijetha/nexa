export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  mitigation: string;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
}

export interface ComplianceReport {
  id: string;
  documentId: string;
  documentName: string;
  timestamp: string;
  overallScore: number;
  risks: Risk[];
  suggestions: Suggestion[];
  summary: string;
  industry: string;
  region: string;
  userId?: string; // Add userId field to track which user created the report
}

export interface AuditEvent {
    id: string;
    timestamp: string;
    action: string;
    documentName: string;
    user: string;
    status: 'pending' | 'in-progress' | 'completed';
    comments: string[];
    icon?: React.ReactNode;
}
