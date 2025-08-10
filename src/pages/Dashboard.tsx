import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, BarChart3, Settings, Crown, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getSubscription, hasActiveSubscription, isFreePlanCompleted } from '@/utils/paymentService';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import FreePlanCompletionNotice from '@/components/payment/FreePlanCompletionNotice';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(user ? getSubscription(user.id) : null);
  const [showFreePlanNotice, setShowFreePlanNotice] = useState(false);

  useEffect(() => {
    if (user) {
      const userSubscription = getSubscription(user.id);
      setSubscription(userSubscription);
      
      // Check if free plan is completed
      if (userSubscription?.plan === 'free' && isFreePlanCompleted(user.id)) {
        setShowFreePlanNotice(true);
      }
    }
  }, [user]);

  const handleStartAnalysis = () => {
    // Check if user has an active subscription or scans remaining
    if (user && !hasActiveSubscription(user.id)) {
      toast.error('Please activate a subscription plan to start analysis');
      navigate('/pricing');
      return;
    }
    
    if (user && isFreePlanCompleted(user.id)) {
      toast.info('Your free plan has been completed. Please upgrade to continue.');
      navigate('/pricing');
      return;
    }
    
    navigate('/upload');
  };

  const handleViewReports = () => {
    navigate('/audit-reports');
  };

  const handleManageSubscription = () => {
    navigate('/payment');
  };

  const stats = [
    { title: 'Documents Analyzed', value: '12', icon: FileText },
    { title: 'Compliance Score', value: '94%', icon: BarChart3 },
    { title: 'Active Scans', value: subscription?.scansUsed || '0', icon: Upload },
    { title: 'Plan Status', value: subscription?.plan || 'None', icon: Crown },
  ];

  // Show free plan completion notice if applicable
  if (showFreePlanNotice && subscription) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="max-w-2xl mx-auto">
            <FreePlanCompletionNotice
              scansUsed={subscription.scansUsed}
              scansLimit={subscription.scansLimit}
              isExpired={subscription.expirationDate < new Date()}
            />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your compliance analysis.</p>
        </div>

        {/* Subscription Warning */}
        {user && !hasActiveSubscription(user.id) && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                Subscription Required
              </CardTitle>
              <CardDescription className="text-yellow-700">
                Please activate a subscription plan to access all features and start analyzing documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/pricing')}>
                View Subscription Plans
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Start New Analysis
              </CardTitle>
              <CardDescription>
                Upload a document to begin compliance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleStartAnalysis} className="w-full">
                Upload Document
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                View Reports
              </CardTitle>
              <CardDescription>
                Access your compliance analysis reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleViewReports} variant="outline" className="w-full">
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Manage Subscription
              </CardTitle>
              <CardDescription>
                Update your subscription plan and billing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleManageSubscription} variant="outline" className="w-full">
                Manage Plan
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Details */}
        {subscription && (
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>Your current plan details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Plan</div>
                  <div className="text-lg font-semibold capitalize">{subscription.plan}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Scans Used</div>
                  <div className="text-lg font-semibold">
                    {subscription.scansUsed} / {subscription.scansLimit === 999 ? '∞' : subscription.scansLimit}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className={`text-lg font-semibold ${subscription.active ? 'text-green-600' : 'text-red-600'}`}>
                    {subscription.active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
