
import { useCallback } from 'react';

export const useChartCapture = () => {
  const captureChartAsImage = useCallback(async (): Promise<string | undefined> => {
    // Find the charts container in the document
    const chartsContainer = document.querySelector('.compliance-charts-container');
    
    if (!chartsContainer) {
      console.warn('Charts container not found for capture');
      return undefined;
    }
    
    try {
      // Use html2canvas to capture the chart with optimized settings
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(chartsContainer as HTMLElement, {
        scale: 1.5, // Reduced from 2 for better performance
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 5000, // Timeout to prevent hanging
        removeContainer: true // Clean up after capture
      });
      
      // Get image with optimized quality
      return canvas.toDataURL('image/png', 0.8); // 80% quality for better performance
    } catch (error) {
      console.error('Failed to capture chart:', error);
      return undefined;
    }
  }, []);

  return { captureChartAsImage };
};
