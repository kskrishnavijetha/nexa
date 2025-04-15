
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
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasData, setHasData] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkUpgradeNeeded() {
      const needsUpgrade = await shouldUpgrade();
      if (needsUpgrade) {
        toast.info('Your free plan usage is complete. Please upgrade to continue.', {
          action: {
            label: 'Upgrade',
            onClick: () => navigate('/pricing'),
          },
        });
      }
    }
    
    if (user) {
      checkUpgradeNeeded();
    }
  }, [navigate, user]);
  
  useEffect(() => {
    async function fetchSubscription() {
      if (user) {
        try {
          const sub = await getSubscription();
          setSubscription(sub);
        } catch (error) {
          console.error('Error fetching subscription:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    
    fetchSubscription();
  }, [user]);

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
        
        {loading ? (
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg flex justify-center items-center">
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            <span>Loading subscription data...</span>
          </div>
        ) : subscription ? (
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-slate-700">Your {subscription.plan} Plan Usage</h3>
                <p className="text-sm text-slate-600">
                  {subscription.scansLimit === 999 ? 
                    'Unlimited scans available' : 
                    `${subscription.scansLimit - subscription.scansUsed} of ${subscription.scansLimit} scans remaining this month`
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
        ) : null}

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
