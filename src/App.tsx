
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Reports from "./pages/Reports";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Settings from "./pages/Settings";
import FileUpload from "./pages/FileUpload";
import SimulationLab from "./pages/SimulationLab";
import PredictiveAnalytics from "./pages/PredictiveAnalytics";
import AuditTrail from "./pages/AuditTrail";
import HashVerification from "./pages/HashVerification";
import WorkdayIntegration from "./pages/WorkdayIntegration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/upload" element={<FileUpload />} />
              <Route path="/simulation" element={<SimulationLab />} />
              <Route path="/analytics" element={<PredictiveAnalytics />} />
              <Route path="/audit" element={<AuditTrail />} />
              <Route path="/hash-verification" element={<HashVerification />} />
              <Route path="/workday" element={<WorkdayIntegration />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
