
export interface DemoModeConfig {
  enabled: boolean;
  scansRemaining: number;
  maxScans: number;
  features: string[];
}

// Demo mode configuration
const DEMO_CONFIG: DemoModeConfig = {
  enabled: false,
  scansRemaining: 3,
  maxScans: 3,
  features: [
    'compliance-scan',
    'basic-reports',
    'file-upload',
    'google-drive',
    'zoom-integration'
  ]
};

// Check if demo mode is enabled
export const isDemoMode = (): boolean => {
  const demoMode = localStorage.getItem('demo_mode');
  return demoMode === 'true';
};

// Enable demo mode
export const enableDemoMode = (): void => {
  localStorage.setItem('demo_mode', 'true');
  localStorage.setItem('demo_config', JSON.stringify(DEMO_CONFIG));
};

// Disable demo mode
export const disableDemoMode = (): void => {
  localStorage.removeItem('demo_mode');
  localStorage.removeItem('demo_config');
};

// Get demo configuration
export const getDemoConfig = (): DemoModeConfig => {
  const config = localStorage.getItem('demo_config');
  if (config) {
    return JSON.parse(config);
  }
  return DEMO_CONFIG;
};

// Update demo scans remaining
export const useDemoScan = (): boolean => {
  if (!isDemoMode()) return false;
  
  const config = getDemoConfig();
  if (config.scansRemaining > 0) {
    config.scansRemaining -= 1;
    localStorage.setItem('demo_config', JSON.stringify(config));
    return true;
  }
  return false;
};

// Check if demo feature is available
export const isDemoFeatureAvailable = (feature: string): boolean => {
  if (!isDemoMode()) return true;
  
  const config = getDemoConfig();
  return config.features.includes(feature);
};

// Reset demo mode
export const resetDemoMode = (): void => {
  const resetConfig = { ...DEMO_CONFIG };
  resetConfig.enabled = true;
  localStorage.setItem('demo_config', JSON.stringify(resetConfig));
};
