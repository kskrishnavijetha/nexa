
import { z } from 'zod';

export const scheduleFormSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  enabled: z.boolean().default(true),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Time must be in HH:MM format",
  }),
  documentName: z.string().min(1, "Document name is required"),
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
});

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

export const getFrequencyDescription = (frequency: string) => {
  switch (frequency) {
    case 'daily':
      return 'Scans will run every day at the specified time';
    case 'weekly':
      return 'Scans will run every week on the same day at the specified time';
    case 'monthly':
      return 'Scans will run on the same day each month at the specified time';
    default:
      return '';
  }
};
