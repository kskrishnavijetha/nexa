
import React from 'react';
import { SlackViolation } from '@/utils/slack/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info, User, MessageCircle, Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistance } from 'date-fns';

interface SlackViolationsListProps {
  violations: SlackViolation[];
  isLoading?: boolean;
}

const SlackViolationsList: React.FC<SlackViolationsListProps> = ({ violations, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scanning for Violations</CardTitle>
          <CardDescription>
            Analyzing Slack messages and files for compliance issues...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">This may take a few moments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (violations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Violations Found</CardTitle>
          <CardDescription>
            No compliance violations were detected in the scanned Slack messages and files.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8 text-green-500">
            <div className="flex flex-col items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <p className="mt-4 text-center text-muted-foreground">
                All scanned content is compliant with your policies
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
          Compliance Violations ({violations.length})
        </CardTitle>
        <CardDescription>
          The following compliance issues were detected in Slack messages and files.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {violations.map((violation) => (
              <Card key={`${violation.messageId}-${violation.rule}`} className="border-red-100">
                <CardHeader className="py-2 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {violation.severity === 'high' ? (
                        <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                      ) : violation.severity === 'medium' ? (
                        <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
                      ) : (
                        <Info className="h-4 w-4 mr-2 text-blue-500" />
                      )}
                      <span className="font-medium">{getRuleDisplay(violation.rule)}</span>
                    </div>
                    <Badge 
                      className={
                        violation.severity === 'high' ? 'bg-red-500' : 
                        violation.severity === 'medium' ? 'bg-orange-500' : 
                        'bg-blue-500'
                      }
                    >
                      {violation.severity} severity
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="space-y-2">
                    <p className="text-sm bg-gray-50 p-2 rounded">{violation.context}</p>
                    <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {violation.user}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        #{violation.channel}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatTimeAgo(violation.timestamp)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Helper function to format the rule display
const getRuleDisplay = (rule: string): string => {
  switch (rule) {
    case 'SSN_DETECTED':
      return 'Social Security Number Detected';
    case 'CREDIT_CARD_DETECTED':
      return 'Credit Card Number Detected';
    case 'PASSWORD_REFERENCE':
      return 'Password Information Shared';
    case 'CONFIDENTIAL_DATA':
      return 'Confidential Data Mentioned';
    case 'PERSONAL_DATA':
      return 'Personal Data Mentioned';
    case 'SENSITIVE_FILE_UPLOAD':
      return 'Sensitive File Uploaded';
    default:
      return rule.replace(/_/g, ' ').toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
  }
};

// Helper function to format time ago
const formatTimeAgo = (timestamp: string): string => {
  try {
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
  } catch (e) {
    return timestamp;
  }
};

export default SlackViolationsList;
