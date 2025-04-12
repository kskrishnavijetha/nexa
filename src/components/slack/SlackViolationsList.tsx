
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SlackViolation } from '@/utils/slack/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, FileSearch, Loader2 } from 'lucide-react';

interface SlackViolationsListProps {
  violations: SlackViolation[];
  isLoading: boolean;
}

const SlackViolationsList: React.FC<SlackViolationsListProps> = ({ 
  violations,
  isLoading
}) => {
  // Group violations by severity for the summary
  const highSeverityCount = violations.filter(v => v.severity === 'high').length;
  const mediumSeverityCount = violations.filter(v => v.severity === 'medium').length;
  const lowSeverityCount = violations.filter(v => v.severity === 'low').length;

  if (isLoading) {
    return (
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            <span>Scanning Slack Messages</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">
            Analyzing messages for compliance violations...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileSearch className="h-5 w-5 mr-2" />
            <span>Scan Results</span>
          </div>
          <Badge variant="outline" className="bg-gray-50">
            {violations.length} {violations.length === 1 ? 'violation' : 'violations'} detected
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {violations.length > 0 ? (
          <>
            <div className="mb-4 flex space-x-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>High: {highSeverityCount}</span>
              </Badge>
              
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Medium: {mediumSeverityCount}</span>
              </Badge>
              
              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Low: {lowSeverityCount}</span>
              </Badge>
            </div>
            
            <Separator className="my-2" />
            
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {violations.map((violation, index) => (
                  <div 
                    key={`${violation.messageId}-${index}`} 
                    className={`p-3 rounded-md ${
                      violation.severity === 'high' ? 'bg-red-50 border-l-4 border-red-500' :
                      violation.severity === 'medium' ? 'bg-amber-50 border-l-4 border-amber-500' :
                      'bg-blue-50 border-l-4 border-blue-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">
                        {violation.rule.replace(/_/g, ' ')}
                      </h4>
                      <Badge 
                        variant={
                          violation.severity === 'high' ? 'destructive' :
                          violation.severity === 'medium' ? 'outline' : 'secondary'
                        }
                        className={
                          violation.severity === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          violation.severity === 'low' ? 'bg-blue-50 text-blue-800 border-blue-200' : ''
                        }
                      >
                        {violation.severity}
                      </Badge>
                    </div>
                    
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded my-1">
                        {violation.context}
                      </p>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center">
                        <span className="font-medium">Channel:</span> 
                        <span className="ml-1">{violation.channel}</span>
                      </span>
                      <span className="inline-flex items-center">
                        <span className="font-medium">User:</span> 
                        <span className="ml-1">{violation.user}</span>
                      </span>
                      <span className="inline-flex items-center">
                        <span className="font-medium">Time:</span> 
                        <span className="ml-1">
                          {new Date(violation.timestamp).toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-green-500/50" />
            <p>No compliance violations detected.</p>
            <p className="text-sm mt-1">Great job! Your Slack workspace appears to be compliant.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SlackViolationsList;
