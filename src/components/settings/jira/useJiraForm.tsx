
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { JiraSettings, JiraProject, JiraIssueType } from './types';

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
    issueType: '10001',
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
      } catch (err) {
        console.error('Error loading Jira settings', err);
      }
    }
  }, [setValue]);

  // When connection status changes, fetch projects
  useEffect(() => {
    if (isConnected && formValues.domain && formValues.apiToken) {
      fetchProjects();
    }
  }, [isConnected, formValues.domain, formValues.apiToken]);

  // When project changes, fetch issue types
  useEffect(() => {
    if (isConnected && formValues.projectKey) {
      fetchIssueTypes();
    }
  }, [formValues.projectKey, isConnected]);

  const fetchProjects = async () => {
    setIsLoading(true);
    // Simulated API call
    setTimeout(() => {
      setProjects([
        { id: "10000", key: "NB", name: "NexaBloom" },
        { id: "10001", key: "COMP", name: "Compliance" },
        { id: "10002", key: "AUDIT", name: "Audits" }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const fetchIssueTypes = async () => {
    setIsLoading(true);
    // Simulated API call
    setTimeout(() => {
      setIssueTypes([
        { id: "10001", name: "Task", description: "A task that needs to be done." },
        { id: "10002", name: "Bug", description: "A problem which impairs or prevents functionality." },
        { id: "10003", name: "Compliance Issue", description: "A compliance related issue requiring action." }
      ]);
      setIsLoading(false);
    }, 800);
  };

  const testConnection = async () => {
    setTestingConnection(true);
    if (!formValues.domain || !formValues.email || !formValues.apiToken) {
      toast.error("Please fill in all required fields");
      setTestingConnection(false);
      return;
    }

    setTimeout(() => {
      setIsConnected(true);
      setValue('connected', true);
      toast.success("Successfully connected to Jira!");
      setTestingConnection(false);
    }, 1500);
  };

  const disconnectJira = () => {
    setIsConnected(false);
    setValue('connected', false);
    setValue('projectKey', '');
    setValue('issueType', '');
    toast.info("Jira integration disconnected");
  };

  const onSubmit = (data: JiraSettings) => {
    setIsLoading(true);
    localStorage.setItem('nexabloom_jira_settings', JSON.stringify(data));
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Jira integration settings saved successfully");
    }, 1000);
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
    onSubmit
  };
};
