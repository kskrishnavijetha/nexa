
/**
 * Utility functions for managing schedule workers
 */
import { supabase } from '@/integrations/supabase/client';

/**
 * Register a schedule worker for a document
 * @param schedule Schedule configuration
 */
export const registerScheduleWorker = (schedule: any) => {
  const scheduleKey = `scheduleWorker_${schedule.documentId}`;
  
  const getNextRunTime = () => {
    const now = new Date();
    const [hours, minutes] = schedule.time.split(':').map(Number);
    const nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);
    
    if (nextRun < now) {
      switch (schedule.frequency) {
        case 'daily':
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case 'weekly':
          nextRun.setDate(nextRun.getDate() + 7);
          break;
        case 'monthly':
          nextRun.setMonth(nextRun.getMonth() + 1);
          break;
        default:
          nextRun.setDate(nextRun.getDate() + 1);
      }
    }
    
    return nextRun;
  };
  
  const nextRun = getNextRunTime();
  localStorage.setItem(`${scheduleKey}_nextRun`, nextRun.toISOString());
  
  console.log(`Schedule worker registered for ${schedule.documentName}, next run: ${nextRun}`);
};
