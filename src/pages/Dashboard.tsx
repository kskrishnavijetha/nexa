
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { generateScores } from '@/utils/scoreService';
import { RiskItem } from '@/utils/types';
import { generateRisks } from '@/utils/riskService';
import { ArrowLeft, Clock, AlertTriangle, Activity, Shield, Info } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [auditTrail, setAuditTrail] = useState<{action: string, timestamp: string, user: string}[]>([]);
  
  // Generate sample compliance data
  const scores = generateScores();
  const risks = generateRisks(
    scores.gdprScore, 
    scores.hipaaScore, 
    scores.soc2Score, 
    scores.pciDssScore
  );
  
  // Parse data for charts
  const complianceScores = [
    { name: 'GDPR', score: scores.gdprScore },
    { name: 'HIPAA', score: scores.hipaaScore },
    { name: 'SOC 2', score: scores.soc2Score },
    { name: 'PCI-DSS', score: scores.pciDssScore }
  ];
  
  // Count risks by severity for pie chart
  const risksBySeverity = risks.reduce((acc: Record<string, number>, risk: RiskItem) => {
    acc[risk.severity] = (acc[risk.severity] || 0) + 1;
    return acc;
  }, {});
  
  const riskPieData = Object.entries(risksBySeverity).map(([severity, count]) => ({
    name: severity.charAt(0).toUpperCase() + severity.slice(1),
    value: count
  }));

  // Generate mock audit trail
  useEffect(() => {
    const mockAuditTrail = [
      { action: 'Document uploaded: compliance-policy-2023.pdf', timestamp: '2023-10-15 09:23:45', user: 'John Doe' },
      { action: 'Risk assessment completed', timestamp: '2023-10-15 09:25:12', user: 'System' },
      { action: 'Report downloaded', timestamp: '2023-10-15 10:15:33', user: 'Jane Smith' },
      { action: 'Document uploaded: vendor-agreement.docx', timestamp: '2023-10-14 14:45:21', user: 'Michael Brown' },
      { action: 'Risk assessment completed', timestamp: '2023-10-14 14:48:05', user: 'System' },
      { action: 'Compliance alert: High severity finding in GDPR compliance', timestamp: '2023-10-14 14:50:30', user: 'System' },
      { action: 'Remediation plan created', timestamp: '2023-10-14 16:20:15', user: 'Jane Smith' }
    ];
    
    setAuditTrail(mockAuditTrail);
  }, []);

  // Colors for pie chart
  const COLORS = ['#ff4d4f', '#faad14', '#52c41a'];
  
  // Get appropriate color for score
  const getScoreColor = (score: number) => {
    if (score < 70) return 'text-red-500';
    if (score < 85) return 'text-amber-500';
    return 'text-green-500';
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          
          <div className="flex items-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/document-analysis')}
              className="mr-2"
            >
              Upload New Document
            </Button>
            <Button>Generate Report</Button>
          </div>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring of your organization's compliance status</p>
        </div>
        
        {/* Score Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md col-span-1 lg:col-span-1">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Overall Score</h3>
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(scores.overallScore)}`}>
              {scores.overallScore}%
            </div>
            <Progress value={scores.overallScore} className="h-2" />
          </div>
          
          {complianceScores.map((item) => (
            <div key={item.name} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{item.name}</h3>
              <div className={`text-3xl font-bold mb-2 ${getScoreColor(item.score)}`}>
                {item.score}%
              </div>
              <Progress value={item.score} className="h-2" />
            </div>
          ))}
        </div>
        
        {/* Tabbed content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-lg shadow-md p-6">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Compliance Scores by Framework</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={complianceScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#8884d8" name="Compliance Score (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Pie Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Risks by Severity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {riskPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {auditTrail.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-start border-b pb-3">
                    <Activity className="mr-2 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{item.action}</p>
                      <div className="flex text-sm text-muted-foreground">
                        <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {item.timestamp}</span>
                        <span className="mx-2">•</span>
                        <span>{item.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="risks">
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="text-sm text-muted-foreground">High Severity</div>
                  <div className="text-2xl font-bold">{risks.filter(r => r.severity === 'high').length}</div>
                </div>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                  <div className="text-sm text-muted-foreground">Medium Severity</div>
                  <div className="text-2xl font-bold">{risks.filter(r => r.severity === 'medium').length}</div>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <div className="text-sm text-muted-foreground">Low Severity</div>
                  <div className="text-2xl font-bold">{risks.filter(r => r.severity === 'low').length}</div>
                </div>
              </div>
              
              <div className="overflow-auto">
                <h3 className="text-lg font-medium mb-4">Identified Risks</h3>
                <div className="space-y-4">
                  {risks.map((risk, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded border-l-4 ${
                        risk.severity === 'high' ? 'border-red-500 bg-red-50' : 
                        risk.severity === 'medium' ? 'border-amber-500 bg-amber-50' : 
                        'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">{risk.description}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          risk.severity === 'high' ? 'bg-red-100 text-red-800' : 
                          risk.severity === 'medium' ? 'bg-amber-100 text-amber-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {risk.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">
                        <span className="font-medium">{risk.regulation}</span>
                        {risk.section && ` - ${risk.section}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="audit">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Audit Trail</h3>
              <div className="space-y-4">
                {auditTrail.map((item, index) => (
                  <div key={index} className="flex items-start border-b pb-3">
                    {item.action.includes('alert') ? (
                      <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                    ) : item.action.includes('uploaded') ? (
                      <Info className="mr-2 h-5 w-5 text-blue-500" />
                    ) : item.action.includes('completed') ? (
                      <Shield className="mr-2 h-5 w-5 text-green-500" />
                    ) : (
                      <Activity className="mr-2 h-5 w-5 text-primary" />
                    )}
                    <div>
                      <p className="font-medium">{item.action}</p>
                      <div className="flex text-sm text-muted-foreground">
                        <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {item.timestamp}</span>
                        <span className="mx-2">•</span>
                        <span>{item.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
