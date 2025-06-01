
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Users, Zap } from 'lucide-react';
import JiraOAuthStep from './steps/JiraOAuthStep';
import SlackOAuthStep from './steps/SlackOAuthStep';
import TeamConfigStep from './steps/TeamConfigStep';

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [onboardingData, setOnboardingData] = useState({
    jiraConnected: false,
    slackConnected: false,
    standupTime: '',
    selectedMembers: []
  });

  const steps = [
    { id: 1, title: 'Connect Jira Cloud', icon: Zap, description: 'Connect your Jira workspace for issue tracking' },
    { id: 2, title: 'Connect Slack', icon: Users, description: 'Link your Slack workspace for notifications' },
    { id: 3, title: 'Configure Team', icon: Clock, description: 'Set stand-up time and select team members' }
  ];

  const progress = (completedSteps.length / steps.length) * 100;

  const handleStepComplete = (stepId: number, data: any) => {
    setCompletedSteps(prev => [...prev, stepId]);
    setOnboardingData(prev => ({ ...prev, ...data }));
    
    if (stepId < steps.length) {
      setCurrentStep(stepId + 1);
    }
  };

  const isStepCompleted = (stepId: number) => completedSteps.includes(stepId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to StandUp Genie</h1>
          <p className="text-purple-100">Let's get your automated stand-ups set up in 3 simple steps</p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">Setup Progress</span>
              <span className="text-white">{completedSteps.length}/{steps.length} Complete</span>
            </div>
            <Progress value={progress} className="h-3" indicatorClassName="bg-gradient-to-r from-purple-400 to-blue-400" />
            
            <div className="flex justify-between mt-6">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                    isStepCompleted(step.id) 
                      ? 'bg-green-500 text-white' 
                      : currentStep === step.id 
                        ? 'bg-white text-purple-600 ring-4 ring-purple-300' 
                        : 'bg-white/20 text-white'
                  }`}>
                    {isStepCompleted(step.id) ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  <span className={`text-sm text-center ${
                    currentStep === step.id ? 'text-white font-medium' : 'text-purple-100'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <steps[currentStep - 1].icon className="h-8 w-8 text-purple-600" />
              {steps[currentStep - 1].title}
            </CardTitle>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </CardHeader>
          
          <CardContent className="p-6">
            {currentStep === 1 && (
              <JiraOAuthStep onComplete={(data) => handleStepComplete(1, data)} />
            )}
            {currentStep === 2 && (
              <SlackOAuthStep onComplete={(data) => handleStepComplete(2, data)} />
            )}
            {currentStep === 3 && (
              <TeamConfigStep onComplete={(data) => handleStepComplete(3, data)} />
            )}
            
            {completedSteps.length === steps.length && (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Setup Complete!</h3>
                <p className="text-gray-600 mb-6">Your automated stand-ups are now configured and ready to go.</p>
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow;
