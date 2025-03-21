import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Dashboard from '@/pages/Dashboard';
import DocumentAnalysis from '@/pages/DocumentAnalysis';
import GoogleServices from '@/pages/GoogleServices';
import History from '@/pages/History';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Payment from '@/pages/Payment';
import SlackMonitoringPage from '@/pages/SlackMonitoring';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const [displayLocation, setDisplayLocation] = useState(useLocation());
  const location = useLocation();

  useEffect(() => {
    setDisplayLocation(location);
  }, [location]);

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/document-analysis" element={<DocumentAnalysis />} />
        <Route path="/google-services" element={<GoogleServices />} />
        <Route path="/slack-monitoring" element={<SlackMonitoringPage />} />
        <Route path="/history" element={<History />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
