
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import OnboardingFlow from '@/components/standup/OnboardingFlow';
import StandUpDashboard from '@/components/standup/StandUpDashboard';
import AskGenie from '@/components/standup/AskGenie';
import { Users, BarChart3, MessageCircle, Settings } from 'lucide-react';

const StandUpGenie = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isOnboarded) {
    return <OnboardingFlow onComplete={() => setIsOnboarded(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Users className="h-10 w-10 text-purple-400" />
              StandUpGenie
            </h1>
            <p className="text-slate-300 mt-2">Your smart Jira stand-up companion</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'genie' ? 'default' : 'outline'}
              onClick={() => setActiveTab('genie')}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Ask Genie
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'outline'}
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && <StandUpDashboard />}
        {activeTab === 'genie' && <AskGenie />}
        {activeTab === 'settings' && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">Configure your StandUp settings here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StandUpGenie;
