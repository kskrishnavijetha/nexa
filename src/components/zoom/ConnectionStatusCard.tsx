
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, Power } from 'lucide-react';
import { ZoomConnection } from '@/utils/zoom/zoomServices';
import { format } from 'date-fns';

interface ConnectionStatusCardProps {
  connection: ZoomConnection | null;
  isConnecting: boolean;
  isDisconnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ConnectionStatusCard: React.FC<ConnectionStatusCardProps> = ({
  connection,
  isConnecting,
  isDisconnecting,
  onConnect,
  onDisconnect,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Connection Status</CardTitle>
        <CardDescription>
          {connection?.connected
            ? `Connected since ${connection.lastScanned ? format(new Date(connection.lastScanned), 'PPP pp') : 'recently'}`
            : 'Connect to your Zoom account to start monitoring'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Camera className={`h-6 w-6 mr-2 ${connection?.connected ? 'text-green-500' : 'text-gray-400'}`} />
            <span>
              {connection?.connected
                ? `${connection.meetingsCount} meetings available`
                : 'Not connected'
              }
            </span>
          </div>
          <div>
            {connection?.connected ? (
              <Button 
                variant="outline" 
                onClick={onDisconnect} 
                disabled={isDisconnecting}
              >
                {isDisconnecting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Disconnecting</>
                ) : (
                  <><Power className="h-4 w-4 mr-2" /> Disconnect</>
                )}
              </Button>
            ) : (
              <Button 
                onClick={onConnect} 
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Connecting</>
                ) : (
                  <><Power className="h-4 w-4 mr-2" /> Connect</>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionStatusCard;
