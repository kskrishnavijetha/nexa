
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJiraForm } from '@/hooks/useJiraForm';

const JiraStatCards: React.FC = () => {
  const { projects, issueTypes } = useJiraForm();
  
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{projects.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Issue Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{issueTypes.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Sync Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-500">Active</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JiraStatCards;
