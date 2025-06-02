
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import JiraOAuthStep from './steps/JiraOAuthStep';
import SlackOAuthStep from './steps/SlackOAuthStep';
import TeamConfigStep from './steps/TeamConfigStep';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const steps = [
    { id: 1, title: 'Connect Jira Cloud', description: 'Link your Jira workspace' },
    { id: 2, title: 'Connect Slack', description: 'Set up Slack integration' },
    { id: 3, title: 'Configure Team', description: 'Choose time and team members' }
  ];

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    
    if (stepId < 3) {
      setCurrentStep(stepId + 1);
    } else {
      onComplete();
    }
  };

  const canProceed = (stepId: number) => {
    return completedSteps.includes(stepId);
  };

  const progressPercentage = (completedSteps.length / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-white">Welcome to StandUpGenie</h1>
            <span className="text-slate-300">Step {currentStep} of {steps.length}</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  completedSteps.includes(step.id) 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.id 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-slate-600 text-slate-300'
                }`}>
                  {completedSteps.includes(step.id) ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span className={`text-xs mt-2 text-center ${
                  currentStep === step.id ? 'text-white' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              {steps[currentStep - 1].title}
            </CardTitle>
            <p className="text-slate-300">{steps[currentStep - 1].description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <JiraOAuthStep onComplete={() => handleStepComplete(1)} />
            )}
            {currentStep === 2 && (
              <SlackOAuthStep onComplete={() => handleStepComplete(2)} />
            )}
            {currentStep === 3 && (
              <TeamConfigStep onComplete={() => handleStepComplete(3)} />
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button
                onClick={() => {
                  if (canProceed(currentStep)) {
                    if (currentStep < 3) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      onComplete();
                    }
                  }
                }}
                disabled={!canProceed(currentStep)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {currentStep === 3 ? 'Complete Setup' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow;
