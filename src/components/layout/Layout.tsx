import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { BarChart, FileText, History, Settings, ClipboardList, MessageSquare, Palette, ShieldCheck, Bug } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Only render the Sidebar for authenticated users
  if (user) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <SidebarHeader>
              <div className="px-2 py-4">
                <div className="flex items-center space-x-2">
                  <img 
                    src="/lovable-uploads/02ec954b-2d1e-4c5c-bfbd-f06f37b0329d.png" 
                    alt="Nexabloom Logo" 
                    className="h-6 w-6 object-contain" 
                  />
                  <h2 className="font-semibold text-xl">Nexabloom</h2>
                </div>
                <p className="text-sm text-muted-foreground">Document Analysis Platform</p>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/dashboard'}>
                      <Link to="/dashboard" draggable="false">
                        <BarChart className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/document-analysis'}>
                      <Link to="/document-analysis" draggable="false">
                        <FileText className="h-4 w-4 mr-2" />
                        Document Analysis
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/history'}>
                      <Link to="/history" draggable="false">
                        <History className="h-4 w-4 mr-2" />
                        History
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/audit-reports'}>
                      <Link to="/audit-reports" draggable="false">
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Audit Reports
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/jira'}>
                      <Link to="/jira" draggable="false">
                        <Bug className="h-4 w-4 mr-2" />
                        Jira Integration
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/google-services'}>
                      <Link to="/google-services" draggable="false">
                        <Settings className="h-4 w-4 mr-2" />
                        Google Services
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/slack-monitoring'}>
                      <Link to="/slack-monitoring" draggable="false">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Slack Monitoring
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/hash-verification'}>
                      <Link to="/hash-verification" draggable="false">
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Hash Verification
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>Configuration</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/settings'}>
                      <Link to="/settings" draggable="false">
                        <Palette className="h-4 w-4 mr-2" />
                        Organization Settings
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }
  
  // For unauthenticated users, keep the original layout
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
