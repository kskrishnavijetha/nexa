
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkdayConnection from '@/components/workday/WorkdayConnection';
import WorkdayDashboard from '@/components/workday/WorkdayDashboard';
import ComplianceAnalysis from '@/components/workday/ComplianceAnalysis';
import IndustryTemplates from '@/components/workday/IndustryTemplates';

const WorkdayIntegration = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="connection">Connection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <WorkdayDashboard />
        </TabsContent>
        
        <TabsContent value="analysis">
          <ComplianceAnalysis />
        </TabsContent>
        
        <TabsContent value="templates">
          <IndustryTemplates />
        </TabsContent>
        
        <TabsContent value="simulation">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Scenario Simulation</h3>
            <p className="text-muted-foreground">
              Coming soon: What-if simulations using your Workday data
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="connection">
          <WorkdayConnection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkdayIntegration;
