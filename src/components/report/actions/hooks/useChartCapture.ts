
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
      // Defer execution to prevent UI blocking
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Dynamically import html2canvas to reduce initial bundle size
      const html2canvas = (await import('html2canvas')).default;
      
      // Use optimized settings to prevent memory issues and UI blocking
      const canvas = await html2canvas(chartsContainer as HTMLElement, {
        scale: 1, // Lower scale factor for better performance (reduced from 1.2)
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 2000, // Lower timeout to prevent long hanging
        removeContainer: true, // Clean up after capture
        foreignObjectRendering: false, // Disable for better performance
        ignoreElements: (element) => {
          // Ignore non-essential elements to improve performance
          return element.classList.contains('ignore-for-pdf') || 
                 element.classList.contains('recharts-tooltip') ||
                 element.tagName === 'BUTTON';
        }
      });
      
      // Use a much lower quality JPEG for significantly better performance
      return canvas.toDataURL('image/jpeg', 0.5);
      
    } catch (error) {
      console.error('Failed to capture chart:', error);
      return undefined;
    }
  }, []);

  return { captureChartAsImage };
};
