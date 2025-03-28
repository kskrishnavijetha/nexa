
// Main API service file that exports all service modules
export * from './types';
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

// Define a shared API response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

// Define a shared API service response interface that includes status
export interface ApiServiceResponse<T> extends ApiResponse<T> {
  status?: number;
}
