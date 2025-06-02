
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface TeamConfigStepProps {
  onComplete: (data: { standupTime: string; selectedMembers: string[] }) => void;
}

const TeamConfigStep = ({ onComplete }: TeamConfigStepProps) => {
  const [standupTime, setStandupTime] = useState('09:00');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);

  // Mock team members (in real app, these would come from Jira API)
  const teamMembers: TeamMember[] = [
    { id: '1', name: 'John Doe', email: 'john@company.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@company.com' },
    { id: '3', name: 'Mike Johnson', email: 'mike@company.com' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@company.com' },
    { id: '5', name: 'Alex Brown', email: 'alex@company.com' },
  ];

  const timeOptions = [
    '08:00', '08:30', '09:00', '09:30', '10:00', 
    '10:30', '11:00', '11:30', '12:00'
  ];

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleComplete = async () => {
    if (selectedMembers.length === 0) {
      toast.error('Please select at least one team member');
      return;
    }

    setIsCompleting(true);
    
    try {
      // Store configuration
      localStorage.setItem('standup_time', standupTime);
      localStorage.setItem('selected_members', JSON.stringify(selectedMembers));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Team configuration completed!');
      onComplete({ standupTime, selectedMembers });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-green-50 border-green-200">
        <Clock className="h-4 w-4" />
        <AlertDescription>
          <strong>Final step!</strong> Configure when your team's daily stand-ups should be generated and posted to Slack.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="standupTime">Daily Stand-up Time</Label>
          <Select value={standupTime} onValueChange={setStandupTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map(time => (
                <SelectItem key={time} value={time}>
                  {time} (Local time)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            Stand-ups will be automatically generated and posted at this time daily
          </p>
        </div>

        <div className="space-y-4">
          <Label>Select Team Members</Label>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {teamMembers.map(member => (
              <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={member.id}
                  checked={selectedMembers.includes(member.id)}
                  onCheckedChange={() => handleMemberToggle(member.id)}
                />
                <div className="flex-1">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.email}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Selected: {selectedMembers.length} member(s)
          </p>
        </div>
      </div>

      <Button 
        onClick={handleComplete}
        disabled={isCompleting || selectedMembers.length === 0}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        size="lg"
      >
        {isCompleting ? (
          <>
            <Clock className="h-4 w-4 mr-2 animate-spin" />
            Completing Setup...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Setup
          </>
        )}
      </Button>
    </div>
  );
};

export default TeamConfigStep;
