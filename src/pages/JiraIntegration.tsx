
import React from 'react';
import JiraIntegrationSettings from '@/components/settings/JiraIntegration';

const JiraIntegration: React.FC = () => {
  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">Jira Integration</h1>
      <JiraIntegrationSettings />
    </div>
  );
};

export default JiraIntegration;
