
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { sendFeedbackEmail } from '@/utils/feedback';
import { MessageSquare, Loader2, AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FeedbackColumn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter your feedback message');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    toast.info('Sending your feedback...', {
      id: 'sending-feedback',
    });
    
    try {
      console.log("Submitting feedback with data:", { name, email, message });
      const result = await sendFeedbackEmail({
        email,
        name,
        message
      });
      
      if (result) {
        setSubmitStatus('success');
        toast.success('Thank you for your feedback! We will review it soon.', {
          id: 'sending-feedback',
          icon: <CheckCircle2 className="h-4 w-4" />
        });
        
        // Reset form
        setEmail('');
        setName('');
        setMessage('');
      } else {
        setSubmitStatus('error');
        toast.error('There was a problem sending your feedback. Please try again.', {
          id: 'sending-feedback',
        });
      }
    } catch (error) {
      console.error('Failed to send feedback:', error);
      setSubmitStatus('error');
      toast.error('Failed to send feedback. Please try again later.', {
        id: 'sending-feedback',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectContact = () => {
    // Create mailto link with pre-filled subject
    const subject = encodeURIComponent("Feedback for NexaBloom");
    const body = encodeURIComponent(`Name: ${name || "Not provided"}\nFeedback: ${message}`);
    window.open(`mailto:contact@nexabloom.xyz?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <MessageSquare className="h-5 w-5" />
              We'd Love Your Feedback
            </h2>
            <p className="text-muted-foreground mt-2">
              Help us improve NexaBloom by sharing your thoughts and suggestions.
            </p>
          </div>
          
          {submitStatus === 'success' ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
              <p className="text-muted-foreground mb-4">
                Your feedback has been sent successfully. We appreciate your input!
              </p>
              <Button 
                onClick={() => setSubmitStatus('idle')}
                variant="outline"
              >
                Send Another Feedback
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border">
              {submitStatus === 'error' && (
                <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200 text-red-800">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="ml-2">
                    <p className="font-medium">There was a problem sending your feedback.</p>
                    <p className="mt-1">Please try again or contact us directly:</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleDirectContact}
                      className="mt-2 text-red-600 border-red-300 hover:bg-red-50 flex items-center"
                    >
                      <Mail className="mr-1 h-4 w-4" />
                      Email us at contact@nexabloom.xyz
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name (optional)
                  </label>
                  <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email (optional)
                  </label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Your Feedback
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your thoughts, suggestions, or report issues..."
                    rows={4}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <Button 
                    type="submit" 
                    className="w-full mb-2 sm:mb-0"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>Submit Feedback</>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleDirectContact}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email Us Directly
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeedbackColumn;
