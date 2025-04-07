
// Main API service file that exports all service modules
export * from './fileUploadService';
export * from './complianceService';
// Import and re-export specifically from reports to avoid conflicts
export { generateReportPDF } from './reports'; 
// Export everything from riskService except generateSuggestions
export { assessContentRisk, setupRealTimeMonitoring, generateRisks } from './riskService';
// Export explicitly renamed generateSuggestions from suggestionService to avoid conflict
export { generateSuggestions as generateComplianceSuggestions } from './suggestionService';
export * from './summaryService';
export * from './scoreService';
export * from './simulationService';
export * from './googleServices';
export * from './slack/slackService';
export * from './webhook/webhookServices';
export * from './zoom/zoomServices';

// Explicitly import and re-export types to avoid conflicts
import { 
  ComplianceReport, Industry, ComplianceRisk, RiskSeverity, 
  Region, ApiResponse as TypesApiResponse
} from './types';

export type { 
  ComplianceReport, Industry, ComplianceRisk, RiskSeverity, 
  Region, TypesApiResponse as ApiResponse 
};

// Define a shared API service response interface
export interface ApiServiceResponse<T> extends TypesApiResponse<T> {
  status?: number;
}
