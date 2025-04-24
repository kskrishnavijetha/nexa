
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';
import ConnectionStatusCard from '@/components/zoom/ConnectionStatusCard';
import MeetingsList from '@/components/zoom/MeetingsList';
import ScanResults from '@/components/zoom/ScanResults';
import { useZoomState } from '@/hooks/useZoomState';

const Zoom = () => {
  const {
    isLoading,
    isConnecting,
    isDisconnecting,
    isScanning,
    connection,
    meetings,
    scanResult,
    handleConnectZoom,
    handleDisconnectZoom,
    handleScanZoomMeetings
  } = useZoomState();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Zoom Integration</h1>
          <p className="text-muted-foreground mt-2">
            Scan Zoom meetings and recordings for compliance issues
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <ConnectionStatusCard
            connection={connection}
            isConnecting={isConnecting}
            isDisconnecting={isDisconnecting}
            onConnect={handleConnectZoom}
            onDisconnect={handleDisconnectZoom}
          />
          
          {connection?.connected && (
            <>
              <MeetingsList
                meetings={meetings}
                isScanning={isScanning}
                onScan={handleScanZoomMeetings}
              />
              
              {scanResult && <ScanResults scanResult={scanResult} />}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Zoom;
