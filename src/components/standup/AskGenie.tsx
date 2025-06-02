
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'genie';
  timestamp: Date;
}

const AskGenie = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Genie, your stand-up assistant. Ask me about team progress, blockers, or sprint status!",
      sender: 'genie',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "What is Priya blocked on?",
    "Show me last week's progress",
    "Which tickets are falling behind?",
    "Who hasn't updated their status?",
    "What are the main blockers this sprint?"
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const responses = {
        "what is priya blocked on": "Priya is currently blocked on 2 issues: API integration testing (waiting for staging environment) and code review approval for PR #234.",
        "show me last week's progress": "Last week the team completed 12 out of 15 planned tickets. John and Sarah were the top contributors with 4 tickets each.",
        "which tickets are falling behind": "3 tickets are behind schedule: PROJ-123 (due 2 days ago), PROJ-145 (no progress in 3 days), and PROJ-167 (assigned but not started).",
        "who hasn't updated their status": "Mike Johnson hasn't updated his status in 2 days, and Tom Brown's last update was yesterday morning.",
        "main blockers": "The main blockers this sprint are: API dependencies (3 tickets), code review bottleneck (2 tickets), and testing environment issues (1 ticket)."
      };

      const responseKey = Object.keys(responses).find(key => 
        input.toLowerCase().includes(key)
      );

      const responseText = responseKey 
        ? responses[responseKey as keyof typeof responses]
        : "I understand you're asking about team progress. Could you be more specific? Try asking about blockers, progress, or specific team members.";

      const genieMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'genie',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, genieMessage]);
    } catch (error) {
      toast.error('Failed to get response from Genie');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="bg-slate-800/50 border-slate-700 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Ask Genie
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4 pr-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-slate-100'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 text-slate-100 max-w-[80%] p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                        <span className="text-sm">Genie is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about team progress, blockers, or sprint status..."
                className="bg-slate-700 border-slate-600 text-white"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggested Questions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Suggested Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleSuggestedQuestion(question)}
                className="w-full text-left justify-start bg-slate-700/30 border-slate-600 text-slate-200 hover:bg-slate-600 hover:text-white"
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AskGenie;
