
import { ComplianceReport } from './types';

// In-memory storage for report history (would be database in real app)
let reportHistory: ComplianceReport[] = [];

/**
 * Add a report to the history
 * @param report The report to add to history
 */
export const addReportToHistory = (report: ComplianceReport): void => {
  // Check if report with same ID already exists
  const existingIndex = reportHistory.findIndex(r => r.documentId === report.documentId);
  
  if (existingIndex >= 0) {
    // Update existing report
    reportHistory[existingIndex] = report;
  } else {
    // Add new report
    reportHistory = [report, ...reportHistory];
  }
  
  // Persist to localStorage (would be database in real app)
  try {
    window.localStorage.setItem('nexabloom_reportHistory', JSON.stringify(reportHistory));
  } catch (error) {
    console.error('Failed to store report history in localStorage:', error);
  }
};

/**
 * Get all reports from history
 * @param userId Optional user ID to filter reports by user
 * @returns Array of reports
 */
export const getUserHistoricalReports = (userId?: string): ComplianceReport[] => {
  // Load from localStorage if available (would be database in real app)
  try {
    const storedHistory = window.localStorage.getItem('nexabloom_reportHistory');
    if (storedHistory) {
      reportHistory = JSON.parse(storedHistory);
    }
  } catch (error) {
    console.error('Failed to load report history from localStorage:', error);
  }
  
  // Filter by user ID if provided
  if (userId) {
    return reportHistory.filter(report => report.userId === userId);
  }
  
  return reportHistory;
};

/**
 * Alias for getUserHistoricalReports for backward compatibility
 * @deprecated Use getUserHistoricalReports instead
 */
export const getHistoricalReports = getUserHistoricalReports;

/**
 * Get a specific report by ID
 * @param reportId The ID of the report to retrieve
 * @returns The report if found, otherwise null
 */
export const getReportById = (reportId: string): ComplianceReport | null => {
  // Load from localStorage if available
  try {
    const storedHistory = window.localStorage.getItem('nexabloom_reportHistory');
    if (storedHistory) {
      reportHistory = JSON.parse(storedHistory);
    }
  } catch (error) {
    console.error('Failed to load report history from localStorage:', error);
  }
  
  return reportHistory.find(report => report.documentId === reportId) || null;
};

/**
 * Get a report by document name
 * @param documentName The name of the document to find a report for
 * @returns The report if found, otherwise null
 */
export const getReportFromHistoryByName = (documentName: string): ComplianceReport | null => {
  // Load from localStorage if available
  try {
    const storedHistory = window.localStorage.getItem('nexabloom_reportHistory');
    if (storedHistory) {
      reportHistory = JSON.parse(storedHistory);
    }
  } catch (error) {
    console.error('Failed to load report history from localStorage:', error);
  }
  
  return reportHistory.find(report => report.documentName === documentName) || null;
};

// Alias for backward compatibility
export const getReportFromHistory = getReportById;

/**
 * Delete a report from history
 * @param reportId The ID of the report to delete
 * @param userId Optional user ID to ensure only a user's own reports are deleted
 * @returns true if report was deleted, false otherwise
 */
export const deleteReportFromHistory = (reportId: string, userId?: string): boolean => {
  const initialLength = reportHistory.length;
  
  if (userId) {
    reportHistory = reportHistory.filter(report => 
      !(report.documentId === reportId && report.userId === userId)
    );
  } else {
    reportHistory = reportHistory.filter(report => report.documentId !== reportId);
  }
  
  // If any report was removed, update localStorage
  if (initialLength !== reportHistory.length) {
    try {
      window.localStorage.setItem('nexabloom_reportHistory', JSON.stringify(reportHistory));
      return true;
    } catch (error) {
      console.error('Failed to update report history in localStorage:', error);
    }
  }
  
  return false;
};
