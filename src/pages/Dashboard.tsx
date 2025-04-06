import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shouldUpgrade } from '@/utils/paymentService';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import RecentScans from '@/components/dashboard/RecentScans';
import ComplianceScore from '@/components/dashboard/ComplianceScore';
import RiskSummary from '@/components/dashboard/RiskSummary';
import ActionItems from '@/components/dashboard/ActionItems';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email?.split('@')[0] || 'User'}! Here's an overview of your compliance status.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/document-analysis')}
          >
            New Scan
          </Button>
          <Button onClick={() => navigate('/audit-reports')}>
            View Reports
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Compliance Score
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">
                  +2% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Documents Scanned
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  3 in the last 7 days
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Critical Issues
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  -2 from last scan
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Resolved Items
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +8 this month
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>
                  Your latest document compliance scans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentScans />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Compliance Score</CardTitle>
                <CardDescription>
                  Your compliance score over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ComplianceScore />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Risk Summary</CardTitle>
                <CardDescription>
                  Breakdown of compliance risks by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RiskSummary />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>
                    Action items due soon
                  </CardDescription>
                </div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <UpcomingDeadlines />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Details</CardTitle>
              <CardDescription>
                Detailed breakdown of your compliance status across regulations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Compliance details content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="risks">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>
                Comprehensive view of identified risks and their severity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Risk assessment content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Action Items</CardTitle>
                  <CardDescription>
                    Tasks that need your attention to improve compliance
                  </CardDescription>
                </div>
                <Button size="sm" className="flex items-center gap-1">
                  <span>View All</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ActionItems />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
