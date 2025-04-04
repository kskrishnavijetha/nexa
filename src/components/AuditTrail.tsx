
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from 'sonner';
import { AuditTrailProvider } from './audit/AuditTrailProvider';
import AuditTrailHeader from './audit/AuditTrailHeader';
import AuditTrailList from './audit/AuditTrailList';
import AuditLogs from './audit/AuditLogs';
import { Industry } from '@/utils/types';

interface AuditTrailProps {
  documentName: string;
  industry?: Industry;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ documentName, industry }) => {
  const [activeTab, setActiveTab] = useState<string>('timeline');
  
  console.log(`[AuditTrail] Rendering AuditTrail with documentName: ${documentName}, industry: ${industry || 'not specified'}`);
  
  return (
    <Card>
      <AuditTrailProvider documentName={documentName} industry={industry}>
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
      <Toaster richColors closeButton position="top-right" />
    </Card>
  );
};

export default AuditTrail;
