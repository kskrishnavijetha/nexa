
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthDialogProps } from './types';

const AuthDialog: React.FC<AuthDialogProps> = ({
  title,
  showDialog,
  setShowDialog,
  onAuth,
  email,
  setEmail,
  password,
  setPassword
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to {title}</DialogTitle>
          <DialogDescription>
            Enter your Google account credentials to connect to {title}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onAuth} className="space-y-4">
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
            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Connect
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
