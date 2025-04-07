
import { ComplianceReport, ComplianceRisk } from '@/utils/types';

export interface RiskCount {
  name: string;
  value: number;
  color: string;
}

export interface RiskCategory {
  category: string;
  count: number;
  color: string;
}

export interface RiskSummaryProps {
  selectedReport?: ComplianceReport | null;
}
