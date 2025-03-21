
// Import from parent types file
import { ComplianceReport, Industry, ComplianceRisk, RiskSeverity } from '../types';

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
 * Risk trend analysis structure - make it consistent with the one in utils/types.ts
 */
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
