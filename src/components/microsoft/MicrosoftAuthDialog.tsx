
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Microsoft } from 'lucide-react';

interface MicrosoftAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
}

const MicrosoftAuthDialog: React.FC<MicrosoftAuthDialogProps> = ({
  isOpen,
  onClose,
  serviceName,
}) => {
  const handleMicrosoftLogin = () => {
    // Microsoft OAuth URL
    const clientId = "YOUR_MICROSOFT_CLIENT_ID"; // This should come from your environment variables
    const redirectUri = encodeURIComponent(window.location.origin + '/microsoft-callback');
    const scopes = encodeURIComponent('offline_access User.Read Files.Read.All Mail.Read Chat.Read');
    
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}&response_mode=query`;
    
    window.location.href = authUrl;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect to {serviceName}</DialogTitle>
          <DialogDescription>
            Sign in with your Microsoft account to connect to {serviceName}.
            This will allow us to scan your content for compliance issues.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <Button 
            className="w-full" 
            onClick={handleMicrosoftLogin}
          >
            <Microsoft className="mr-2 h-4 w-4" />
            Sign in with Microsoft
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MicrosoftAuthDialog;
