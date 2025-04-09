
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import History from './pages/History';
import DocumentAnalysis from './pages/DocumentAnalysis';
import PricingPlans from './pages/PricingPlans';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import GoogleServices from './pages/GoogleServices';
import Payment from './pages/Payment';
import AuditReports from './pages/AuditReports';
import SlackMonitoring from './pages/SlackMonitoring';
import InteractiveLogsPage from './pages/InteractiveLogsPage';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout>
          <Routes>
            <Route index element={<Index />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="history" element={<History />} />
            <Route path="document-analysis" element={<DocumentAnalysis />} />
            <Route path="google-services" element={<GoogleServices />} />
            <Route path="pricing" element={<PricingPlans />} />
            <Route path="payment" element={<Payment />} />
            <Route path="audit-reports" element={<AuditReports />} />
            <Route path="slack-monitoring" element={<SlackMonitoring />} />
            <Route path="interactive-logs" element={<InteractiveLogsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>}>
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
