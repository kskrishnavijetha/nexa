
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Users, 
  DollarSign, 
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';
import { workdayService } from '@/utils/workday/workdayService';
import { toast } from 'sonner';

interface ComplianceGap {
  id: string;
  framework: string;
  requirement: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved';
  recommendation: string;
  estimatedEffort: string;
}

interface ComplianceFramework {
  name: string;
  score: number;
  requirements: number;
  passed: number;
  failed: number;
  description: string;
}

const ComplianceAnalysis: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [gaps, setGaps] = useState<ComplianceGap[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>('all');

  useEffect(() => {
    if (workdayService.isConnected()) {
      loadAnalysisData();
    }
  }, []);

  const loadAnalysisData = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockFrameworks: ComplianceFramework[] = [
        {
          name: 'GDPR',
          score: 87,
          requirements: 25,
          passed: 22,
          failed: 3,
          description: 'General Data Protection Regulation compliance for employee data'
        },
        {
          name: 'SOX',
          score: 92,
          requirements: 18,
          passed: 17,
          failed: 1,
          description: 'Sarbanes-Oxley Act compliance for financial reporting'
        },
        {
          name: 'HIPAA',
          score: 78,
          requirements: 12,
          passed: 9,
          failed: 3,
          description: 'Health Insurance Portability and Accountability Act'
        },
        {
          name: 'NIST CSF',
          score: 85,
          requirements: 30,
          passed: 26,
          failed: 4,
          description: 'NIST Cybersecurity Framework implementation'
        },
        {
          name: 'ISO 27001',
          score: 81,
          requirements: 35,
          passed: 28,
          failed: 7,
          description: 'Information Security Management System'
        }
      ];

      const mockGaps: ComplianceGap[] = [
        {
          id: 'gap-1',
          framework: 'GDPR',
          requirement: 'Data Processing Records',
          description: 'Missing comprehensive data processing activity records for employee personal data',
          severity: 'high',
          status: 'open',
          recommendation: 'Implement automated data processing logging in Workday HCM module',
          estimatedEffort: '2-3 weeks'
        },
        {
          id: 'gap-2',
          framework: 'SOX',
          requirement: 'Financial Controls Documentation',
          description: 'Incomplete documentation for payroll processing controls',
          severity: 'medium',
          status: 'in-progress',
          recommendation: 'Complete payroll control documentation and implement quarterly reviews',
          estimatedEffort: '1-2 weeks'
        },
        {
          id: 'gap-3',
          framework: 'HIPAA',
          requirement: 'Access Control Auditing',
          description: 'Insufficient audit trails for health benefit data access',
          severity: 'high',
          status: 'open',
          recommendation: 'Enable comprehensive audit logging for all health data access',
          estimatedEffort: '3-4 weeks'
        },
        {
          id: 'gap-4',
          framework: 'NIST CSF',
          requirement: 'Incident Response Plan',
          description: 'Outdated incident response procedures for HR data breaches',
          severity: 'medium',
          status: 'open',
          recommendation: 'Update incident response plan to include HR-specific breach scenarios',
          estimatedEffort: '1 week'
        },
        {
          id: 'gap-5',
          framework: 'ISO 27001',
          requirement: 'Risk Assessment',
          description: 'Annual risk assessment missing for new Workday integrations',
          severity: 'low',
          status: 'open',
          recommendation: 'Conduct comprehensive risk assessment for all Workday integrations',
          estimatedEffort: '2 weeks'
        }
      ];

      setFrameworks(mockFrameworks);
      setGaps(mockGaps);
      setAnalysisComplete(true);
      toast.success('Compliance analysis completed');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to complete compliance analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!workdayService.isConnected()) {
      toast.error('Please connect to Workday first');
      return;
    }
    await loadAnalysisData();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'open': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredGaps = selectedFramework === 'all' 
    ? gaps 
    : gaps.filter(gap => gap.framework === selectedFramework);

  if (!workdayService.isConnected()) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Shield className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Connect to Workday</h3>
          <p className="text-muted-foreground text-center">
            Connect your Workday tenant to analyze compliance gaps
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Compliance Analysis</h2>
          <p className="text-muted-foreground">
            AI-powered compliance gap analysis using Workday data
          </p>
        </div>
        <Button
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Shield className="h-4 w-4 mr-2" />
          )}
          {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
        </Button>
      </div>

      {isAnalyzing && (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              <div className="text-center">
                <h3 className="font-medium">Analyzing Workday Data</h3>
                <p className="text-sm text-muted-foreground">
                  AI is scanning your Workday data against compliance frameworks...
                </p>
              </div>
              <Progress value={66} className="w-full max-w-md" />
            </div>
          </CardContent>
        </Card>
      )}

      {analysisComplete && (
        <>
          {/* Framework Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {frameworks.map((framework) => (
              <Card key={framework.name}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{framework.name}</h4>
                      <Badge variant="outline" className={
                        framework.score >= 90 ? 'bg-green-100 text-green-700' :
                        framework.score >= 80 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {framework.score}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {framework.description}
                    </p>
                    <div className="space-y-2">
                      <Progress value={framework.score} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{framework.passed} passed</span>
                        <span>{framework.failed} failed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Compliance Gaps */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Compliance Gaps
                  </CardTitle>
                  <CardDescription>
                    Identified compliance issues requiring attention
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedFramework === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFramework('all')}
                  >
                    All
                  </Button>
                  {frameworks.map((framework) => (
                    <Button
                      key={framework.name}
                      variant={selectedFramework === framework.name ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedFramework(framework.name)}
                    >
                      {framework.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredGaps.map((gap) => (
                  <div key={gap.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{gap.requirement}</h4>
                          <Badge variant="outline" className="text-xs">
                            {gap.framework}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {gap.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className={getSeverityColor(gap.severity)}>
                          {gap.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(gap.status)}>
                          {gap.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Recommendation:</strong> {gap.recommendation}
                        <br />
                        <strong>Estimated Effort:</strong> {gap.estimatedEffort}
                      </AlertDescription>
                    </Alert>
                  </div>
                ))}

                {filteredGaps.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No Compliance Gaps Found</h3>
                    <p className="text-muted-foreground">
                      {selectedFramework === 'all' 
                        ? 'All compliance requirements are currently met'
                        : `No gaps found for ${selectedFramework} framework`
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ComplianceAnalysis;
