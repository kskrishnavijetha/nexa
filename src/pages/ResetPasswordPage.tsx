
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Password reset confirmation will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
