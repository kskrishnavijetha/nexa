
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PredictiveAnalysis } from '@/utils/types';
import ScoreComparisonChart from './ScoreComparisonChart';
import RiskTrendList from './RiskTrendList';
import RecommendationsList from './RecommendationsList';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { exportSimulationPDF } from '@/utils/simulation/exportSimulationPDF';

interface SimulationResultsProps {
  analysisData: PredictiveAnalysis;
  loading?: boolean;
  onReset?: () => void;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ analysisData, loading = false, onReset }) => {
  const [downloading, setDownloading] = React.useState(false);
  const chartRef = React.useRef<HTMLDivElement>(null);
  
  const captureChartAsImage = async (): Promise<string | undefined> => {
    if (!chartRef.current) return undefined;
    
    try {
      // Use html2canvas to capture the chart
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(chartRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Failed to capture chart:', error);
      return undefined;
    }
  };
  
  const handleDownloadPDF = async () => {
    if (!analysisData || downloading) return;
    
    setDownloading(true);
    toast.loading('Generating PDF report...');
    
    try {
      // Capture chart as image
      const chartImage = await captureChartAsImage();
      
      const pdfBlob = await exportSimulationPDF(analysisData, chartImage);
      
      // Create a download link for the PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `simulation-${analysisData.scenarioName.replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success('Simulation report downloaded successfully');
    } catch (error) {
      console.error('Error downloading simulation PDF:', error);
      toast.dismiss();
      toast.error('Failed to generate simulation PDF report');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysisData || !analysisData.scenarioId) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Select a scenario to view simulation results
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Simulation Results: {analysisData.scenarioName}</h3>
        <Button 
          onClick={handleDownloadPDF} 
          disabled={downloading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {downloading ? 'Generating...' : 'Download PDF Report'}
        </Button>
      </div>
      
      <div ref={chartRef}>
        <ScoreComparisonChart analysis={analysisData} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskTrendList riskTrends={analysisData.riskTrends || []} />
        
        <RecommendationsList recommendations={analysisData.recommendations || []} />
      </div>
    </div>
  );
};

export default SimulationResults;
