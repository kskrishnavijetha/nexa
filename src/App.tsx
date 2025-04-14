
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme/theme-provider';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import History from '@/pages/History';
import ExtendedAuditReport from '@/pages/ExtendedAuditReport';
import Settings from '@/pages/Settings';
import SignUp from '@/pages/SignUp';
import SignIn from '@/pages/SignIn';
import ResetPassword from '@/pages/ResetPassword';
import Pricing from '@/pages/Pricing';
import Payment from '@/pages/Payment';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/contexts/AuthContext';
import Slack from '@/pages/Slack';
import Zoom from '@/pages/Zoom';
import Webhooks from '@/pages/Webhooks';
import IntegrationsSettings from '@/pages/IntegrationsSettings';
import DocumentAnalysis from '@/pages/DocumentAnalysis';
import Templates from '@/pages/Templates';
import SimulationAnalysis from '@/pages/SimulationAnalysis';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { useNavigationEvent } from '@/hooks/useNavigationEvent';
import { useThemeDetector } from '@/hooks/useThemeDetector';
import { setupTheme } from '@/utils/theme';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';

export const App = () => {
  const [ready, setReady] = useState<boolean>(false);
  const { user, setDarkMode } = useAuth();
  const { setUserId } = useServiceHistoryStore();
  
  // Set up system color scheme detection and theme
  const darkMode = useThemeDetector();
  
  // Track navigation for analytics
  useNavigationEvent();
  
  // Effect to initialize the app once auth state is known
  useEffect(() => {
    const initApp = async () => {
      // Set up the theme based on system preference
      setupTheme(darkMode);
      setDarkMode(darkMode);
      
      // If we have a user, set their ID in the service history store
      if (user?.id) {
        setUserId(user.id);
      }
      
      // Mark the app as ready to render
      setReady(true);
    };
    
    initApp();
  }, [user, darkMode, setDarkMode, setUserId]);
  
  // Don't render until we're ready
  if (!ready) {
    return null;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="nexabloom-theme">
      <AnalyticsProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment" element={<Payment />} />
          
          {/* Protected routes with Layout */}
          <Route element={<Layout />}>
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/sign-in" replace />} 
            />
            <Route 
              path="/document-analysis" 
              element={user ? <DocumentAnalysis /> : <Navigate to="/sign-in" replace />} 
            />
            <Route 
              path="/simulation" 
              element={user ? <SimulationAnalysis /> : <Navigate to="/sign-in" replace />} 
            />
            <Route 
              path="/history" 
              element={user ? <History /> : <Navigate to="/sign-in" replace />} 
            />
            <Route 
              path="/extended-audit-report/:documentId" 
              element={user ? <ExtendedAuditReport /> : <Navigate to="/sign-in" replace />} 
            />
            <Route 
              path="/templates" 
              element={user ? <Templates /> : <Navigate to="/sign-in" replace />} 
            />
            <Route 
              path="/settings" 
              element={user ? <Settings /> : <Navigate to="/sign-in" replace />} 
            />
            <Route 
              path="/integrations" 
              element={user ? <IntegrationsSettings /> : <Navigate to="/sign-in" replace />} 
            />
            <Route 
              path="/slack" 
              element={user ? <Slack /> : <Navigate to="/sign-in" replace />} 
            />
            <Route 
              path="/zoom" 
              element={user ? <Zoom /> : <Navigate to="/sign-in" replace />} 
            />
            <Route 
              path="/webhooks" 
              element={user ? <Webhooks /> : <Navigate to="/sign-in" replace />} 
            />
          </Route>
          
          {/* Fallback for unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster />
        <SonnerToaster richColors closeButton position="top-right" />
      </AnalyticsProvider>
    </ThemeProvider>
  );
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
