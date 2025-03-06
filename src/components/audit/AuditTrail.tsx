
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AuditTrailProvider } from './AuditTrailProvider';
import AuditTrailHeader from './AuditTrailHeader';
import AuditTrailList from './AuditTrailList';

interface AuditTrailProps {
  documentName: string;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ documentName }) => {
  return (
    <Card>
      <AuditTrailProvider documentName={documentName}>
        <AuditTrailHeader />
        <CardContent>
          <AuditTrailList />
        </CardContent>
      </AuditTrailProvider>
    </Card>
  );
};

export default AuditTrail;
