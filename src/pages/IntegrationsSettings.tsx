
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const IntegrationsSettings: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Integrations Settings</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Slack</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Connect to Slack for real-time compliance alerts and monitoring.
            </p>
            <Link to="/slack" className="text-primary hover:underline">
              Configure Slack Integration
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Zoom</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Analyze Zoom meetings and recordings for compliance issues.
            </p>
            <Link to="/zoom" className="text-primary hover:underline">
              Configure Zoom Integration
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Webhooks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Set up webhooks to integrate with your existing systems.
            </p>
            <Link to="/webhooks" className="text-primary hover:underline">
              Manage Webhooks
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntegrationsSettings;
