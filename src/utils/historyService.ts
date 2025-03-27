
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
    console.log('Report added to history:', report.documentName);
  } else {
    console.log('Report already exists in history:', report.documentName);
  }
};

/**
 * Get all historical reports
 */
export const getHistoricalReports = (): ComplianceReport[] => {
  console.log('Fetching historical reports, count:', historicalReports.length);
  return historicalReports;
};

/**
 * Get a specific report by documentId
 */
export const getReportById = (documentId: string): ComplianceReport | undefined => {
  return historicalReports.find(report => report.documentId === documentId);
};

/**
 * Delete a report from history
 */
export const deleteReportFromHistory = (documentId: string): void => {
  historicalReports = historicalReports.filter(report => report.documentId !== documentId);
};

/**
 * Clear all reports from history (useful for testing)
 */
export const clearHistory = (): void => {
  historicalReports = [];
};
