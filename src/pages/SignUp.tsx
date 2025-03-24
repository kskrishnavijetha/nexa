
import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create a CompliZen Account</h1>
          <p className="mt-2 text-gray-600">Sign up to start your compliance journey</p>
        </div>
        
        <div className="mt-8">
          <SignUp 
            routing="path" 
            path="/sign-up" 
            signInUrl="/sign-in"
            redirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
