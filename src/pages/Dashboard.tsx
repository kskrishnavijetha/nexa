
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shouldUpgrade } from '@/utils/paymentService';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardTabContent from '@/components/dashboard/DashboardTabContent';
import { useAuth } from '@/contexts/AuthContext';
import { getUserHistoricalReports } from '@/utils/historyService';
import { SelectedReportProvider } from '@/components/dashboard/RecentScans';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasData, setHasData] = useState<boolean>(false);

  // Check if user needs to upgrade on component mount
  useEffect(() => {
    const needsUpgrade = shouldUpgrade();
    if (needsUpgrade) {
      toast.info('Your free plan usage is complete. Please upgrade to continue.', {
        action: {
          label: 'Upgrade',
          onClick: () => navigate('/pricing'),
        },
      });
    }
  }, [navigate]);

  // Check if the user has any scan data
  useEffect(() => {
    const checkUserData = async () => {
      if (user?.id) {
        const userReports = getUserHistoricalReports(user.id);
        setHasData(userReports.length > 0);
        
        if (userReports.length === 0) {
          toast.info('Welcome to your dashboard! Start by running a document scan.', {
            action: {
              label: 'Scan Document',
              onClick: () => navigate('/document-analysis'),
            },
            duration: 5000,
          });
        }
      }
    };
    
    checkUserData();
  }, [user, navigate]);

  return (
    <SelectedReportProvider>
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <DashboardOverview />
          </TabsContent>
          
          <TabsContent value="compliance">
            <DashboardTabContent activeTab="compliance" />
          </TabsContent>
          
          <TabsContent value="risks">
            <DashboardTabContent activeTab="risks" />
          </TabsContent>
          
          <TabsContent value="actions">
            <DashboardTabContent activeTab="actions" />
          </TabsContent>
        </Tabs>
        
        {!hasData && (
          <div className="mt-8 p-4 border border-dashed rounded-md text-center">
            <p className="text-muted-foreground">
              Your dashboard will display real-time compliance data once you've performed document scans.
            </p>
            <button 
              onClick={() => navigate('/document-analysis')}
              className="mt-2 text-primary hover:underline"
            >
              Start your first document scan →
            </button>
          </div>
        )}
      </div>
    </SelectedReportProvider>
  );
};

export default Dashboard;
