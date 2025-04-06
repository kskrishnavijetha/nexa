
import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Layout from './components/layout/Layout';
import { Toaster } from '@/components/ui/sonner';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import DocumentAnalysis from './pages/DocumentAnalysis';
import GoogleServices from './pages/GoogleServices';
import PricingPlans from './pages/PricingPlans';
import Payment from './pages/Payment';
import SlackMonitoring from './pages/SlackMonitoring';
import History from './pages/History';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuditReports from './pages/AuditReports';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/pricing" element={<PricingPlans />} />
        
        {/* Payment page is protected but doesn't require an active subscription */}
        <Route path="/payment" element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/document-analysis" element={
          <ProtectedRoute>
            <Layout>
              <DocumentAnalysis />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/history" element={
          <ProtectedRoute>
            <Layout>
              <History />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/audit-reports" element={
          <ProtectedRoute>
            <Layout>
              <AuditReports />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/google-services" element={
          <ProtectedRoute>
            <Layout>
              <GoogleServices />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/slack-monitoring" element={
          <ProtectedRoute>
            <Layout>
              <SlackMonitoring />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
