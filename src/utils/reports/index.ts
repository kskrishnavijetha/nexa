
// Re-export all report-related functionality
export { generateReportPDF } from './generateReportPDF';
// Export the colorUtils functions separately to avoid conflicts
export { getScoreColor } from './utils/colorUtils';
// Export the export formats functionality
export { 
  exportReport, 
  exportReportAsCSV, 
  exportReportAsDOCX, 
  exportReportAsPDF,
  generateReportFilename, 
  type ExportFormat 
} from './exportFormats';
