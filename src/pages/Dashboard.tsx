
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shouldUpgrade } from '@/utils/paymentService';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardTabContent from '@/components/dashboard/DashboardTabContent';

const Dashboard = () => {
  const navigate = useNavigate();

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

  return (
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
    </div>
  );
};

export default Dashboard;
