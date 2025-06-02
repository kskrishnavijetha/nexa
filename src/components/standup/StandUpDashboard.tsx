
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Clock, CheckCircle, Users, TrendingUp } from 'lucide-react';

const StandUpDashboard = () => {
  // Mock data
  const sprintData = [
    { name: 'Mon', completed: 4, total: 8 },
    { name: 'Tue', completed: 6, total: 8 },
    { name: 'Wed', completed: 5, total: 8 },
    { name: 'Thu', completed: 7, total: 8 },
    { name: 'Fri', completed: 3, total: 8 },
  ];

  const blockersData = [
    { name: 'Code Review', value: 3, color: '#ef4444' },
    { name: 'API Issues', value: 2, color: '#f97316' },
    { name: 'Testing', value: 1, color: '#eab308' },
  ];

  const teamActivity = [
    { name: 'John Doe', lastUpdate: '2 hours ago', status: 'active', blockers: 0 },
    { name: 'Jane Smith', lastUpdate: '1 day ago', status: 'silent', blockers: 1 },
    { name: 'Mike Johnson', lastUpdate: '3 hours ago', status: 'active', blockers: 0 },
    { name: 'Sarah Wilson', lastUpdate: '5 hours ago', status: 'active', blockers: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Sprint Progress</p>
                <p className="text-2xl font-bold text-white">68%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Blockers</p>
                <p className="text-2xl font-bold text-red-400">6</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Team Members</p>
                <p className="text-2xl font-bold text-blue-400">5</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Completed Today</p>
                <p className="text-2xl font-bold text-green-400">7</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprint Progress Chart */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Daily Sprint Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sprintData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="completed" fill="#10b981" />
                <Bar dataKey="total" fill="#374151" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Blockers Breakdown */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Blockers Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={blockersData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {blockersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Team Activity */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Team Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamActivity.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-white font-medium">{member.name}</p>
                    <p className="text-slate-400 text-sm">Last update: {member.lastUpdate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={member.status === 'active' ? 'default' : 'destructive'}>
                    {member.status}
                  </Badge>
                  {member.blockers > 0 && (
                    <Badge variant="outline" className="text-red-400 border-red-400">
                      {member.blockers} blockers
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StandUpDashboard;
