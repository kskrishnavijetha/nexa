
import { ComplianceReport } from '../types';
import { SupportedLanguage } from '../language';
import { ApiResponse } from '../types';
import { generatePDF } from './generators/corePdfGenerator';

/**
 * Generate a downloadable compliance report PDF
 * Extreme optimization for memory usage and UI responsiveness
 */
export const generateReportPDF = async (
  report: ComplianceReport,
  language: SupportedLanguage = 'en',
  chartImageBase64?: string
): Promise<ApiResponse<Blob>> => {
  return generatePDF(report, language, chartImageBase64);
};
