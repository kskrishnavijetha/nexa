
import React, { useState } from 'react';
import { useAuditTrail } from './AuditTrailProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuditEvent from './AuditEvent';
import { toast } from 'sonner';
import IntegrityVerification from './IntegrityVerification';

const AuditTrailList: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'user' | 'system'>('all');
  const { auditEvents, isLoading, verificationCode } = useAuditTrail();
  
  const handleTabChange = (value: string) => {
    setActiveFilter(value as 'all' | 'user' | 'system');
  };
  
  const filteredEvents = auditEvents.filter(event => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'user') return event.user !== 'System';
    if (activeFilter === 'system') return event.user === 'System';
    return true;
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin text-2xl">⚙️</div>
      </div>
    );
  }
  
  if (auditEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No audit events available for this document.</p>
      </div>
    );
  }
  
  return (
    <div>
      {verificationCode && (
        <div className="mb-4">
          <IntegrityVerification verificationCode={verificationCode} />
        </div>
      )}
      
      <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="user">User Events</TabsTrigger>
            <TabsTrigger value="system">System Events</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0 space-y-4">
          {filteredEvents.map(event => (
            <AuditEvent key={event.id} event={event} />
          ))}
        </TabsContent>
        
        <TabsContent value="user" className="mt-0 space-y-4">
          {filteredEvents.map(event => (
            <AuditEvent key={event.id} event={event} />
          ))}
        </TabsContent>
        
        <TabsContent value="system" className="mt-0 space-y-4">
          {filteredEvents.map(event => (
            <AuditEvent key={event.id} event={event} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditTrailList;
