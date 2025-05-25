
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Password reset functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
