
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useJiraForm } from './useJiraForm';
import { jsPDF } from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const JiraAnalysis = () => {
  const { projects, issueTypes, addProject, addIssueType } = useJiraForm();
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddIssueTypeOpen, setIsAddIssueTypeOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', key: '', id: '' });
  const [newIssueType, setNewIssueType] = useState({ name: '', description: '', id: '' });

  const handleDownload = () => {
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(18);
    pdf.text('Jira Integration Analysis', 20, 20);
    
    // Projects section
    pdf.setFontSize(14);
    pdf.text('Projects', 20, 40);
    projects.forEach((project, index) => {
      const y = 50 + (index * 10);
      pdf.setFontSize(12);
      pdf.text(`${project.name} (${project.key}) - ID: ${project.id}`, 20, y);
    });
    
    // Issue Types section
    pdf.setFontSize(14);
    pdf.text('Issue Types', 20, 100);
    issueTypes.forEach((type, index) => {
      const y = 110 + (index * 10);
      pdf.setFontSize(12);
      pdf.text(`${type.name} - ${type.description || 'No description'}`, 20, y);
    });
    
    pdf.save('jira-analysis.pdf');
  };

  const handleAddProjectClick = () => {
    setIsAddProjectOpen(true);
  };

  const handleAddIssueTypeClick = () => {
    setIsAddIssueTypeOpen(true);
  };

  const handleProjectSubmit = () => {
    if (newProject.name && newProject.key) {
      // Generate an ID if not provided
      const projectToAdd = {
        ...newProject,
        id: newProject.id || `proj-${Date.now()}`
      };
      addProject(projectToAdd);
      setNewProject({ name: '', key: '', id: '' });
      setIsAddProjectOpen(false);
    }
  };

  const handleIssueTypeSubmit = () => {
    if (newIssueType.name) {
      // Generate an ID if not provided
      const issueTypeToAdd = {
        ...newIssueType,
        id: newIssueType.id || `type-${Date.now()}`
      };
      addIssueType(issueTypeToAdd);
      setNewIssueType({ name: '', description: '', id: '' });
      setIsAddIssueTypeOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projects</CardTitle>
        <div className="flex gap-2">
          <Button onClick={handleAddProjectClick} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.key}</TableCell>
                  <TableCell>{project.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Issue Types</h3>
              <Button onClick={handleAddIssueTypeClick} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Issue Type
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issueTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell>{type.name}</TableCell>
                    <TableCell>{type.description}</TableCell>
                    <TableCell>{type.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      {/* Add Project Dialog */}
      <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectKey">Project Key</Label>
              <Input
                id="projectKey"
                value={newProject.key}
                onChange={(e) => setNewProject({...newProject, key: e.target.value})}
                placeholder="Enter project key (e.g., PROJ)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectId">Project ID (Optional)</Label>
              <Input
                id="projectId"
                value={newProject.id}
                onChange={(e) => setNewProject({...newProject, id: e.target.value})}
                placeholder="Enter project ID (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProjectOpen(false)}>Cancel</Button>
            <Button onClick={handleProjectSubmit}>Add Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Issue Type Dialog */}
      <Dialog open={isAddIssueTypeOpen} onOpenChange={setIsAddIssueTypeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Issue Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="typeName">Issue Type Name</Label>
              <Input
                id="typeName"
                value={newIssueType.name}
                onChange={(e) => setNewIssueType({...newIssueType, name: e.target.value})}
                placeholder="Enter issue type name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="typeDescription">Description</Label>
              <Input
                id="typeDescription"
                value={newIssueType.description}
                onChange={(e) => setNewIssueType({...newIssueType, description: e.target.value})}
                placeholder="Enter description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="typeId">Issue Type ID (Optional)</Label>
              <Input
                id="typeId"
                value={newIssueType.id}
                onChange={(e) => setNewIssueType({...newIssueType, id: e.target.value})}
                placeholder="Enter issue type ID (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddIssueTypeOpen(false)}>Cancel</Button>
            <Button onClick={handleIssueTypeSubmit}>Add Issue Type</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default JiraAnalysis;
