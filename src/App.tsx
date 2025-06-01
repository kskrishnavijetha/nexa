
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import OnboardingPage from './pages/Onboarding';
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
import StandUpGeniePage from './pages/StandUpGenie';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
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
              <Route path="/standup-genie" element={<StandUpGeniePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
