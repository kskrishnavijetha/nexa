import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import PricingPlans from './pages/PricingPlans';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import DocumentAnalysis from './pages/DocumentAnalysis';
import History from './pages/History';
import AuditReports from './pages/AuditReports';
import GoogleServices from './pages/GoogleServices';
import SlackMonitoring from './pages/SlackMonitoring';
import HashVerification from './pages/HashVerification';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import Settings from './pages/Settings';
import Jira from './pages/Jira';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/pricing" element={<PricingPlans />} />
          <Route path="/payment" element={<Payment />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/document-analysis" element={<DocumentAnalysis />} />
            <Route path="/history" element={<History />} />
            <Route path="/audit-reports" element={<AuditReports />} />
            <Route path="/google-services" element={<GoogleServices />} />
            <Route path="/slack-monitoring" element={<SlackMonitoring />} />
            <Route path="/hash-verification" element={<HashVerification />} />
            <Route path="/verify" element={<HashVerification />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/jira" element={<Jira />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
