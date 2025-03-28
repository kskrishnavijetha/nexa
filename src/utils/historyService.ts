
import { ComplianceReport } from './types';
import { mockScans } from './historyMocks';

// Assign random user IDs to mock data to make them work with our new filtering
const mockScansWithUserIds = mockScans.map(scan => ({
  ...scan,
  userId: scan.userId || Math.random().toString(36).substring(2, 15)
}));

// In-memory storage for reports (in a real app, this would be persisted)
let historicalReports: ComplianceReport[] = [...mockScansWithUserIds];

/**
 * Add a new report to the history
 */
export const addReportToHistory = (report: ComplianceReport): void => {
  // Ensure report has a userId
  const reportToAdd = {
    ...report,
    userId: report.userId || null // Ensure the userId field exists
  };
  
  // Check if report already exists (prevent duplicates)
  const exists = historicalReports.some(r => r.documentId === reportToAdd.documentId);
  
  if (!exists) {
    // Add to beginning of array to show newest first
    historicalReports = [reportToAdd, ...historicalReports];
    console.log('Report added to history:', reportToAdd.documentName, 'for user:', reportToAdd.userId);
  } else {
    // Update the existing report if it exists but might need a userId update
    const index = historicalReports.findIndex(r => r.documentId === reportToAdd.documentId);
    if (index !== -1) {
      historicalReports[index] = {
        ...historicalReports[index],
        userId: reportToAdd.userId || historicalReports[index].userId
      };
      console.log('Updated existing report in history:', reportToAdd.documentName);
    }
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
 * Get historical reports for a specific user
 */
export const getUserHistoricalReports = (userId: string | null | undefined): ComplianceReport[] => {
  if (!userId) {
    console.log('No user ID provided, returning empty list');
    return [];
  }
  
  const userReports = historicalReports.filter(report => report.userId === userId);
  console.log(`Fetching reports for user ${userId}, found:`, userReports.length);
  return userReports;
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
