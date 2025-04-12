
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MessageCircle } from 'lucide-react';

interface ChannelSelectorProps {
  channels: string[];
  onChange: (channels: string[]) => void;
  disabled?: boolean;
}

const ChannelSelector: React.FC<ChannelSelectorProps> = ({
  channels,
  onChange,
  disabled = false
}) => {
  const [channelInput, setChannelInput] = React.useState('');
  
  const handleAddChannel = () => {
    if (channelInput.trim()) {
      onChange([...channels, channelInput.trim()]);
      setChannelInput('');
    }
  };

  const handleRemoveChannel = (channel: string) => {
    onChange(channels.filter(c => c !== channel));
  };
  
  return (
    <div className="space-y-2">
      <Label className="flex items-center">
        <MessageCircle className="h-4 w-4 mr-2" />
        Channels to Monitor
      </Label>
      <div className="flex">
        <Input
          value={channelInput}
          onChange={(e) => setChannelInput(e.target.value)}
          placeholder="Enter channel name"
          disabled={disabled}
          className="mr-2"
        />
        <Button
          onClick={handleAddChannel}
          disabled={disabled || !channelInput.trim()}
          size="sm"
        >
          Add
        </Button>
      </div>
      {channels.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {channels.map((channel) => (
            <div
              key={channel}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center"
            >
              #{channel}
              <button
                onClick={() => handleRemoveChannel(channel)}
                className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                disabled={disabled}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground mt-2">
          No channels selected. All accessible channels will be scanned.
        </p>
      )}
    </div>
  );
};

export default ChannelSelector;
