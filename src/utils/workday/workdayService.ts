
import { toast } from 'sonner';

export interface WorkdayConfig {
  tenantUrl: string;
  clientId: string;
  clientSecret: string;
  refreshToken?: string;
  accessToken?: string;
  tokenExpiry?: string;
}

export interface WorkdayEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  hireDate: string;
  status: 'active' | 'inactive';
}

export interface WorkdayFinancialRecord {
  id: string;
  type: 'expense' | 'revenue' | 'payroll';
  amount: number;
  currency: string;
  date: string;
  description: string;
  category: string;
}

export interface WorkdayDocument {
  id: string;
  name: string;
  type: 'policy' | 'procedure' | 'report' | 'contract';
  lastModified: string;
  size: number;
  url: string;
}

export interface WorkdayAuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
}

export interface WorkdaySync {
  id: string;
  type: 'manual' | 'scheduled';
  status: 'pending' | 'running' | 'completed' | 'failed';
  lastRun?: string;
  nextRun?: string;
  schedule?: 'daily' | 'weekly' | 'monthly';
  recordsProcessed?: number;
  errors?: string[];
}

export class WorkdayService {
  private config: WorkdayConfig | null = null;
  private baseUrl = '';

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const saved = localStorage.getItem('workday_config');
    if (saved) {
      this.config = JSON.parse(saved);
      this.baseUrl = this.config?.tenantUrl ? `${this.config.tenantUrl}/ccx/api/v1` : '';
    }
  }

  private saveConfig(config: WorkdayConfig) {
    this.config = config;
    this.baseUrl = `${config.tenantUrl}/ccx/api/v1`;
    localStorage.setItem('workday_config', JSON.stringify(config));
  }

  async authenticateWithOAuth2(tenantUrl: string, clientId: string, clientSecret: string): Promise<boolean> {
    try {
      // In a real implementation, this would redirect to Workday OAuth2 flow
      // For demo purposes, we'll simulate successful authentication
      console.log('[WorkdayService] Initiating OAuth2 flow...');
      
      // Simulate OAuth2 token exchange
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockConfig: WorkdayConfig = {
        tenantUrl,
        clientId,
        clientSecret,
        accessToken: `wd_access_${Date.now()}`,
        refreshToken: `wd_refresh_${Date.now()}`,
        tokenExpiry: new Date(Date.now() + 3600000).toISOString()
      };

      this.saveConfig(mockConfig);
      toast.success('Successfully connected to Workday');
      return true;
    } catch (error) {
      console.error('[WorkdayService] Authentication failed:', error);
      toast.error('Failed to connect to Workday');
      return false;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.config?.refreshToken) return false;

    try {
      // Simulate token refresh
      console.log('[WorkdayService] Refreshing access token...');
      await new Promise(resolve => setTimeout(resolve, 500));

      this.config.accessToken = `wd_access_${Date.now()}`;
      this.config.tokenExpiry = new Date(Date.now() + 3600000).toISOString();
      this.saveConfig(this.config);
      
      return true;
    } catch (error) {
      console.error('[WorkdayService] Token refresh failed:', error);
      return false;
    }
  }

  isConnected(): boolean {
    return !!this.config?.accessToken;
  }

  getConnectionStatus(): { connected: boolean; tenantUrl?: string; lastSync?: string } {
    return {
      connected: this.isConnected(),
      tenantUrl: this.config?.tenantUrl,
      lastSync: localStorage.getItem('workday_last_sync') || undefined
    };
  }

  async fetchEmployees(limit = 100): Promise<WorkdayEmployee[]> {
    if (!this.isConnected()) throw new Error('Not connected to Workday');

    try {
      console.log('[WorkdayService] Fetching employees...');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock employee data
      const employees: WorkdayEmployee[] = Array.from({ length: limit }, (_, i) => ({
        id: `emp_${i + 1}`,
        name: `Employee ${i + 1}`,
        email: `employee${i + 1}@company.com`,
        department: ['HR', 'IT', 'Finance', 'Operations'][i % 4],
        position: ['Manager', 'Analyst', 'Specialist', 'Director'][i % 4],
        hireDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toISOString(),
        status: i % 10 === 0 ? 'inactive' : 'active'
      }));

      return employees;
    } catch (error) {
      console.error('[WorkdayService] Failed to fetch employees:', error);
      throw error;
    }
  }

  async fetchFinancialRecords(fromDate?: string, toDate?: string): Promise<WorkdayFinancialRecord[]> {
    if (!this.isConnected()) throw new Error('Not connected to Workday');

    try {
      console.log('[WorkdayService] Fetching financial records...');
      await new Promise(resolve => setTimeout(resolve, 1200));

      const records: WorkdayFinancialRecord[] = Array.from({ length: 50 }, (_, i) => ({
        id: `fin_${i + 1}`,
        type: ['expense', 'revenue', 'payroll'][i % 3] as 'expense' | 'revenue' | 'payroll',
        amount: Math.floor(Math.random() * 100000) + 1000,
        currency: 'USD',
        date: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
        description: `Financial transaction ${i + 1}`,
        category: ['Operations', 'Payroll', 'Marketing', 'IT'][i % 4]
      }));

      return records;
    } catch (error) {
      console.error('[WorkdayService] Failed to fetch financial records:', error);
      throw error;
    }
  }

  async fetchDocuments(): Promise<WorkdayDocument[]> {
    if (!this.isConnected()) throw new Error('Not connected to Workday');

    try {
      console.log('[WorkdayService] Fetching documents...');
      await new Promise(resolve => setTimeout(resolve, 800));

      const documents: WorkdayDocument[] = Array.from({ length: 25 }, (_, i) => ({
        id: `doc_${i + 1}`,
        name: `${['Employee Handbook', 'Privacy Policy', 'Financial Report', 'Audit Report', 'Compliance Policy'][i % 5]} ${i + 1}`,
        type: ['policy', 'procedure', 'report', 'contract'][i % 4] as 'policy' | 'procedure' | 'report' | 'contract',
        lastModified: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
        size: Math.floor(Math.random() * 5000000) + 100000,
        url: `https://workday.com/documents/doc_${i + 1}`
      }));

      return documents;
    } catch (error) {
      console.error('[WorkdayService] Failed to fetch documents:', error);
      throw error;
    }
  }

  async fetchAuditLogs(fromDate?: string, toDate?: string): Promise<WorkdayAuditLog[]> {
    if (!this.isConnected()) throw new Error('Not connected to Workday');

    try {
      console.log('[WorkdayService] Fetching audit logs...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const logs: WorkdayAuditLog[] = Array.from({ length: 100 }, (_, i) => ({
        id: `audit_${i + 1}`,
        timestamp: new Date(Date.now() - (i * 3600000)).toISOString(),
        user: `user${(i % 10) + 1}@company.com`,
        action: ['LOGIN', 'LOGOUT', 'CREATE_EMPLOYEE', 'UPDATE_EMPLOYEE', 'DELETE_DOCUMENT', 'ACCESS_REPORT'][i % 6],
        resource: ['Employee Data', 'Financial Records', 'Policy Documents', 'Audit Reports'][i % 4],
        details: `Action performed: ${['LOGIN', 'LOGOUT', 'CREATE_EMPLOYEE', 'UPDATE_EMPLOYEE', 'DELETE_DOCUMENT', 'ACCESS_REPORT'][i % 6]}`
      }));

      return logs;
    } catch (error) {
      console.error('[WorkdayService] Failed to fetch audit logs:', error);
      throw error;
    }
  }

  async scheduleSync(schedule: 'daily' | 'weekly' | 'monthly'): Promise<WorkdaySync> {
    if (!this.isConnected()) throw new Error('Not connected to Workday');

    const sync: WorkdaySync = {
      id: `sync_${Date.now()}`,
      type: 'scheduled',
      status: 'pending',
      schedule,
      nextRun: this.calculateNextRun(schedule)
    };

    // Store sync configuration
    const syncs = this.getSavedSyncs();
    syncs.push(sync);
    localStorage.setItem('workday_syncs', JSON.stringify(syncs));

    toast.success(`Scheduled ${schedule} sync successfully`);
    return sync;
  }

  async triggerManualSync(): Promise<WorkdaySync> {
    if (!this.isConnected()) throw new Error('Not connected to Workday');

    const sync: WorkdaySync = {
      id: `sync_${Date.now()}`,
      type: 'manual',
      status: 'running'
    };

    try {
      // Simulate sync process
      console.log('[WorkdayService] Starting manual sync...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      sync.status = 'completed';
      sync.recordsProcessed = Math.floor(Math.random() * 1000) + 100;
      sync.lastRun = new Date().toISOString();

      localStorage.setItem('workday_last_sync', sync.lastRun);
      toast.success(`Sync completed successfully. Processed ${sync.recordsProcessed} records.`);
    } catch (error) {
      sync.status = 'failed';
      sync.errors = ['Sync failed due to network error'];
      toast.error('Sync failed');
    }

    const syncs = this.getSavedSyncs();
    syncs.push(sync);
    localStorage.setItem('workday_syncs', JSON.stringify(syncs));

    return sync;
  }

  getSavedSyncs(): WorkdaySync[] {
    const saved = localStorage.getItem('workday_syncs');
    return saved ? JSON.parse(saved) : [];
  }

  private calculateNextRun(schedule: 'daily' | 'weekly' | 'monthly'): string {
    const now = new Date();
    switch (schedule) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString();
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    }
  }

  disconnect() {
    localStorage.removeItem('workday_config');
    localStorage.removeItem('workday_syncs');
    localStorage.removeItem('workday_last_sync');
    this.config = null;
    this.baseUrl = '';
    toast.success('Disconnected from Workday');
  }
}

export const workdayService = new WorkdayService();
