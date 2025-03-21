
// Import from parent types file
import { ComplianceReport, RiskItem, Industry } from '../types';

export interface PredictiveAnalyticsResult {
  predictedRisks: RiskPrediction[];
  complianceInsights: ComplianceInsight[];
  riskTrends: RiskTrend[];
  recommendations: Recommendation[];
  lastUpdated: string;
}

export interface ComplianceInsight {
  title: string;
  description: string;
  actionRequired: boolean;
  priority: 'high' | 'medium' | 'low' | 'critical';
}

export interface Recommendation {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effortToImplement: 'high' | 'medium' | 'low';
}

/**
 * Regulatory update severity levels
 */
export type UpdateSeverity = 'critical' | 'important' | 'informational';

/**
 * Structure for a regulatory update
 */
export interface RegulatoryUpdate {
  id: string;
  title: string;
  description: string;
  regulation: string;
  industry: Industry | string;
  publishDate: string;
  effectiveDate?: string;
  severity: UpdateSeverity;
  source?: string;
  sourceUrl?: string;
}

/**
 * Risk prediction structure
 */
export interface RiskPrediction {
  riskType: string;
  probability: number;
  regulation: string;
  severity: 'high' | 'medium' | 'low';
  trend: 'increasing' | 'stable' | 'decreasing';
}

/**
 * Risk trend analysis structure
 */
export interface RiskTrend {
  regulation: string;
  previousScore: number;
  predictedScore: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}
