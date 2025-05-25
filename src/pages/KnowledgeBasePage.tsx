
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const KnowledgeBasePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Knowledge Base</h1>
      <Card>
        <CardHeader>
          <CardTitle>Documentation & Guides</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Browse our knowledge base and documentation here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBasePage;
