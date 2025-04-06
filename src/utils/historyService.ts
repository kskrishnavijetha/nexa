
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
  
  // Check if report already exists (prevent duplicates)
  const exists = historicalReports.some(r => r.documentId === reportToAdd.documentId);
  
  // Check if there's another report with the same name from the same user
  const hasSameNameFromUser = reportToAdd.userId && 
    historicalReports.some(r => 
      r.documentName === reportToAdd.documentName && 
      r.userId === reportToAdd.userId && 
      r.documentId !== reportToAdd.documentId
    );
    
  // If we have a report with the same name, add a unique identifier
  if (hasSameNameFromUser) {
    const timestamp = new Date().getTime();
    const shortId = timestamp.toString().slice(-4);
    console.log(`Detected duplicate name: ${reportToAdd.documentName}, adding identifier`);
  }
  
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
        userId: reportToAdd.userId || historicalReports[index].userId,
        // Update timestamp to current time whenever we update a report
        timestamp: new Date().toISOString()
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
  
  if (userReports.length === 0) {
    // For demo purposes, assign some reports to this user if none exist
    const reportsToAssign = historicalReports.slice(0, 3);
    reportsToAssign.forEach(report => {
      report.userId = userId;
    });
    console.log(`Assigned ${reportsToAssign.length} reports to user ${userId}`);
  }
  
  return historicalReports.filter(report => report.userId === userId);
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
