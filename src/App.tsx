
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import DocumentAnalysis from '@/pages/DocumentAnalysis';
import GoogleServices from '@/pages/GoogleServices';
import History from '@/pages/History';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Payment from '@/pages/Payment';
import PricingPlans from '@/pages/PricingPlans';
import SlackMonitoringPage from '@/pages/SlackMonitoring';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Auth routes */}
            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/signup" element={<SignUp />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/document-analysis" element={
              <ProtectedRoute>
                <DocumentAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/google-services" element={
              <ProtectedRoute>
                <GoogleServices />
              </ProtectedRoute>
            } />
            <Route path="/slack-monitoring" element={
              <ProtectedRoute>
                <SlackMonitoringPage />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />
            
            {/* Public routes */}
            <Route path="/pricing" element={<PricingPlans />} />
            <Route path="/payment" element={<Payment />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
