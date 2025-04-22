
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useJiraProjects } from '@/hooks/useJiraProjects';
import { Search } from 'lucide-react';

const JiraProjects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { projects, isLoading, syncProjects, selectedProjects, toggleProject } = useJiraProjects();
  
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.key.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Jira Projects</h3>
        <Button onClick={syncProjects} disabled={isLoading}>
          {isLoading ? 'Syncing...' : 'Sync Projects'}
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">Loading projects...</TableCell>
              </TableRow>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <TableRow key={project.id}>
                  <TableCell className="p-2">
                    <Checkbox 
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => toggleProject(project.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{project.key}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.projectTypeKey}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  {searchQuery ? 'No projects match your search' : 'No projects found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default JiraProjects;
