
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import DocumentAnalysis from '@/pages/DocumentAnalysis';
import GoogleServices from '@/pages/GoogleServices';
import History from '@/pages/History';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Payment from '@/pages/Payment';
import SlackMonitoringPage from '@/pages/SlackMonitoring';
import SignInPage from '@/pages/SignIn';
import SignUpPage from '@/pages/SignUp';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import AuthWrapper from '@/components/auth/AuthWrapper';

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            
            {/* Protected routes that require authentication */}
            <Route 
              path="/dashboard" 
              element={
                <AuthWrapper>
                  <Dashboard />
                </AuthWrapper>
              } 
            />
            <Route 
              path="/document-analysis" 
              element={
                <AuthWrapper>
                  <DocumentAnalysis />
                </AuthWrapper>
              } 
            />
            <Route 
              path="/google-services" 
              element={
                <AuthWrapper>
                  <GoogleServices />
                </AuthWrapper>
              } 
            />
            <Route 
              path="/slack-monitoring" 
              element={
                <AuthWrapper>
                  <SlackMonitoringPage />
                </AuthWrapper>
              } 
            />
            <Route 
              path="/history" 
              element={
                <AuthWrapper>
                  <History />
                </AuthWrapper>
              } 
            />
            <Route path="/payment" element={<Payment />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;
