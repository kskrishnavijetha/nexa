
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Eye, User, FileText, Settings, Shield } from 'lucide-react';

const auditData = [
  {
    id: '1',
    timestamp: '2024-01-15 14:32:00',
    user: 'john.doe@company.com',
    action: 'Document Upload',
    resource: 'Financial_Report_Q4.pdf',
    status: 'Success',
    ip: '192.168.1.100',
    details: 'Uploaded compliance document for Q4 review'
  },
  {
    id: '2',
    timestamp: '2024-01-15 13:28:15',
    user: 'jane.smith@company.com',
    action: 'Policy Update',
    resource: 'Privacy Policy v2.1',
    status: 'Success',
    ip: '192.168.1.105',
    details: 'Updated privacy policy with GDPR amendments'
  },
  {
    id: '3',
    timestamp: '2024-01-15 12:45:30',
    user: 'admin@company.com',
    action: 'User Access',
    resource: 'Compliance Dashboard',
    status: 'Failed',
    ip: '192.168.1.200',
    details: 'Failed login attempt - invalid credentials'
  },
  {
    id: '4',
    timestamp: '2024-01-15 11:15:45',
    user: 'compliance@company.com',
    action: 'Report Generation',
    resource: 'SOX Compliance Report',
    status: 'Success',
    ip: '192.168.1.110',
    details: 'Generated annual SOX compliance report'
  },
];

const AuditTrail = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'document upload':
        return <FileText className="h-4 w-4" />;
      case 'policy update':
        return <Settings className="h-4 w-4" />;
      case 'user access':
        return <User className="h-4 w-4" />;
      case 'report generation':
        return <Shield className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const filteredData = auditData.filter(item => {
    const matchesSearch = item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter;
    const matchesAction = actionFilter === 'all' || item.action.toLowerCase().includes(actionFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesAction;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
        <p className="text-gray-600 mt-2">Complete log of all system activities and changes</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
          <CardDescription>
            Filter audit logs by user, action, or status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by user, action, or resource..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="user">User Access</SelectItem>
                <SelectItem value="report">Report</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit Log Entries</CardTitle>
          <CardDescription>
            {filteredData.length} entries found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredData.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getActionIcon(entry.action)}
                        <span className="font-medium">{entry.action}</span>
                      </div>
                      <Badge className={getStatusColor(entry.status)}>
                        {entry.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div><strong>User:</strong> {entry.user}</div>
                      <div><strong>Timestamp:</strong> {entry.timestamp}</div>
                      <div><strong>Resource:</strong> {entry.resource}</div>
                      <div><strong>IP Address:</strong> {entry.ip}</div>
                    </div>
                    {entry.details && (
                      <div className="mt-2 text-sm text-gray-700">
                        <strong>Details:</strong> {entry.details}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrail;
