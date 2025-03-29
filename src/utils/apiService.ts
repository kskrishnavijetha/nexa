
// Main API service file that exports all service modules
export * from './fileUploadService';
export * from './complianceService';
export * from './reportService';
export * from './riskService';
export * from './suggestionService';
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

export { 
  ComplianceReport, Industry, ComplianceRisk, RiskSeverity, 
  Region, TypesApiResponse as ApiResponse 
};

// Define a shared API service response interface
export interface ApiServiceResponse<T> extends TypesApiResponse<T> {
  status?: number;
}
