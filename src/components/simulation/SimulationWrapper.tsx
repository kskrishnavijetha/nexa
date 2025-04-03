
import React, { useState, useEffect } from 'react';
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
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Generate scenarios based on the report's industry when component mounts
  useEffect(() => {
    if (report && report.industry) {
      console.log("Generating scenarios for industry:", report.industry);
      try {
        const generatedScenarios = generateScenarios(report.industry);
        console.log("Generated scenarios:", generatedScenarios);
        setScenarios(generatedScenarios);
        setError(null);
      } catch (error) {
        console.error("Error generating scenarios:", error);
        toast.error("Failed to generate simulation scenarios");
        setError("Failed to generate simulation scenarios");
      }
    } else {
      console.error("Cannot generate scenarios: Missing report or industry", report);
      toast.error("Could not generate simulation scenarios due to missing data");
      setError("Missing report data needed for simulation");
    }
  }, [report]);
  
  const handleSelectScenario = (scenarioId: string) => {
    console.log("Selected scenario:", scenarioId);
    if (isLoading) return;
    
    setSelectedScenarioId(scenarioId);
    setAnalysisResult(null);
    setShowConfiguration(true); // Always show configuration when selecting a scenario
    setError(null); // Clear any previous errors
  };
  
  const runSimulation = async (scenarioId: string) => {
    if (!scenarioId || !report) {
      toast.error("Please select a scenario first");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Running simulation for scenario:", scenarioId);
      console.log("Report data:", report);
      
      // Make sure the report has all required fields for the simulation
      if (!report.documentId || !report.industry) {
        throw new Error("Invalid report data for simulation");
      }
      
      const response = await runSimulationAnalysis(report, scenarioId);
      
      console.log("Simulation response:", response);
      
      if (!response.success) {
        throw new Error(response.error || "Failed to run simulation");
      }
      
      if (response.data) {
        console.log("Simulation results:", response.data);
        setAnalysisResult(response.data);
        toast.success('Predictive analysis completed');
      } else {
        throw new Error('No simulation data returned');
      }
    } catch (error) {
      console.error('Simulation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to run simulation analysis';
      toast.error(errorMessage);
      setError(errorMessage);
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
      // In a real app, this would delete the scenario from the database
      setScenarios(prevScenarios => prevScenarios.filter(s => s.id !== itemToDelete));
      toast.success(`Simulation ${itemToDelete} has been deleted permanently`);
      setItemToDelete(null);
    }
    setDeleteDialogOpen(false);
  };
  
  const resetSimulation = () => {
    setAnalysisResult(null);
    setShowConfiguration(false);
    setSelectedScenarioId(undefined);
    setError(null);
  };

  const backToScenarioSelection = () => {
    setShowConfiguration(false);
  };
  
  const selectedScenario = selectedScenarioId 
    ? scenarios.find(s => s.id === selectedScenarioId) 
    : undefined;

  if (scenarios.length === 0) {
    return (
      <div className="text-center p-6 border rounded-lg">
        <p className="text-muted-foreground">
          {error || "Loading simulation scenarios..."}
        </p>
      </div>
    );
  }

  return (
    <>
      {error && !analysisResult && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold mr-1">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    
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
              onRunSimulation={() => runSimulation(selectedScenarioId)}
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
