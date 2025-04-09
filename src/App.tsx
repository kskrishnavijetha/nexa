
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
import InteractiveLogs from './components/logs/InteractiveLogs';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout><Index /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/history" element={<Layout><History /></Layout>} />
        <Route path="/document-analysis" element={<Layout><DocumentAnalysis /></Layout>} />
        <Route path="/google-services" element={<Layout><GoogleServices /></Layout>} />
        <Route path="/pricing" element={<Layout><PricingPlans /></Layout>} />
        <Route path="/payment" element={<Layout><Payment /></Layout>} />
        <Route path="/audit-reports" element={<Layout><AuditReports /></Layout>} />
        <Route path="/slack-monitoring" element={<Layout><SlackMonitoring /></Layout>} />
        <Route path="/interactive-logs" element={<Layout><InteractiveLogs /></Layout>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
