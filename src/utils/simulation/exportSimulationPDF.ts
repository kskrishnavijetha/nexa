
import { jsPDF } from 'jspdf';
import { PredictiveAnalysis } from '@/utils/types';
import { addFooter } from '@/utils/audit/pdf/addFooter';
import { toast } from 'sonner';
import { configureDocument } from './pdf/configureDocument';
import { addSimulationHeader } from './pdf/addSimulationHeader';
import { addChartVisualization } from './pdf/addChartVisualization';
import { addScoreComparisonTable } from './pdf/addScoreComparisonTable';
import { addRiskTrendsSection } from './pdf/addRiskTrendsSection';
import { addRecommendationsSection } from './pdf/addRecommendationsSection';
import { addFooterAndDisclaimer } from './pdf/addFooterAndDisclaimer';

/**
 * Generate a PDF report for a simulation analysis
 * Optimized version with non-blocking implementation
 */
export const exportSimulationPDF = async (
  analysis: PredictiveAnalysis,
  chartImageBase64?: string
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Use small timeout to prevent UI freezing
    setTimeout(async () => {
      try {
        console.log('[simulationExport] Generating simulation PDF report');
        
        // Configure the PDF document
        const pdf = configureDocument(analysis);
        
        // Add header and scenario information
        let yPos = addSimulationHeader(pdf, analysis);
        
        // Add chart visualization if provided
        yPos = addChartVisualization(pdf, chartImageBase64, yPos);
        
        // Add score comparison table
        yPos = addScoreComparisonTable(pdf, analysis, yPos);
        
        // Add risk trends section
        yPos = addRiskTrendsSection(pdf, analysis.riskTrends, yPos);
        
        // Add recommendations section
        yPos = addRecommendationsSection(pdf, analysis.recommendations, yPos);
        
        // Add footer and disclaimer - this adds page numbers and legal text
        addFooterAndDisclaimer(pdf);
        
        // Add the verification footer with hash - now positioned properly to avoid overlap
        await addFooter(pdf);
        
        // Generate the PDF as a blob
        const pdfBlob = pdf.output('blob');
        console.log('[simulationExport] PDF generated successfully');
        resolve(pdfBlob);
      } catch (error) {
        console.error('[simulationExport] Error generating PDF:', error);
        reject(error);
      }
    }, 10); // Small delay to allow UI to update
  });
};
