
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldAlert } from 'lucide-react';
import { ZoomMeeting } from '@/utils/zoom/zoomServices';
import { format } from 'date-fns';

interface MeetingsListProps {
  meetings: ZoomMeeting[];
  isScanning: boolean;
  onScan: () => void;
}

const MeetingsList: React.FC<MeetingsListProps> = ({
  meetings,
  isScanning,
  onScan,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Meetings</CardTitle>
            <CardDescription>
              Showing {meetings.length} recent Zoom meetings
            </CardDescription>
          </div>
          <Button 
            onClick={onScan} 
            disabled={isScanning}
            className="shrink-0"
          >
            {isScanning ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Scanning</>
            ) : (
              <><ShieldAlert className="h-4 w-4 mr-2" /> Scan for Issues</>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {meetings.length > 0 ? (
          <div className="space-y-4">
            {meetings.map(meeting => (
              <div key={meeting.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{meeting.topic}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(meeting.startTime), 'PPP pp')} · {meeting.duration} minutes
                    </p>
                    <div className="mt-2">
                      <span className="text-xs bg-gray-100 rounded px-2 py-1 mr-2">
                        {meeting.participantsCount} {meeting.participantsCount === 1 ? 'participant' : 'participants'}
                      </span>
                      {meeting.hasRecording && (
                        <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1 mr-2">
                          Recording available
                        </span>
                      )}
                      {meeting.hasTranscript && (
                        <span className="text-xs bg-green-100 text-green-800 rounded px-2 py-1">
                          Transcript available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No meetings found in your Zoom account.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeetingsList;
