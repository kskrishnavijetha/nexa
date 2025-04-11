
import React from 'react';
import { ComplianceReport } from '@/utils/types';
import Simulation from '@/components/simulation/Simulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Sample report data for demonstration
const sampleReport: ComplianceReport = {
  documentId: "sample-doc-123",
  documentName: "Sample Compliance Document",
  industry: "Healthcare",
  timestamp: new Date().toISOString(),
  overallScore: 78,
  gdprScore: 82,
  hipaaScore: 75,
  soc2Score: 76,
  summary: "Sample summary for demonstration purposes.",
  risks: []
};

const ScenarioSimulations: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/sign-in', { replace: true });
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Scenario Simulation & Predictive Analytics</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Radar className="h-5 w-5 text-primary mr-2" />
                <CardTitle>Scenario Simulation & Predictive Analytics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Simulate potential changes in compliance policies to predict future risks and assess the impact of regulatory changes.
              </p>
              
              <Simulation report={sampleReport} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ScenarioSimulations;
