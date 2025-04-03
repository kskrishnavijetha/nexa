
import React, { useState } from 'react';
import { ComplianceReport, PredictiveAnalysis, SimulationScenario } from '@/utils/types';
import { generateScenarios, runSimulationAnalysis } from '@/utils/simulationService';
import ScenarioSelector from './ScenarioSelector';
import SimulationResults from './SimulationResults';
import SimulationConfiguration from './SimulationConfiguration';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SimulationWrapperProps {
  report: ComplianceReport;
}

const SimulationWrapper: React.FC<SimulationWrapperProps> = ({ report }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PredictiveAnalysis | null>(null);
  const [simulationDepth, setSimulationDepth] = useState<string>("medium");
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const scenarios = generateScenarios(report.industry);
  
  const handleSelectScenario = (scenarioId: string) => {
    if (isLoading) return;
    
    if (selectedScenarioId === scenarioId && !analysisResult) {
      setShowConfiguration(true);
    } else {
      setSelectedScenarioId(scenarioId);
      setAnalysisResult(null);
    }
  };
  
  const runSimulation = async (scenarioId: string) => {
    setIsLoading(true);
    
    try {
      const response = await runSimulationAnalysis(report, scenarioId);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }
      
      if (response.data) {
        setAnalysisResult(response.data);
        toast.success('Predictive analysis completed');
      }
    } catch (error) {
      console.error('Simulation error:', error);
      toast.error('Failed to run simulation analysis');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (itemToDelete) {
      toast.success(`Simulation ${itemToDelete} has been deleted permanently`);
      setItemToDelete(null);
    }
    setDeleteDialogOpen(false);
  };
  
  const resetSimulation = () => {
    setAnalysisResult(null);
    setShowConfiguration(false);
  };

  const backToScenarioSelection = () => {
    setShowConfiguration(false);
  };
  
  const selectedScenario = selectedScenarioId 
    ? scenarios.find(s => s.id === selectedScenarioId) 
    : undefined;

  return (
    <>
      {!analysisResult ? (
        <>
          <ScenarioSelector 
            scenarios={scenarios}
            onSelectScenario={handleSelectScenario}
            isLoading={isLoading}
            selectedScenarioId={selectedScenarioId}
            hideRunButton={showConfiguration}
            onDeleteClick={handleDeleteClick}
          />
          
          {selectedScenarioId && selectedScenario && showConfiguration && (
            <SimulationConfiguration
              selectedScenario={selectedScenario}
              simulationDepth={simulationDepth}
              setSimulationDepth={setSimulationDepth}
              onBackToScenarios={backToScenarioSelection}
              onRunSimulation={runSimulation}
              isLoading={isLoading}
            />
          )}
        </>
      ) : (
        <>
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={resetSimulation}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Scenarios
            </Button>
          </div>
          <SimulationResults 
            analysisData={analysisResult}
            onReset={resetSimulation}
          />
        </>
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Simulation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this simulation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SimulationWrapper;
