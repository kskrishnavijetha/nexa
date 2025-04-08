
/**
 * Utility functions for checking and executing scheduled tasks
 */
import { sendScheduledEmailNotification } from './scheduleNotification';

/**
 * Check all scheduled tasks and execute those that need to run
 */
export const checkScheduledTasks = () => {
  const scheduleKeys = Object.keys(localStorage).filter(key => key.startsWith('compliZen_schedule_'));
  
  if (scheduleKeys.length === 0) return;
  
  console.log(`Found ${scheduleKeys.length} scheduled tasks to check`);
  
  scheduleKeys.forEach(key => {
    try {
      const schedule = JSON.parse(localStorage.getItem(key) || '{}');
      
      if (!schedule.enabled || !schedule.email) {
        return;
      }
      
      const scheduleKey = `scheduleWorker_${schedule.documentId}`;
      const nextRunStr = localStorage.getItem(`${scheduleKey}_nextRun`);
      
      if (!nextRunStr) {
        // Import and call registerScheduleWorker dynamically to avoid circular dependency
        import('./scheduleWorker').then(module => {
          module.registerScheduleWorker(schedule);
        });
        return;
      }
      
      const nextRun = new Date(nextRunStr);
      const now = new Date();
      
      if (nextRun <= now) {
        console.log(`Executing scheduled task for ${schedule.documentName}`);
        
        sendScheduledEmailNotification(schedule).then(success => {
          if (success) {
            const newNextRun = new Date(nextRun);
            switch (schedule.frequency) {
              case 'daily':
                newNextRun.setDate(newNextRun.getDate() + 1);
                break;
              case 'weekly':
                newNextRun.setDate(newNextRun.getDate() + 7);
                break;
              case 'monthly':
                newNextRun.setMonth(newNextRun.getMonth() + 1);
                break;
            }
            
            localStorage.setItem(`${scheduleKey}_nextRun`, newNextRun.toISOString());
            console.log(`Next run scheduled for ${schedule.documentName}: ${newNextRun}`);
          }
        });
      } else {
        console.log(`Task for ${schedule.documentName} will run at ${nextRun}`);
      }
    } catch (err) {
      console.error('Error checking scheduled task:', err);
    }
  });
};
