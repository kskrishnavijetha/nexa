
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StandUpGenieCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-purple-600 via-blue-600 to-slate-800 border-purple-500/20 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-purple-200" />
            <div>
              <CardTitle className="text-xl font-bold text-white">StandUpGenie</CardTitle>
              <p className="text-purple-200 text-sm">Your smart Jira stand-up companion</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-100 border-purple-400/30">
            New
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-purple-300" />
              <span className="text-sm font-medium text-purple-100">Auto Standups</span>
            </div>
            <p className="text-xs text-purple-200">Daily AI-generated summaries from Jira activity</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-blue-300" />
              <span className="text-sm font-medium text-blue-100">Ask Genie</span>
            </div>
            <p className="text-xs text-blue-200">Chat with AI about team progress and blockers</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-slate-300" />
              <span className="text-sm font-medium text-slate-100">Team Insights</span>
            </div>
            <p className="text-xs text-slate-200">Sprint progress and blocker tracking</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/standup-genie')}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
            variant="outline"
          >
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StandUpGenieCard;
