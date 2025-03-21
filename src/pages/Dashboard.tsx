
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComplianceReport } from '@/utils/types';

// Mock data for demonstration
const mockScans: ComplianceReport[] = [
  {
    documentId: '1',
    documentName: 'Privacy Policy v2.0',
    timestamp: new Date().toISOString(),
    overallScore: 85,
    gdprScore: 90,
    hipaaScore: 82,
    soc2Score: 88,
    risks: [
      { description: 'Missing data retention policy', severity: 'medium', regulation: 'GDPR' },
      { description: 'Inadequate breach notification procedure', severity: 'low', regulation: 'HIPAA' },
    ],
    summary: 'Generally compliant with minor improvements needed',
  },
  {
    documentId: '2',
    documentName: 'Data Processing Agreement',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    overallScore: 65,
    gdprScore: 60,
    hipaaScore: 70,
    soc2Score: 65,
    risks: [
      { description: 'Insufficient data subject rights', severity: 'high', regulation: 'GDPR' },
      { description: 'Weak access control provisions', severity: 'medium', regulation: 'SOC 2' },
    ],
    summary: 'Several compliance gaps identified that require attention',
  },
  {
    documentId: '3',
    documentName: 'Patient Consent Form',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    overallScore: 92,
    gdprScore: 95,
    hipaaScore: 94,
    soc2Score: 90,
    risks: [
      { description: 'Minor formatting issues in consent withdrawal procedure', severity: 'low', regulation: 'HIPAA' },
    ],
    summary: 'Highly compliant document with minimal issues',
  },
  {
    documentId: '4',
    documentName: 'Vendor Security Assessment',
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    overallScore: 72,
    gdprScore: 75,
    hipaaScore: 70,
    soc2Score: 78,
    risks: [
      { description: 'Incomplete data processor obligations', severity: 'medium', regulation: 'GDPR' },
      { description: 'Inadequate security controls specification', severity: 'high', regulation: 'SOC 2' },
    ],
    summary: 'Several moderate compliance issues requiring attention',
  },
  {
    documentId: '5',
    documentName: 'Employee Data Handling Policy',
    timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    overallScore: 45,
    gdprScore: 40,
    hipaaScore: 50,
    soc2Score: 48,
    risks: [
      { description: 'Missing legitimate interest assessments', severity: 'high', regulation: 'GDPR' },
      { description: 'No data minimization procedures', severity: 'high', regulation: 'GDPR' },
      { description: 'Weak access control provisions', severity: 'medium', regulation: 'SOC 2' },
    ],
    summary: 'Significant compliance gaps requiring immediate attention',
  },
];

const Dashboard: React.FC = () => {
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const navigate = useNavigate();

  const filteredScans = mockScans.filter(scan => {
    if (riskFilter === 'all') return true;
    
    const worstRiskLevel = getWorstRiskLevel(scan);
    return worstRiskLevel === riskFilter;
  });

  const getWorstRiskLevel = (scan: ComplianceReport): string => {
    if (scan.risks.some(risk => risk.severity === 'high')) return 'high';
    if (scan.risks.some(risk => risk.severity === 'medium')) return 'medium';
    if (scan.risks.some(risk => risk.severity === 'low')) return 'low';
    return 'low';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Info className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const handleViewReport = (documentId: string) => {
    navigate(`/document-analysis?documentId=${documentId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Compliance Dashboard</h1>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Compliance Scans</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by Risk Level:</span>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Risk Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => navigate('/history')}>View History</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Compliance Scan Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScans.map((scan) => {
                const riskLevel = getWorstRiskLevel(scan);
                return (
                  <TableRow key={scan.documentId}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      {scan.documentName}
                    </TableCell>
                    <TableCell>
                      {new Date(scan.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRiskIcon(riskLevel)}
                        <Badge 
                          variant={
                            riskLevel === 'high' ? 'destructive' : 
                            riskLevel === 'medium' ? 'outline' : 'secondary'
                          }
                        >
                          {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={getScoreColor(scan.overallScore)}>
                        {scan.overallScore}%
                      </span>
                    </TableCell>
                    <TableCell>{scan.risks.length}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewReport(scan.documentId)}
                      >
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
