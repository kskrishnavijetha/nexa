
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shouldUpgrade, getSubscription } from '@/utils/paymentService';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardTabContent from '@/components/dashboard/DashboardTabContent';
import { useAuth } from '@/contexts/AuthContext';
import { getUserHistoricalReports } from '@/utils/historyService';
import { SelectedReportProvider } from '@/components/dashboard/context/SelectedReportContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasData, setHasData] = useState<boolean>(false);
  const subscription = user ? getSubscription(user.id) : null;
  
  // Calculate the actual remaining scans
  const scansRemaining = subscription ? 
    Math.max(0, subscription.scansLimit - subscription.scansUsed) : 0;

  useEffect(() => {
    const needsUpgrade = user ? shouldUpgrade(user.id) : false;
    if (needsUpgrade) {
      toast.info('Your free plan usage is complete. Please upgrade to continue.', {
        action: {
          label: 'Upgrade',
          onClick: () => navigate('/pricing'),
        },
      });
    }
  }, [navigate, user]);

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
        
        {subscription && (
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-slate-700">Your {subscription.plan} Plan Usage</h3>
                <p className="text-sm text-slate-600">
                  {subscription.scansLimit === 999 ? 
                    'Unlimited scans available' : 
                    `${scansRemaining} of ${subscription.scansLimit} scans remaining this month`
                  }
                </p>
              </div>
              
              {subscription.plan !== 'enterprise' && (
                <button 
                  onClick={() => navigate('/pricing')}
                  className="text-primary hover:underline text-sm"
                >
                  Upgrade Plan →
                </button>
              )}
            </div>
          </div>
        )}

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
