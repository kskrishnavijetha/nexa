
import { ComplianceReport } from './types';
import { mockScans } from './historyMocks';

// In-memory storage for reports (in a real app, this would be persisted)
let historicalReports: ComplianceReport[] = [...mockScans];

/**
 * Add a new report to the history
 */
export const addReportToHistory = (report: ComplianceReport): void => {
  // Check if report already exists (prevent duplicates)
  const exists = historicalReports.some(r => r.documentId === report.documentId);
  
  if (!exists) {
    // Add to beginning of array to show newest first
    historicalReports = [report, ...historicalReports];
  }
};

/**
 * Get all historical reports
 */
export const getHistoricalReports = (): ComplianceReport[] => {
  return historicalReports;
};

/**
 * Get a specific report by documentId
 */
export const getReportById = (documentId: string): ComplianceReport | undefined => {
  return historicalReports.find(report => report.documentId === documentId);
};
