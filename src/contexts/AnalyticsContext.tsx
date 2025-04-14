
import React, { createContext, useContext, ReactNode } from 'react';

interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  trackPageView: (pageName: string, properties?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  // Track an event with optional properties
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    console.log(`[Analytics Event] ${eventName}`, properties);
    // In a real implementation, this would send data to your analytics service
  };

  // Track a page view
  const trackPageView = (pageName: string, properties?: Record<string, any>) => {
    console.log(`[Analytics Page View] ${pageName}`, properties);
    // In a real implementation, this would send page view data to your analytics service
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent, trackPageView }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
