
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SupportPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Support</h1>
      <Card>
        <CardHeader>
          <CardTitle>Customer Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Get help and support for your account here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportPage;
