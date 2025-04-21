
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { JiraSettings, JiraProject, JiraIssueType } from './types';
import { 
  testJiraConnection, 
  fetchJiraProjects, 
  fetchJiraIssueTypes 
} from '@/utils/jira/jiraService';

export const useJiraForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [issueTypes, setIssueTypes] = useState<JiraIssueType[]>([]);

  const defaultValues: JiraSettings = {
    connected: false,
    domain: '',
    email: '',
    apiToken: '',
    projectKey: '',
    issueType: '',
    createIssuesForHighRiskOnly: true,
    createIssuesForViolations: true,
    createIssuesForRisks: true,
    createIssuesForAuditEntries: false
  };

  const form = useForm<JiraSettings>({
    defaultValues
  });

  const { setValue, watch } = form;
  const formValues = watch();

  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('nexabloom_jira_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        Object.entries(settings).forEach(([key, value]) => {
          setValue(key as any, value);
        });
        setIsConnected(settings.connected || false);
        
        // If connected, fetch projects
        if (settings.connected) {
          fetchProjects(settings);
        }
      } catch (err) {
        console.error('Error loading Jira settings', err);
      }
    }
  }, [setValue]);

  // When project changes, fetch issue types
  useEffect(() => {
    if (isConnected && formValues.projectKey) {
      fetchIssueTypes();
    }
  }, [formValues.projectKey, isConnected]);

  const fetchProjects = async (settings: JiraSettings) => {
    setIsLoading(true);
    try {
      const projectList = await fetchJiraProjects(settings);
      setProjects(projectList);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch Jira projects');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIssueTypes = async () => {
    setIsLoading(true);
    try {
      const types = await fetchJiraIssueTypes(formValues);
      setIssueTypes(types);
    } catch (error) {
      console.error('Error fetching issue types:', error);
      toast.error('Failed to fetch issue types');
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    try {
      if (!formValues.domain || !formValues.email || !formValues.apiToken) {
        toast.error("Please fill in all required fields");
        return;
      }

      const success = await testJiraConnection(formValues);
      
      if (success) {
        setIsConnected(true);
        setValue('connected', true);
        toast.success("Successfully connected to Jira!");
        
        // Fetch projects after successful connection
        await fetchProjects(formValues);
      } else {
        toast.error("Failed to connect to Jira. Please check your credentials.");
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error("Failed to connect to Jira");
    } finally {
      setTestingConnection(false);
    }
  };

  const disconnectJira = () => {
    setIsConnected(false);
    setValue('connected', false);
    setValue('projectKey', '');
    setValue('issueType', '');
    setProjects([]);
    setIssueTypes([]);
    toast.info("Jira integration disconnected");
  };

  const addProject = (newProject: JiraProject) => {
    setProjects(prev => [...prev, newProject]);
    toast.success(`Project ${newProject.name} added successfully`);
    
    // If this is the first project, automatically select it
    if (!formValues.projectKey && newProject.key) {
      setValue('projectKey', newProject.key);
    }
  };
  
  const addIssueType = (newIssueType: JiraIssueType) => {
    setIssueTypes(prev => [...prev, newIssueType]);
    toast.success(`Issue type ${newIssueType.name} added successfully`);
    
    // If this is the first issue type, automatically select it
    if (!formValues.issueType && newIssueType.id) {
      setValue('issueType', newIssueType.id);
    }
  };

  const onSubmit = async (data: JiraSettings) => {
    setIsLoading(true);
    try {
      localStorage.setItem('nexabloom_jira_settings', JSON.stringify(data));
      toast.success("Jira integration settings saved successfully");
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    isConnected,
    testingConnection,
    projects,
    issueTypes,
    testConnection,
    disconnectJira,
    addProject,
    addIssueType,
    onSubmit
  };
};
