
import { jsPDF } from 'jspdf';
import { ComplianceReport } from '../../types';
import { SupportedLanguage } from '../../language';
import { forceGarbageCollection, executeInChunks } from '../../memoryUtils';
import { ApiResponse } from '../../types';
import { generatePdfTasks } from './pdfTaskGenerator';

/**
 * Core function to generate a PDF report with optimized memory usage
 */
export const generatePDF = async (
  report: ComplianceReport,
  language: SupportedLanguage = 'en',
  chartImageBase64?: string
): Promise<ApiResponse<Blob>> => {
  return new Promise((resolve) => {
    // Use setTimeout with zero delay to create a separate task
    setTimeout(async () => {
      try {
        console.log('Creating PDF document with extreme optimizations...');
        
        // Force garbage collection before start
        forceGarbageCollection();
        
        // Create a new PDF document with extreme optimization settings
        const doc = new jsPDF({
          orientation: 'portrait', 
          unit: 'mm',
          format: 'a4',
          compress: true,
          putOnlyUsedFonts: true,
          floatPrecision: 2 // Extremely reduced precision for better memory efficiency
        });
        
        // Generate tasks for PDF generation
        const tasks = generatePdfTasks(doc, report, language, chartImageBase64);
        
        // Define our task result type that can be string or Blob
        type TaskResult = string | Blob;
        
        // Execute tasks in small chunks to prevent UI blocking
        const results = await executeInChunks<TaskResult>(tasks, 1, (processed, total) => {
          const percent = Math.floor((processed / total) * 80);
          console.log(`PDF generation progress: ${percent}%`);
        });
        
        // The last task returns the PDF blob
        const pdfBlob = results[results.length - 1] as Blob;
        
        // Force garbage collection after PDF generation
        forceGarbageCollection();
        
        resolve({
          success: true,
          data: pdfBlob,
          status: 200
        });
      } catch (error) {
        console.error('Report generation error:', error);
        resolve({
          success: false,
          error: 'Failed to generate the PDF report. Please try again.',
          status: 500
        });
      }
    }, 0);
  });
};
