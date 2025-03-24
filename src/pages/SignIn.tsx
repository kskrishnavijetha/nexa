
import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back to CompliZen</h1>
          <p className="mt-2 text-gray-600">Sign in to continue to your account</p>
        </div>
        
        <div className="mt-8">
          <SignIn 
            routing="path" 
            path="/sign-in" 
            signUpUrl="/sign-up"
            redirectUrl="/payment"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
