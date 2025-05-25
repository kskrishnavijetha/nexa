
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import AuditPage from '@/pages/AuditPage';
import CompliancePage from '@/pages/CompliancePage';
import SettingsPage from '@/pages/SettingsPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import { AuthProvider } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import RealtimeAnalysisSimulator from '@/components/simulation/RealtimeAnalysisSimulator';
import SupportPage from '@/pages/SupportPage';
import KnowledgeBasePage from '@/pages/KnowledgeBasePage';
import IndustryBenchmarkingPage from '@/pages/IndustryBenchmarkingPage';
import IvorynthAI from './pages/IvorynthAI';
import IvoryCoreDataPage from '@/pages/IvoryCoreDataPage';
import Index from '@/pages/Index';

const queryClient = new QueryClient();

// ProtectedRoute component to ensure authentication
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Home Page - Public Route */}
              <Route path="/" element={<Index />} />
              
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Dashboard Routes - Protected */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardOverview />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/audit"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AuditPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/compliance"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CompliancePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <SettingsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <SubscriptionPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/simulation"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <RealtimeAnalysisSimulator />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/support"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <SupportPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/knowledge-base"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <KnowledgeBasePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/industry-benchmarking"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <IndustryBenchmarkingPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/ivorynth-ai" 
                element={
                  <ProtectedRoute>
                    <IvorynthAI />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ivorynth-data" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <IvoryCoreDataPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
