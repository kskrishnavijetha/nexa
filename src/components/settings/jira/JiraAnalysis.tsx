
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useJiraForm } from '@/hooks/useJiraForm';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BarChart, Download, Plus } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const projectSchema = z.object({
  key: z.string().min(1, 'Project key is required'),
  name: z.string().min(1, 'Project name is required'),
});

const issueTypeSchema = z.object({
  name: z.string().min(1, 'Issue type name is required'),
  description: z.string().optional(),
});

const JiraAnalysis: React.FC = () => {
  const { toast } = useToast();
  const { projects, issueTypes, addProject, addIssueType } = useJiraForm();
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isIssueTypeDialogOpen, setIsIssueTypeDialogOpen] = useState(false);

  // Project form
  const projectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      key: '',
      name: '',
    },
  });

  // Issue type form
  const issueTypeForm = useForm<z.infer<typeof issueTypeSchema>>({
    resolver: zodResolver(issueTypeSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onAddProject = async (data: z.infer<typeof projectSchema>) => {
    try {
      // Ensure we're passing a valid JiraProject object with required fields
      await addProject({
        key: data.key, // This is now guaranteed to be non-empty due to schema validation
        name: data.name, // This is now guaranteed to be non-empty due to schema validation
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
      // Ensure we're passing a valid JiraIssueType object with required fields
      await addIssueType({
        name: data.name, // This is now guaranteed to be non-empty due to schema validation
        description: data.description || '', // Default to empty string if undefined
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
    
    // Projects table
    doc.setFontSize(14);
    doc.text('Projects', 14, 50);
    
    // @ts-ignore - jspdf-autotable types
    doc.autoTable({
      startY: 55,
      head: [['Key', 'Name']],
      body: projects.map(project => [project.key, project.name]),
    });
    
    // Issue types table
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
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Issue Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{issueTypes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Sync Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">Active</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Projects Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium">Jira Projects</h4>
            <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Project</DialogTitle>
                  <DialogDescription>
                    Add a new Jira project to sync with NexaBloom.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...projectForm}>
                  <form onSubmit={projectForm.handleSubmit(onAddProject)} className="space-y-4">
                    <FormField
                      control={projectForm.control}
                      name="key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Key</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. PROJ" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={projectForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. My Project" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit">Add Project</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length > 0 ? (
                  projects.map((project, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{project.key}</TableCell>
                      <TableCell>{project.name}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      No projects configured
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Issue Types Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium">Issue Types</h4>
            <Dialog open={isIssueTypeDialogOpen} onOpenChange={setIsIssueTypeDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Issue Type</DialogTitle>
                  <DialogDescription>
                    Add a new Jira issue type for tracking.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...issueTypeForm}>
                  <form onSubmit={issueTypeForm.handleSubmit(onAddIssueType)} className="space-y-4">
                    <FormField
                      control={issueTypeForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue Type Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Bug" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={issueTypeForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Issues that need to be fixed" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit">Add Issue Type</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issueTypes.length > 0 ? (
                  issueTypes.map((issueType, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{issueType.name}</TableCell>
                      <TableCell>{issueType.description || '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      No issue types configured
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JiraAnalysis;
