
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuditTrailProvider } from './AuditTrailProvider';
import AuditTrailHeader from './AuditTrailHeader';
import AuditTrailList from './AuditTrailList';
import AuditLogs from './AuditLogs';

interface AuditTrailProps {
  documentName: string;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ documentName }) => {
  const [activeTab, setActiveTab] = useState<string>('timeline');
  
  return (
    <Card>
      <AuditTrailProvider documentName={documentName}>
        <AuditTrailHeader documentName={documentName} />
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
              <TabsTrigger value="logs">Audit Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="mt-0">
              <AuditTrailList />
            </TabsContent>
            
            <TabsContent value="logs" className="mt-0">
              <AuditLogs />
            </TabsContent>
          </Tabs>
        </CardContent>
      </AuditTrailProvider>
    </Card>
  );
};

export default AuditTrail;
