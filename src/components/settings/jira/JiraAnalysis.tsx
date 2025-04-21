
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useJiraForm } from './useJiraForm';
import { jsPDF } from 'jspdf';

const JiraAnalysis = () => {
  const { projects, issueTypes } = useJiraForm();

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

  const handleAddProject = () => {
    // This would typically open a modal or form to add a new project
    console.log('Add project clicked');
  };

  const handleAddIssueType = () => {
    // This would typically open a modal or form to add a new issue type
    console.log('Add issue type clicked');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projects</CardTitle>
        <div className="flex gap-2">
          <Button onClick={handleAddProject} size="sm">
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
              <Button onClick={handleAddIssueType} size="sm">
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
    </Card>
  );
};

export default JiraAnalysis;
