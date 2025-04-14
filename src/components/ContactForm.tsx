
import React, { useState } from 'react';
import { toast } from 'sonner';
import ContactFormView from './contact/ContactFormView';
import SuccessMessage from './contact/SuccessMessage';

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
            <SuccessMessage />
          ) : (
            <ContactFormView
              handleSubmit={handleSubmit}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
