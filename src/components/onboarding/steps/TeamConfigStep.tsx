
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, User } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface TeamConfigStepProps {
  onComplete: (data: { standupTime: string; selectedMembers: string[] }) => void;
}

const TeamConfigStep = ({ onComplete }: TeamConfigStepProps) => {
  const [standupTime, setStandupTime] = useState('09:00');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching team members from Jira
    const fetchTeamMembers = async () => {
      setIsLoading(true);
      try {
        // Mock team members data
        const mockMembers: TeamMember[] = [
          { id: '1', name: 'John Doe', email: 'john@company.com' },
          { id: '2', name: 'Jane Smith', email: 'jane@company.com' },
          { id: '3', name: 'Mike Johnson', email: 'mike@company.com' },
          { id: '4', name: 'Sarah Wilson', email: 'sarah@company.com' },
          { id: '5', name: 'David Brown', email: 'david@company.com' }
        ];
        
        setTeamMembers(mockMembers);
        // Auto-select all members by default
        setSelectedMembers(mockMembers.map(member => member.id));
      } catch (error) {
        toast.error('Failed to load team members');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleComplete = () => {
    if (!standupTime) {
      toast.error('Please select a stand-up time');
      return;
    }
    
    if (selectedMembers.length === 0) {
      toast.error('Please select at least one team member');
      return;
    }

    onComplete({ standupTime, selectedMembers });
    toast.success('Team configuration saved!');
  };

  return (
    <div className="space-y-6">
      {/* Stand-up Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Stand-up Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="standupTime">What time should daily stand-ups be posted?</Label>
            <Input
              id="standupTime"
              type="time"
              value={standupTime}
              onChange={(e) => setStandupTime(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-gray-600">
              Stand-up summaries will be automatically posted to Slack at this time each weekday.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Select team members to include in automated stand-ups:
            </p>
            
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg animate-pulse">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="w-32 h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="w-48 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {teamMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleMemberToggle(member.id)}
                  >
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleMemberToggle(member.id)}
                    />
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-gray-600">
                {selectedMembers.length} of {teamMembers.length} members selected
              </span>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedMembers([])}
                >
                  Clear All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedMembers(teamMembers.map(m => m.id))}
                >
                  Select All
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleComplete}
        disabled={!standupTime || selectedMembers.length === 0}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        size="lg"
      >
        Complete Setup
      </Button>
    </div>
  );
};

export default TeamConfigStep;
