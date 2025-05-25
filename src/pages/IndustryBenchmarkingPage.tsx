
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const IndustryBenchmarkingPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Industry Benchmarking</h1>
      <Card>
        <CardHeader>
          <CardTitle>Benchmark Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Compare your performance against industry benchmarks here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndustryBenchmarkingPage;
