
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('Thank you for joining our waitlist!');
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setEmail('');
      setName('');
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section className="py-20 relative overflow-hidden" id="contact">
      <div className="absolute top-20 right-0 w-80 h-80 bg-primary opacity-5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-60 h-60 bg-blue-400 opacity-5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto glass-card rounded-xl p-8 animate-fade-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">
              Join Our Early Access
            </h2>
            <p className="text-muted-foreground">
              Be the first to experience our AI-powered compliance tool and receive exclusive updates.
            </p>
          </div>
          
          {isSubmitted ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
              <p className="text-muted-foreground">
                We've added you to our early access list. We'll be in touch soon!
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
