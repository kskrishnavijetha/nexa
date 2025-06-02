
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Users, Check } from 'lucide-react';
import { toast } from 'sonner';

interface TeamConfigStepProps {
  onComplete: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const TeamConfigStep: React.FC<TeamConfigStepProps> = ({ onComplete }) => {
  const [standupTime, setStandupTime] = useState('09:00');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // Mock team members from Jira
  const teamMembers: TeamMember[] = [
    { id: '1', name: 'John Doe', email: 'john@company.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@company.com' },
    { id: '3', name: 'Mike Johnson', email: 'mike@company.com' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@company.com' },
    { id: '5', name: 'Tom Brown', email: 'tom@company.com' },
  ];

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSaveConfig = async () => {
    if (selectedMembers.length === 0) {
      toast.error('Please select at least one team member');
      return;
    }

    setIsConfiguring(true);
    
    try {
      // Simulate saving configuration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsConfigured(true);
      toast.success('Team configuration saved!');
      setTimeout(onComplete, 1000);
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setIsConfiguring(false);
    }
  };

  if (isConfigured) {
    return (
      <Card className="bg-green-500/20 border-green-500/30">
        <CardContent className="p-6 text-center">
          <Check className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Configuration Complete!
          </h3>
          <p className="text-green-200">
            Stand-ups will be generated daily at {standupTime} for {selectedMembers.length} team members.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stand-up Time */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-5 w-5 text-purple-400" />
            <h4 className="text-white font-medium">Stand-up Time</h4>
          </div>
          
          <div>
            <Label htmlFor="time" className="text-white">When should stand-ups be generated?</Label>
            <Input
              id="time"
              type="time"
              value={standupTime}
              onChange={(e) => setStandupTime(e.target.value)}
              className="bg-white/10 border-white/20 text-white w-full mt-2"
            />
            <p className="text-xs text-slate-400 mt-1">
              AI summaries will be generated and posted at this time daily
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5 text-purple-400" />
            <h4 className="text-white font-medium">Select Team Members</h4>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Checkbox
                  id={member.id}
                  checked={selectedMembers.includes(member.id)}
                  onCheckedChange={() => handleMemberToggle(member.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-white font-medium">{member.name}</p>
                      <p className="text-slate-400 text-sm">{member.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-slate-400 mt-4">
            Selected: {selectedMembers.length} of {teamMembers.length} members
          </p>
        </CardContent>
      </Card>

      <Button
        onClick={handleSaveConfig}
        disabled={isConfiguring || selectedMembers.length === 0}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {isConfiguring ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Saving Configuration...
          </>
        ) : (
          <>
            <Check className="h-4 w-4 mr-2" />
            Save Configuration
          </>
        )}
      </Button>
    </div>
  );
};

export default TeamConfigStep;
