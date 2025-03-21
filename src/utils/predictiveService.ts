
// This file is now just a re-export to maintain backward compatibility
// The actual implementation has been split into smaller modules in the /predictive directory
import { analyzePastReports } from './predictive';
export type { PredictiveAnalyticsResult } from './predictive';

export { analyzePastReports };
