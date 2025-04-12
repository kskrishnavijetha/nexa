
import { useState, useEffect } from 'react';
import { ComplianceReport, SimulationScenario, PredictiveAnalysis } from '@/utils/types';
import { getSimulationScenarios, runSimulationAnalysis } from '@/utils/simulationService';
import { toast } from 'sonner';

export function useSimulationState(report: ComplianceReport) {
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
      setIsLoading(true);
      
      // Use the service to get and cache scenarios
      getSimulationScenarios(report.industry)
        .then(response => {
          if (response.success && response.data) {
            console.log("Generated scenarios:", response.data);
            setScenarios(response.data);
            setError(null);
          } else {
            throw new Error(response.error || "Failed to generate scenarios");
          }
        })
        .catch(error => {
          console.error("Error generating scenarios:", error);
          toast.error("Failed to generate simulation scenarios");
          setError("Failed to generate simulation scenarios");
        })
        .finally(() => {
          setIsLoading(false);
        });
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
    setShowConfiguration(true);
    setError(null);
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

  return {
    selectedScenarioId,
    isLoading,
    analysisResult,
    simulationDepth,
    setSimulationDepth,
    showConfiguration,
    deleteDialogOpen,
    setDeleteDialogOpen,
    itemToDelete,
    scenarios,
    error,
    selectedScenario,
    handleSelectScenario,
    runSimulation,
    handleDeleteClick,
    confirmDelete,
    resetSimulation,
    backToScenarioSelection
  };
}
