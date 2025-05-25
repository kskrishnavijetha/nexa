
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AuditPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Audit Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Audit Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage your audit reports and compliance tracking here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditPage;
