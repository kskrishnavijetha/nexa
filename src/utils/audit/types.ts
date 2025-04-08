
export interface AIInsight {
  text: string;
  type: 'info' | 'warning' | 'success' | 'observation' | 'recommendation';
  title?: string;
  actionRequired?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export interface AuditReportStatistics {
  totalEvents: number;
  userEvents: number;
  systemEvents: number;
  completed: number;
  inProgress: number;
  pending: number;
  // Add aliases for clearer property names in findings files
  completedTasks?: number;
  pendingTasks?: number;
}

export interface ComplianceFinding {
  category: string;
  status: 'Pass' | 'Failed' | 'Warning' | 'N/A';
  criticality: 'High' | 'Medium' | 'Low' | 'Critical';
  details: string;
}

export interface CriticalRisk {
  description: string;
  impact: string;
}

export interface ComplianceRecommendation {
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}
