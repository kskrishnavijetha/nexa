
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
 */
export const exportSimulationPDF = async (
  analysis: PredictiveAnalysis,
  chartImageBase64?: string
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Use setTimeout to ensure UI doesn't freeze during PDF generation
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
        addRecommendationsSection(pdf, analysis.recommendations, yPos);
        
        // Add footer and disclaimer
        addFooterAndDisclaimer(pdf);
        
        // Add footer with page numbers to all pages
        await addFooter(pdf);
        
        // Generate the PDF as a blob
        const pdfBlob = pdf.output('blob');
        console.log('[simulationExport] PDF generated successfully');
        resolve(pdfBlob);
      } catch (error) {
        console.error('[simulationExport] Error generating PDF:', error);
        reject(error);
      }
    }, 10);
  });
};
