
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ContactFormViewProps {
  handleSubmit: (e: React.FormEvent) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  isSubmitting: boolean;
}

const ContactFormView: React.FC<ContactFormViewProps> = ({ 
  handleSubmit, name, setName, email, setEmail, isSubmitting 
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          placeholder="your.email@example.com"
        />
      </div>
      <Button 
        type="submit"
        className="w-full mt-4 py-6"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        ) : (
          <>
            Join Waitlist
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
      <p className="text-xs text-center text-muted-foreground mt-4">
        By submitting, you agree to our Privacy Policy and Terms of Service.
      </p>
    </form>
  );
};

export default ContactFormView;
