
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  DollarSign, 
  FileText, 
  Activity, 
  RefreshCw, 
  Calendar,
  AlertTriangle,
  TrendingUp,
  Shield,
  CheckCircle,
  Clock
} from 'lucide-react';
import { workdayService, WorkdaySync } from '@/utils/workday/workdayService';
import { toast } from 'sonner';

const WorkdayDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [syncs, setSyncs] = useState<WorkdaySync[]>([]);
  const [stats, setStats] = useState({
    employees: 0,
    financialRecords: 0,
    documents: 0,
    auditLogs: 0,
    complianceScore: 85,
    riskLevel: 'Medium' as 'Low' | 'Medium' | 'High',
    lastSync: null as string | null
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!workdayService.isConnected()) return;

    setIsLoading(true);
    try {
      // Load sync history
      const syncHistory = workdayService.getSavedSyncs();
      setSyncs(syncHistory.slice(-5)); // Show last 5 syncs

      // Simulate loading stats
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        employees: 1247,
        financialRecords: 8934,
        documents: 156,
        auditLogs: 12847,
        complianceScore: Math.floor(Math.random() * 20) + 80,
        riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
        lastSync: localStorage.getItem('workday_last_sync')
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    setIsLoading(true);
    try {
      const sync = await workdayService.triggerManualSync();
      setSyncs(prev => [sync, ...prev.slice(0, 4)]);
      await loadDashboardData();
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleSync = async (schedule: 'daily' | 'weekly' | 'monthly') => {
    try {
      const sync = await workdayService.scheduleSync(schedule);
      setSyncs(prev => [sync, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error('Failed to schedule sync:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-700">Completed</Badge>;
      case 'running':
        return <Badge variant="default" className="bg-blue-100 text-blue-700">Running</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-amber-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!workdayService.isConnected()) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Shield className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Connect to Workday</h3>
          <p className="text-muted-foreground text-center mb-4">
            Connect your Workday tenant to view compliance analytics and sync data
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
          <h2 className="text-2xl font-bold">Workday Integration</h2>
          <p className="text-muted-foreground">
            Monitor compliance data synced from your Workday tenant
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadDashboardData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleManualSync}
            disabled={isLoading}
          >
            <Activity className="h-4 w-4 mr-2" />
            Sync Now
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Employees</p>
                <p className="text-2xl font-bold">{stats.employees.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Financial Records</p>
                <p className="text-2xl font-bold">{stats.financialRecords.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">{stats.documents}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Audit Logs</p>
                <p className="text-2xl font-bold">{stats.auditLogs.toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Compliance Health
            </CardTitle>
            <CardDescription>
              Overall compliance score based on Workday data analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className="text-sm font-bold">{stats.complianceScore}%</span>
                </div>
                <Progress value={stats.complianceScore} className="h-2" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <Badge variant="outline" className={getRiskColor(stats.riskLevel)}>
                  {stats.riskLevel}
                </Badge>
              </div>
              {stats.lastSync && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Last updated: {new Date(stats.lastSync).toLocaleString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Sync Schedule
            </CardTitle>
            <CardDescription>
              Configure automated data synchronization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleScheduleSync('daily')}
                className="w-full justify-start"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Daily Sync
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleScheduleSync('weekly')}
                className="w-full justify-start"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Weekly Sync
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleScheduleSync('monthly')}
                className="w-full justify-start"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Monthly Sync
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Syncs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Syncs</CardTitle>
          <CardDescription>
            History of data synchronization from Workday
          </CardDescription>
        </CardHeader>
        <CardContent>
          {syncs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No sync history available. Start your first sync above.
            </p>
          ) : (
            <div className="space-y-3">
              {syncs.map((sync) => (
                <div key={sync.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {sync.type === 'manual' ? 'Manual Sync' : `Scheduled (${sync.schedule})`}
                      </span>
                      {sync.lastRun && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(sync.lastRun).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {sync.recordsProcessed && (
                      <span className="text-xs text-muted-foreground">
                        {sync.recordsProcessed} records
                      </span>
                    )}
                    {getStatusBadge(sync.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkdayDashboard;
