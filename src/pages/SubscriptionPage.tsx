
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SubscriptionPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Subscription</h1>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage your subscription and billing here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPage;
