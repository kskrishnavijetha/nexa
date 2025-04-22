
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useJiraIssueTypes } from '@/hooks/useJiraIssueTypes';
import { Search } from 'lucide-react';

const JiraIssueTypes: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { issueTypes, isLoading, syncIssueTypes, selectedIssueTypes, toggleIssueType } = useJiraIssueTypes();
  
  const filteredIssueTypes = issueTypes.filter(issueType => 
    issueType.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Jira Issue Types</h3>
        <Button onClick={syncIssueTypes} disabled={isLoading}>
          {isLoading ? 'Syncing...' : 'Sync Issue Types'}
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search issue types..."
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
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Subtask</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">Loading issue types...</TableCell>
              </TableRow>
            ) : filteredIssueTypes.length > 0 ? (
              filteredIssueTypes.map(issueType => (
                <TableRow key={issueType.id}>
                  <TableCell className="p-2">
                    <Checkbox 
                      checked={selectedIssueTypes.includes(issueType.id)}
                      onCheckedChange={() => toggleIssueType(issueType.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {issueType.iconUrl && (
                      <img 
                        src={issueType.iconUrl} 
                        alt={issueType.name}
                        className="w-4 h-4 inline mr-2"
                      />
                    )}
                    {issueType.name}
                  </TableCell>
                  <TableCell>{issueType.description || "-"}</TableCell>
                  <TableCell>{issueType.subtask ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  {searchQuery ? 'No issue types match your search' : 'No issue types found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default JiraIssueTypes;
