
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, AlertTriangle, Shield, Target } from 'lucide-react';

const PredictiveAnalytics = () => {
  const complianceData = [
    { month: 'Jan', score: 85, predicted: 87 },
    { month: 'Feb', score: 88, predicted: 89 },
    { month: 'Mar', score: 82, predicted: 85 },
    { month: 'Apr', score: 90, predicted: 91 },
    { month: 'May', score: 87, predicted: 89 },
    { month: 'Jun', score: 93, predicted: 94 },
  ];

  const riskData = [
    { category: 'Data Privacy', current: 25, predicted: 18 },
    { category: 'Financial', current: 35, predicted: 28 },
    { category: 'Operational', current: 20, predicted: 15 },
    { category: 'Regulatory', current: 30, predicted: 22 },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Predictive Analytics</h1>
        <p className="text-gray-600 mt-2">AI-powered insights and predictions for compliance management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Compliance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+5.2%</div>
            <p className="text-xs text-gray-600">Predicted improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">27.5</div>
            <p className="text-xs text-gray-600">Down from 35.2</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              Security Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">A+</div>
            <p className="text-xs text-gray-600">Maintained rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">89%</div>
            <p className="text-xs text-gray-600">Towards 95% target</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Score Prediction</CardTitle>
            <CardDescription>
              Historical data vs AI predictions for the next 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Actual Score"
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Category Analysis</CardTitle>
            <CardDescription>
              Current vs predicted risk levels by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="#ef4444" name="Current Risk" />
                <Bar dataKey="predicted" fill="#10b981" name="Predicted Risk" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;
