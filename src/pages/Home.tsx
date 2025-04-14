
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to NexaBloom AI Compliance</h1>
        <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
          Advanced AI-driven compliance analysis and documentation scanning for businesses of all sizes.
        </p>
        
        <div className="flex justify-center">
          {user ? (
            <Button asChild size="lg">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link to="/sign-up">Get Started Now</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
