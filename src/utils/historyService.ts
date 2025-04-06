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
    userId: report.userId || null, // Ensure the userId field exists
    // Generate a timestamp if not provided
    timestamp: report.timestamp || new Date().toISOString()
  };
  
  console.log('Adding report to history:', reportToAdd);
  
  // For documents with the same name and same user, update instead of creating duplicate
  const existingReportIndex = historicalReports.findIndex(
    r => r.documentName === reportToAdd.documentName && r.userId === reportToAdd.userId
  );
  
  if (existingReportIndex !== -1) {
    // Update the existing report 
    historicalReports[existingReportIndex] = {
      ...reportToAdd,
      documentId: historicalReports[existingReportIndex].documentId // Keep the original document ID
    };
    console.log('Updated existing document in history:', reportToAdd.documentName);
  } else {
    // Add as a new document
    historicalReports = [reportToAdd, ...historicalReports];
    console.log('Added new document to history:', reportToAdd.documentName, 'for user:', reportToAdd.userId);
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
  
  // Ensure only one instance of each document name per user
  const seen = new Set<string>();
  const uniqueUserReports = historicalReports
    .filter(report => report.userId === userId)
    .filter(report => {
      // If we've already seen this document name for this user, skip it
      const key = `${report.userId}-${report.documentName}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  
  console.log(`Fetching unique reports for user ${userId}, found:`, uniqueUserReports.length);
  
  if (uniqueUserReports.length === 0) {
    // For demo purposes, assign some reports to this user if none exist
    const reportsToAssign = historicalReports.slice(0, 3);
    reportsToAssign.forEach(report => {
      report.userId = userId;
    });
    console.log(`Assigned ${reportsToAssign.length} reports to user ${userId}`);
    
    // Return only unique documents for this user after assignment
    return getUserHistoricalReports(userId);
  }
  
  return uniqueUserReports;
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
export const deleteReportFromHistory = (documentId: string, userId?: string | null): boolean => {
  const initialLength = historicalReports.length;
  
  if (userId) {
    // Only delete if the report belongs to this user
    historicalReports = historicalReports.filter(report => 
      !(report.documentId === documentId && report.userId === userId)
    );
  } else {
    // Delete any report with matching documentId
    historicalReports = historicalReports.filter(report => report.documentId !== documentId);
  }
  
  // Return true if a report was deleted
  return initialLength > historicalReports.length;
};

/**
 * Clear all reports from history (useful for testing)
 */
export const clearHistory = (): void => {
  historicalReports = [];
};
