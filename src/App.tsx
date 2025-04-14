
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ServiceProvider } from './contexts/ServiceContext';
import { ComplianceFrameworkProvider } from './contexts/ComplianceFrameworkContext';
import Layout from './components/Layout';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import './index.css';
import Home from './pages/Home';
import DocumentAnalysis from './pages/DocumentAnalysis';
import SlackScan from './pages/SlackScan';
import GoogleScan from './pages/GoogleScan';
import TeamManagement from './pages/TeamManagement';
import Settings from './pages/Settings';
import Compliance from './pages/Compliance';
import HistoryPage from './pages/HistoryPage';
import PricingPage from './pages/PricingPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <ServiceProvider>
            <ComplianceFrameworkProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/document-analysis" element={<DocumentAnalysis />} />
                  <Route path="/slack-scan" element={<SlackScan />} />
                  <Route path="/google-scan" element={<GoogleScan />} />
                  <Route path="/compliance" element={<Compliance />} />
                  <Route path="/team" element={<TeamManagement />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Layout>
              <Toaster />
              <SonnerToaster position="top-right" richColors closeButton/>
            </ComplianceFrameworkProvider>
          </ServiceProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
