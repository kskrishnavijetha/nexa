
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getHistoricalReports } from '@/utils/historyService';
import { ComplianceReport } from '@/utils/types';
import { useNavigate, useLocation } from 'react-router-dom';

const AuditReports: React.FC = () => {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load reports from history service
    const historicalReports = getHistoricalReports();
    setReports(historicalReports);
  }, []);

  const filteredReports = reports.filter(report => 
    report.documentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewAudit = (documentName: string) => {
    // Use location state to prevent blinking during navigation
    navigate({
      pathname: '/history',
      search: `?document=${encodeURIComponent(documentName)}&tab=audit`
    }, { 
      replace: true,
      state: { preventBlink: true }
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Audit Reports</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Document Audit Trail Reports</CardTitle>
          <CardDescription>View and download AI-enhanced audit trails for all analyzed documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {filteredReports.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Analysis Date</TableHead>
                  <TableHead>Overall Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map(report => (
                  <TableRow key={report.documentId}>
                    <TableCell className="font-medium">{report.documentName}</TableCell>
                    <TableCell>{new Date(report.timestamp).toLocaleString()}</TableCell>
                    <TableCell className={
                      report.overallScore >= 80 ? 'text-green-500' : 
                      report.overallScore >= 70 ? 'text-amber-500' : 
                      'text-red-500'
                    }>
                      {report.overallScore}%
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => viewAudit(report.documentName)}>
                        <Download className="mr-2 h-4 w-4" />
                        View Audit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-4 border rounded">
              <p className="text-muted-foreground">No audit reports found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditReports;
