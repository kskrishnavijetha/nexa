
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search } from 'lucide-react';
import { jiraProjectService } from '@/utils/jira/jiraProjectService';
import { JiraProject } from '@/utils/jira/types';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { useJiraForm } from '@/hooks/useJiraForm';

const JiraProjects = () => {
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newProject, setNewProject] = useState({ key: '', name: '' });
  const { toast } = useToast();
  const { addProject } = useJiraForm();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const data = await jiraProjectService.getProjects();
        setProjects(data);
        
        // Pre-select projects that were previously selected
        const savedSelectedProjects = localStorage.getItem('jira_selected_projects');
        if (savedSelectedProjects) {
          setSelectedProjects(JSON.parse(savedSelectedProjects));
        }
      } catch (error) {
        console.error('Failed to fetch Jira projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load Jira projects',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };

  const handleSaveSelection = () => {
    localStorage.setItem('jira_selected_projects', JSON.stringify(selectedProjects));
    toast({
      title: 'Projects updated',
      description: `${selectedProjects.length} projects selected for compliance monitoring`,
    });
  };
  
  const handleAddProject = async () => {
    if (!newProject.key || !newProject.name) {
      toast({
        title: 'Validation error',
        description: 'Project key and name are required',
        variant: 'destructive',
      });
      return;
    }
    
    // Check for duplicate key
    if (projects.some(p => p.key === newProject.key)) {
      toast({
        title: 'Validation error',
        description: `Project key "${newProject.key}" already exists`,
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Add the new project using the useJiraForm hook
      const createdProject = await addProject(newProject);
      
      // Update the projects list with the new project
      setProjects(prevProjects => [...prevProjects, createdProject]);
      
      // Auto-select the new project
      setSelectedProjects(prev => [...prev, createdProject.id]);
      
      // Close the dialog and reset the form
      setShowAddDialog(false);
      setNewProject({ key: '', name: '' });
      
      toast({
        title: 'Project added',
        description: `Project "${newProject.name}" has been added successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add the project',
        variant: 'destructive',
      });
    }
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Jira Projects</CardTitle>
            <CardDescription>
              Select which projects to monitor for compliance issues
            </CardDescription>
          </div>
          <Button 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus size={16} /> Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setSelectedProjects(projects.map(p => p.id))}
            variant="outline"
            size="sm"
          >
            Select All
          </Button>
          <Button
            onClick={() => setSelectedProjects([])}
            variant="outline"
            size="sm"
          >
            Clear
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
              <p className="text-sm text-muted-foreground">Loading projects...</p>
            </div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={() => toggleProjectSelection(project.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono">{project.key}</TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.projectType}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border rounded-md p-12 text-center">
            <p className="text-muted-foreground">No projects found</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveSelection} disabled={isLoading}>
          Save Selection
        </Button>
      </CardFooter>

      {/* Add Project Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Create a new project to monitor for compliance issues
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="project-key">Project Key</Label>
              <Input 
                id="project-key"
                placeholder="e.g., COMP, SEC, GDPR"
                value={newProject.key}
                onChange={(e) => setNewProject(prev => ({ ...prev, key: e.target.value.toUpperCase() }))}
              />
              <p className="text-xs text-muted-foreground">
                Project keys are used as prefixes for issue numbers
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input 
                id="project-name"
                placeholder="e.g., Compliance Project"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddProject}>Add Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default JiraProjects;
