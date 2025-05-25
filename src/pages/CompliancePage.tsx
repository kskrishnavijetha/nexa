
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CompliancePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Compliance</h1>
      <Card>
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Monitor your compliance status and requirements here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompliancePage;
