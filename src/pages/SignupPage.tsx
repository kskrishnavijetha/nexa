
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SignupPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sign up functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
