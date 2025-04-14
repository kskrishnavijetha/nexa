
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to track navigation events
 * This can be used for analytics tracking
 */
export const useNavigationEvent = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Log navigation event
    console.log(`[Navigation] Page changed to: ${location.pathname}`);
    
    // Track page view - in a real app this would send to analytics service
    trackPageView(location.pathname);
    
  }, [location.pathname]);
  
  // Simulate analytics tracking
  const trackPageView = (path: string) => {
    // In a real app, this would integrate with services like Google Analytics
    // For now we just log to console
    console.log(`[Analytics] Page view: ${path}`);
  };
};
