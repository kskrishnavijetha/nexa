
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useJiraForm } from '@/hooks/useJiraForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Download, Plus } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import JiraStatCards from './components/JiraStatCards';
import JiraProjectDialog, { projectSchema } from './components/JiraProjectDialog';
import JiraIssueTypeDialog, { issueTypeSchema } from './components/JiraIssueTypeDialog';
import { DataTable } from './components/DataTable';
import { z } from 'zod';

const JiraAnalysis: React.FC = () => {
  const { toast } = useToast();
  const { projects, issueTypes, addProject, addIssueType } = useJiraForm();
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isIssueTypeDialogOpen, setIsIssueTypeDialogOpen] = useState(false);

  const projectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      key: '',
      name: '',
    },
  });

  const issueTypeForm = useForm<z.infer<typeof issueTypeSchema>>({
    resolver: zodResolver(issueTypeSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onAddProject = async (data: z.infer<typeof projectSchema>) => {
    try {
      await addProject({
        key: data.key,
        name: data.name,
      });
      
      toast({
        title: 'Project Added',
        description: 'The project has been successfully added.',
      });
      projectForm.reset();
      setIsProjectDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Failed to Add Project',
        description: 'There was a problem adding the project.',
        variant: 'destructive',
      });
    }
  };

  const onAddIssueType = async (data: z.infer<typeof issueTypeSchema>) => {
    try {
      await addIssueType({
        name: data.name,
        description: data.description || '',
      });
      
      toast({
        title: 'Issue Type Added',
        description: 'The issue type has been successfully added.',
      });
      issueTypeForm.reset();
      setIsIssueTypeDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Failed to Add Issue Type',
        description: 'There was a problem adding the issue type.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Jira Integration Analysis', 14, 22);
    
    doc.setFontSize(12);
    doc.text('Nexabloom Jira Integration Report', 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 38);
    
    // @ts-ignore - jspdf-autotable types
    doc.autoTable({
      startY: 55,
      head: [['Key', 'Name']],
      body: projects.map(project => [project.key, project.name]),
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.setFontSize(14);
    doc.text('Issue Types', 14, finalY + 10);
    
    // @ts-ignore - jspdf-autotable types
    doc.autoTable({
      startY: finalY + 15,
      head: [['Name', 'Description']],
      body: issueTypes.map(type => [type.name, type.description || '-']),
    });
    
    doc.save('jira-integration-analysis.pdf');
    
    toast({
      title: 'PDF Downloaded',
      description: 'The analysis report has been downloaded.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Jira Integration Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Overview of your Jira integration setup and statistics.
          </p>
        </div>
        <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Download PDF
        </Button>
      </div>
      
      <JiraStatCards />
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium">Jira Projects</h4>
            <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <JiraProjectDialog form={projectForm} onSubmit={onAddProject} />
            </Dialog>
          </div>
          
          <DataTable
            data={projects}
            columns={[
              { header: 'Key', accessorKey: 'key' },
              { header: 'Name', accessorKey: 'name' },
            ]}
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium">Issue Types</h4>
            <Dialog open={isIssueTypeDialogOpen} onOpenChange={setIsIssueTypeDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <JiraIssueTypeDialog form={issueTypeForm} onSubmit={onAddIssueType} />
            </Dialog>
          </div>
          
          <DataTable
            data={issueTypes}
            columns={[
              { header: 'Name', accessorKey: 'name' },
              { header: 'Description', accessorKey: 'description' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default JiraAnalysis;
