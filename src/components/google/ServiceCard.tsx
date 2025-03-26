
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw, Upload } from 'lucide-react';
import { GoogleService } from './types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ServiceCardProps {
  serviceId: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isConnected: boolean;
  isConnecting: boolean;
  isScanning: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  serviceId,
  icon,
  title,
  description,
  isConnected,
  isConnecting,
  isScanning,
  onConnect,
  onDisconnect,
}) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState<boolean>(false);
  const [realtimeTimer, setRealtimeTimer] = useState<number | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  
  // Real-time updates simulation
  useEffect(() => {
    if (isConnected && isRealTimeActive) {
      // Set up interval for real-time updates
      const interval = window.setInterval(() => {
        setLastUpdated(new Date());
      }, 10000); // Update every 10 seconds
      
      setRealtimeTimer(interval);
      
      return () => {
        if (realtimeTimer !== null) {
          window.clearInterval(realtimeTimer);
        }
      };
    } else if (!isRealTimeActive && realtimeTimer !== null) {
      window.clearInterval(realtimeTimer);
      setRealtimeTimer(null);
    }
  }, [isConnected, isRealTimeActive, realtimeTimer]);

  // Auto-activate real-time mode when connected
  useEffect(() => {
    if (isConnected) {
      setIsRealTimeActive(true);
    } else {
      setIsRealTimeActive(false);
    }
  }, [isConnected]);

  const toggleRealTime = () => {
    setIsRealTimeActive(!isRealTimeActive);
  };

  const handleConnect = () => {
    if (!isConnected) {
      setShowAuthDialog(true);
    } else {
      onDisconnect();
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAuthDialog(false);
    // Simulate authentication
    onConnect();
    // Clear credentials after use
    setEmail('');
    setPassword('');
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate file upload
    if (serviceId.includes('drive') && uploadFile) {
      console.log(`Uploading file to Google Drive: ${uploadFile.name}`);
    } else if (serviceId.includes('gmail')) {
      console.log(`Sending email to ${recipientEmail} with subject: ${emailSubject}`);
    } else if (serviceId.includes('docs')) {
      console.log(`Creating Google Doc: ${docTitle}`);
    }
    setShowUploadDialog(false);
    // Clear form
    setUploadFile(null);
    setEmailContent('');
    setEmailSubject('');
    setRecipientEmail('');
    setDocTitle('');
    setDocContent('');
  };

  // Determine the action button text based on service type
  const getActionButtonText = () => {
    if (serviceId.includes('drive')) return 'Upload File';
    if (serviceId.includes('gmail')) return 'Email Content';
    if (serviceId.includes('docs')) return 'Create Document';
    return 'Action';
  };

  // Determine the upload dialog title based on service type
  const getUploadDialogTitle = () => {
    if (serviceId.includes('drive')) return 'Upload to Google Drive';
    if (serviceId.includes('gmail')) return 'Email Content';
    if (serviceId.includes('docs')) return 'Create Google Document';
    return 'Action';
  };

  // Determine the upload dialog description based on service type
  const getUploadDialogDescription = () => {
    if (serviceId.includes('drive')) return 'Select a file to upload to your Google Drive';
    if (serviceId.includes('gmail')) return 'Create or analyze email content from your Gmail account';
    if (serviceId.includes('docs')) return 'Create a new document in Google Docs';
    return '';
  };

  // Determine the submit button text based on service type
  const getSubmitButtonText = () => {
    if (serviceId.includes('drive')) return 'Upload';
    if (serviceId.includes('gmail')) return 'Send Email';
    if (serviceId.includes('docs')) return 'Create Document';
    return 'Submit';
  };

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center">
            {icon}
            {title}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {isConnected && (
              <div 
                className="cursor-pointer" 
                onClick={toggleRealTime}
                title={isRealTimeActive ? "Real-time monitoring active" : "Activate real-time monitoring"}
              >
                <RefreshCw className={`h-4 w-4 ${isRealTimeActive ? "text-green-500 animate-spin-slow" : "text-gray-400"}`} />
              </div>
            )}
            <Badge variant={isConnected ? "default" : "outline"} className={isConnected ? "bg-green-500" : ""}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        
        {isConnected && isRealTimeActive && (
          <div className="mb-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Real-time monitoring active
            </div>
            <div className="mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          <Button 
            variant={isConnected ? "outline" : "default"} 
            className="w-full"
            onClick={handleConnect}
            disabled={isConnecting || isScanning}
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : isConnected ? (
              'Disconnect'
            ) : (
              'Connect'
            )}
          </Button>
          
          {isConnected && (
            <Button 
              variant="outline" 
              className="w-full flex items-center" 
              onClick={() => setShowUploadDialog(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              {getActionButtonText()}
            </Button>
          )}
        </div>

        {/* Authentication Dialog */}
        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect to {title}</DialogTitle>
              <DialogDescription>
                Enter your Google account credentials to connect to {title}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="your.email@gmail.com" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAuthDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Connect
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Upload/Create Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {getUploadDialogTitle()}
              </DialogTitle>
              <DialogDescription>
                {getUploadDialogDescription()}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              {serviceId.includes('drive') && (
                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <Input 
                    id="file" 
                    type="file" 
                    onChange={(e) => e.target.files && setUploadFile(e.target.files[0])} 
                    required 
                  />
                </div>
              )}
              
              {serviceId.includes('gmail') && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="recipient">To</Label>
                    <Input 
                      id="recipient" 
                      type="email" 
                      value={recipientEmail} 
                      onChange={(e) => setRecipientEmail(e.target.value)} 
                      placeholder="recipient@example.com" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      value={emailSubject} 
                      onChange={(e) => setEmailSubject(e.target.value)} 
                      placeholder="Email subject" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Message</Label>
                    <Textarea 
                      id="content" 
                      value={emailContent} 
                      onChange={(e) => setEmailContent(e.target.value)} 
                      placeholder="Type your message here..." 
                      rows={6} 
                      required 
                    />
                  </div>
                </>
              )}
              
              {serviceId.includes('docs') && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">Document Title</Label>
                    <Input 
                      id="title" 
                      value={docTitle} 
                      onChange={(e) => setDocTitle(e.target.value)} 
                      placeholder="Untitled Document" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="docContent">Document Content</Label>
                    <Textarea 
                      id="docContent" 
                      value={docContent} 
                      onChange={(e) => setDocContent(e.target.value)} 
                      placeholder="Start typing..." 
                      rows={8} 
                      required 
                    />
                  </div>
                </>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {getSubmitButtonText()}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;

