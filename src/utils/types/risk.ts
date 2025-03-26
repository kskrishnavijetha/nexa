
import { Industry, Region, RiskSeverity } from './basic';

// Risk item definition
export interface RiskItem {
  id?: string;
  description: string;
  severity: RiskSeverity;
  regulation: string;
  section?: string;
  remediation?: string;
}

// Compliance risk types
export interface ComplianceRisk {
  id: string;
  severity: RiskSeverity;
  description: string;
  regulation: string;
  section?: string;
  remediation?: string;
}

// Risk trend type
export interface RiskTrend {
  riskId: string;
  description: string;
  regulation: string;
  currentSeverity: RiskSeverity;
  predictedChange: 'increase' | 'decrease' | 'stable';
  impact: 'high' | 'medium' | 'low';
  previousScore: number;
  predictedScore: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}
