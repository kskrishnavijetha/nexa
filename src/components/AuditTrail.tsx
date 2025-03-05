
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Check, Eye, Download, FileText, MessageSquare, UserCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// For demo purposes, we'll create mock audit trail data
interface AuditEvent {
  id: string;
  action: string;
  documentName: string;
  timestamp: string;
  user: string;
  icon: React.ReactNode;
  comments?: Comment[];
  status?: 'pending' | 'in-progress' | 'completed';
}

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

const generateMockAuditTrail = (documentName: string): AuditEvent[] => {
  const now = new Date();
  
  return [
    {
      id: '1',
      action: 'Document uploaded',
      documentName,
      timestamp: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
      user: 'Compliance Officer',
      icon: <FileText className="h-4 w-4 text-blue-500" />,
      status: 'completed',
      comments: [
        {
          id: 'c1',
          user: 'Compliance Officer',
          text: 'Initial document uploaded for review',
          timestamp: new Date(now.getTime() - 3590000).toISOString()
        }
      ]
    },
    {
      id: '2',
      action: 'Compliance analysis started',
      documentName,
      timestamp: new Date(now.getTime() - 3500000).toISOString(), // 58 minutes ago
      user: 'System',
      icon: <Eye className="h-4 w-4 text-purple-500" />,
      status: 'completed'
    },
    {
      id: '3',
      action: 'Compliance report generated',
      documentName,
      timestamp: new Date(now.getTime() - 3400000).toISOString(), // 56 minutes ago
      user: 'System',
      icon: <Check className="h-4 w-4 text-green-500" />,
      status: 'completed',
      comments: [
        {
          id: 'c2',
          user: 'Legal Advisor',
          text: 'Found several potential GDPR compliance issues that need to be addressed',
          timestamp: new Date(now.getTime() - 3380000).toISOString()
        }
      ]
    },
    {
      id: '4',
      action: 'Report viewed',
      documentName,
      timestamp: new Date(now.getTime() - 3000000).toISOString(), // 50 minutes ago
      user: 'Compliance Officer',
      icon: <Eye className="h-4 w-4 text-gray-500" />,
      status: 'completed'
    },
    {
      id: '5',
      action: 'Remediation task assigned',
      documentName,
      timestamp: new Date(now.getTime() - 2400000).toISOString(), // 40 minutes ago
      user: 'Compliance Officer',
      icon: <Users className="h-4 w-4 text-orange-500" />,
      status: 'in-progress',
      comments: [
        {
          id: 'c3',
          user: 'Compliance Officer',
          text: 'Assigned remediation tasks to the development team',
          timestamp: new Date(now.getTime() - 2390000).toISOString()
        },
        {
          id: 'c4',
          user: 'Developer',
          text: 'Working on fixing identified issues, will update when complete',
          timestamp: new Date(now.getTime() - 1800000).toISOString()
        }
      ]
    },
    {
      id: '6',
      action: 'Report downloaded',
      documentName,
      timestamp: new Date(now.getTime() - 1800000).toISOString(), // 30 minutes ago
      user: 'Compliance Officer',
      icon: <Download className="h-4 w-4 text-indigo-500" />,
      status: 'completed'
    }
  ];
};

interface AuditTrailProps {
  documentName: string;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ documentName }) => {
  const [auditEvents, setAuditEvents] = useState(generateMockAuditTrail(documentName));
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleAddComment = (eventId: string) => {
    if (!newComment[eventId] || newComment[eventId].trim() === '') {
      toast.error('Comment cannot be empty');
      return;
    }

    const updatedEvents = auditEvents.map(event => {
      if (event.id === eventId) {
        const newCommentObj: Comment = {
          id: `c${Date.now()}`,
          user: 'Current User',
          text: newComment[eventId],
          timestamp: new Date().toISOString()
        };

        return {
          ...event,
          comments: event.comments ? [...event.comments, newCommentObj] : [newCommentObj]
        };
      }
      return event;
    });

    setAuditEvents(updatedEvents);
    setNewComment({ ...newComment, [eventId]: '' });
    toast.success('Comment added successfully');
  };

  const updateTaskStatus = (eventId: string, status: 'pending' | 'in-progress' | 'completed') => {
    const updatedEvents = auditEvents.map(event => {
      if (event.id === eventId) {
        return { ...event, status };
      }
      return event;
    });

    setAuditEvents(updatedEvents);
    toast.success(`Task status updated to ${status}`);
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusStyles = {
      'pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'completed': 'bg-green-100 text-green-800 border-green-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          Smart Audit Trail & Collaboration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-gray-200"></div>
          <div className="space-y-6">
            {auditEvents.map((event) => (
              <div key={event.id} className="relative pl-8">
                <div className="absolute left-0 p-1 bg-white rounded-full border border-gray-200">
                  {event.icon}
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{event.action}</span>
                        {event.status && getStatusBadge(event.status)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{event.user}</div>
                    </div>
                    <span className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</span>
                  </div>
                  
                  {/* Collaboration features */}
                  <div className="mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs flex items-center gap-1"
                      onClick={() => toggleEventExpansion(event.id)}
                    >
                      <MessageSquare className="h-3 w-3" />
                      {expandedEvent === event.id ? "Hide comments" : 
                       `${event.comments?.length || 0} comment${(event.comments?.length || 0) !== 1 ? 's' : ''}`}
                    </Button>
                  </div>
                  
                  {/* Comments and collaboration section */}
                  {expandedEvent === event.id && (
                    <div className="mt-3 border-t border-gray-200 pt-2">
                      {event.comments && event.comments.length > 0 ? (
                        <div className="space-y-2 mb-3">
                          {event.comments.map(comment => (
                            <div key={comment.id} className="bg-white p-2 rounded border border-gray-100 text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium">{comment.user}</span>
                                <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                              </div>
                              <p className="mt-1">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mb-2">No comments yet</p>
                      )}
                      
                      {/* Add comment section */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          className="flex-1 border rounded px-2 py-1 text-sm"
                          value={newComment[event.id] || ''}
                          onChange={(e) => setNewComment({...newComment, [event.id]: e.target.value})}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(event.id)}
                        />
                        <Button 
                          size="sm" 
                          onClick={() => handleAddComment(event.id)}
                        >
                          Add
                        </Button>
                      </div>
                      
                      {/* Task status update (only shown for certain types of events) */}
                      {event.status && (
                        <div className="mt-3 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Update task status:</p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant={event.status === 'pending' ? 'default' : 'outline'}
                              className="text-xs"
                              onClick={() => updateTaskStatus(event.id, 'pending')}
                            >
                              Pending
                            </Button>
                            <Button 
                              size="sm" 
                              variant={event.status === 'in-progress' ? 'default' : 'outline'}
                              className="text-xs"
                              onClick={() => updateTaskStatus(event.id, 'in-progress')}
                            >
                              In Progress
                            </Button>
                            <Button 
                              size="sm" 
                              variant={event.status === 'completed' ? 'default' : 'outline'}
                              className="text-xs"
                              onClick={() => updateTaskStatus(event.id, 'completed')}
                            >
                              <UserCheck className="mr-1 h-3 w-3" />
                              Completed
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditTrail;
