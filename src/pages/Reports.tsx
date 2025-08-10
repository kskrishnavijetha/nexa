
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, BarChart, PieChart } from 'lucide-react';

const Reports = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Generate comprehensive compliance and audit reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Compliance Reports
            </CardTitle>
            <CardDescription>
              Generate detailed compliance status reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Create comprehensive reports showing compliance status across all frameworks and regulations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trend Analysis
            </CardTitle>
            <CardDescription>
              Analyze compliance trends over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Track how your compliance posture changes over time with detailed trend analysis.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
            <CardDescription>
              Comprehensive risk analysis reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Generate detailed risk assessment reports with recommendations and mitigation strategies.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
