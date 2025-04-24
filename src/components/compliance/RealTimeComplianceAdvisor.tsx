
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Risk, Suggestion } from '@/utils/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wifi, AlertTriangle, Lightbulb, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RealTimeComplianceAdvisorProps {
  isActive: boolean;
  onToggleActive: (active: boolean) => void;
  risks: Risk[];
  suggestions: Suggestion[];
  lastAnalyzedAt: Date | null;
  onAnalyzeNow: () => void;
}

const RealTimeComplianceAdvisor: React.FC<RealTimeComplianceAdvisorProps> = ({
  isActive,
  onToggleActive,
  risks,
  suggestions,
  lastAnalyzedAt,
  onAnalyzeNow
}) => {
  // Count risks by severity
  const highRisks = risks.filter(r => r.severity === 'high').length;
  const mediumRisks = risks.filter(r => r.severity === 'medium').length;
  const lowRisks = risks.filter(r => r.severity === 'low').length;

  return (
    <Card className={isActive ? 'border-primary shadow-glow animate-pulse-slow' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2 text-primary" />
            <span>Real-time Compliance Advisor</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="compliance-mode" className="text-sm text-muted-foreground">
              {isActive ? 'Monitoring' : 'Paused'}
            </Label>
            <Switch
              id="compliance-mode"
              checked={isActive}
              onCheckedChange={onToggleActive}
            />
          </div>
        </div>
        
        {isActive && lastAnalyzedAt && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Wifi className="h-4 w-4 mr-2 text-green-500" />
            <span>Last analyzed {formatDistanceToNow(lastAnalyzedAt, { addSuffix: true })}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="risks">
          <TabsList className="mb-4">
            <TabsTrigger value="risks" className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Issues ({risks.length})
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Suggestions ({suggestions.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="risks">
            {risks.length > 0 && (
              <div className="mb-4 flex items-center justify-between">
                <div className="flex space-x-2">
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>High: {highRisks}</span>
                  </Badge>
                  
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Medium: {mediumRisks}</span>
                  </Badge>
                  
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Low: {lowRisks}</span>
                  </Badge>
                </div>
              </div>
            )}
            
            <ScrollArea className="h-[300px] pr-4">
              {risks.length > 0 ? (
                <div className="space-y-3">
                  {risks.map((risk, index) => (
                    <div 
                      key={`${risk.id || index}`}
                      className={`p-3 rounded-md ${
                        risk.severity === 'high' ? 'bg-red-50 border-l-4 border-red-500' :
                        risk.severity === 'medium' ? 'bg-amber-50 border-l-4 border-amber-500' :
                        'bg-blue-50 border-l-4 border-blue-500'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">
                          {risk.title}
                        </h4>
                        <Badge 
                          variant={
                            risk.severity === 'high' ? 'destructive' :
                            risk.severity === 'medium' ? 'outline' : 'secondary'
                          }
                          className={
                            risk.severity === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                            risk.severity === 'low' ? 'bg-blue-50 text-blue-800 border-blue-200' : ''
                          }
                        >
                          {risk.severity}
                        </Badge>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {risk.description}
                      </p>
                      
                      {risk.regulation && (
                        <div className="mt-2 text-xs text-gray-500">
                          <span className="font-medium">Regulation:</span> {risk.regulation}
                        </div>
                      )}
                      
                      {risk.mitigation && (
                        <div className="mt-1 text-xs text-gray-500">
                          <span className="font-medium">Mitigation:</span> {risk.mitigation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-green-500/50" />
                  <p>No compliance issues detected.</p>
                  <p className="text-sm mt-1">Your content is currently compliant.</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="suggestions">
            <ScrollArea className="h-[300px] pr-4">
              {suggestions.length > 0 ? (
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={`${suggestion.id || index}`}
                      className="p-3 rounded-md bg-blue-50 border-l-4 border-blue-500"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">
                          {suggestion.title}
                        </h4>
                        {suggestion.priority && (
                          <Badge 
                            variant="outline"
                            className={
                              suggestion.priority === 'high' ? 'bg-red-100 text-red-800 border-red-300' :
                              suggestion.priority === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                              'bg-blue-50 text-blue-800 border-blue-200'
                            }
                          >
                            {suggestion.priority}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {suggestion.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Lightbulb className="h-10 w-10 mx-auto mb-2 text-blue-500/50" />
                  <p>No suggestions available.</p>
                  <p className="text-sm mt-1">Add more content to receive compliance suggestions.</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {isActive 
              ? "Real-time monitoring active" 
              : "Real-time monitoring paused"}
          </div>
          <Button variant="outline" size="sm" onClick={onAnalyzeNow}>
            Analyze Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeComplianceAdvisor;
