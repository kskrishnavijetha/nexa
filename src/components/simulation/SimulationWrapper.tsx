
import React from 'react';
import { ComplianceReport } from '@/utils/types';
import ScenarioSelector from './ScenarioSelector';
import SimulationResults from './SimulationResults';
import SimulationConfiguration from './SimulationConfiguration';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import ErrorDisplay from './ErrorDisplay';
import { useSimulationState } from '@/hooks/useSimulationState';

interface SimulationWrapperProps {
  report: ComplianceReport;
}

const SimulationWrapper: React.FC<SimulationWrapperProps> = ({ report }) => {
  const {
    selectedScenarioId,
    isLoading,
    analysisResult,
    simulationDepth,
    setSimulationDepth,
    showConfiguration,
    deleteDialogOpen,
    setDeleteDialogOpen,
    scenarios,
    error,
    selectedScenario,
    handleSelectScenario,
    runSimulation,
    handleDeleteClick,
    confirmDelete,
    resetSimulation,
    backToScenarioSelection
  } = useSimulationState(report);

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
      {error && !analysisResult && <ErrorDisplay error={error} />}
    
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
      
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
      />
    </>
  );
};

export default SimulationWrapper;
