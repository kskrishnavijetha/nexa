
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Database, Shield, Brain, FileText, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';

interface Dataset {
  id: string;
  name: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  status: string;
  compliance_status: string;
  upload_date: string;
}

interface ProcessingJob {
  id: string;
  job_type: string;
  status: string;
  progress: number;
  created_at: string;
  error_message?: string;
}

const IvoryCoreDataPage = () => {
  const { user } = useAuth();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDatasets();
      loadJobs();
    }
  }, [user]);

  const loadDatasets = async () => {
    try {
      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDatasets(data || []);
    } catch (error) {
      console.error('Error loading datasets:', error);
      toast.error('Failed to load datasets');
    } finally {
      setIsLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('data_processing_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', datasetName || selectedFile.name);

      const { data, error } = await supabase.functions.invoke('ivorynth-upload', {
        body: formData,
      });

      if (error) throw error;

      toast.success('File uploaded successfully');
      setSelectedFile(null);
      setDatasetName('');
      loadDatasets();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const startDataCleaning = async (datasetId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ivorynth-clean', {
        body: {
          datasetId,
          options: {
            removeDuplicates: true,
            handleMissingValues: 'fill',
            normalizeText: true,
            standardizeFormats: true
          }
        }
      });

      if (error) throw error;
      toast.success('Data cleaning started');
      loadJobs();
    } catch (error) {
      console.error('Cleaning error:', error);
      toast.error('Failed to start data cleaning');
    }
  };

  const startComplianceCheck = async (datasetId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ivorynth-compliance', {
        body: {
          datasetId,
          regulations: ['GDPR', 'HIPAA', 'PCI_DSS']
        }
      });

      if (error) throw error;
      toast.success('Compliance check started');
      loadJobs();
    } catch (error) {
      console.error('Compliance error:', error);
      toast.error('Failed to start compliance check');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'non_compliant':
        return 'bg-red-100 text-red-800';
      case 'requires_review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please sign in to use IvoryCore</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Database className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">IvoryCore Data Processing</h1>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="jobs">Processing Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Dataset
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Dataset Name</label>
                <Input
                  placeholder="Enter dataset name (optional)"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">File (CSV, JSON, SQL)</label>
                <Input
                  type="file"
                  accept=".csv,.json,.sql"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>

              <Button 
                onClick={handleFileUpload} 
                disabled={!selectedFile || isUploading}
                className="w-full"
              >
                {isUploading ? 'Uploading...' : 'Upload Dataset'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="datasets" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : datasets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No datasets uploaded yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {datasets.map((dataset) => (
                <Card key={dataset.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{dataset.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {dataset.original_filename} • {(dataset.file_size / 1024).toFixed(1)} KB
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{dataset.file_type.toUpperCase()}</Badge>
                          <Badge variant="outline">{dataset.status}</Badge>
                          <Badge className={getComplianceStatusColor(dataset.compliance_status)}>
                            {dataset.compliance_status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startDataCleaning(dataset.id)}
                          disabled={dataset.status === 'cleaning'}
                        >
                          <Brain className="h-4 w-4 mr-2" />
                          Clean Data
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startComplianceCheck(dataset.id)}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Check Compliance
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processing Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No processing jobs yet</p>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <p className="font-medium">{job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1)} Job</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(job.created_at).toLocaleString()}
                          </p>
                          {job.error_message && (
                            <p className="text-sm text-red-600 mt-1">{job.error_message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {job.status === 'running' && (
                          <div className="flex items-center gap-2">
                            <Progress value={job.progress} className="w-20" />
                            <span className="text-sm">{job.progress}%</span>
                          </div>
                        )}
                        <Badge variant={job.status === 'completed' ? 'default' : job.status === 'failed' ? 'destructive' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IvoryCoreDataPage;
