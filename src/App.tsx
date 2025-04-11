
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

import Layout from './components/layout/Layout';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import PricingPlans from './pages/PricingPlans';
import DocumentAnalysis from './pages/DocumentAnalysis';
import Payment from './pages/Payment';
import Settings from './pages/Settings';
import History from './pages/History';
import GoogleServices from './pages/GoogleServices';
import AuditReports from './pages/AuditReports';
import SlackMonitoring from './pages/SlackMonitoring';
import ProtectedRoute from './components/auth/ProtectedRoute';

import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider attribute="class">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="sign-in" element={<SignIn />} />
                <Route path="sign-up" element={<SignUp />} />
                <Route path="pricing" element={<PricingPlans />} />
                <Route path="payment" element={<Payment />} />
                <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="document-analysis" element={<ProtectedRoute><DocumentAnalysis /></ProtectedRoute>} />
                <Route path="history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="google-services" element={<ProtectedRoute><GoogleServices /></ProtectedRoute>} />
                <Route path="audit-reports" element={<ProtectedRoute><AuditReports /></ProtectedRoute>} />
                <Route path="slack-monitoring" element={<ProtectedRoute><SlackMonitoring /></ProtectedRoute>} />
                <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
