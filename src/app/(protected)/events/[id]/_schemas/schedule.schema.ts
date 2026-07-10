import { z } from 'zod';

export function buildScheduleItemFormSchema(eventStartDate: string, eventEndDate: string) {
  const eventStart = new Date(eventStartDate);
  const eventEnd = new Date(eventEndDate);

  return z
    .object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().optional(),
      startTime: z.string().min(1, 'Start time is required'),
      endTime: z.string().min(1, 'End time is required'),
    })
    .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
      message: 'Start time must be before end time',
      path: ['endTime'],
    })
    .refine((data) => new Date(data.startTime) >= eventStart, {
      message: 'Start time must be within the event dates',
      path: ['startTime'],
    })
    .refine((data) => new Date(data.endTime) <= eventEnd, {
      message: 'End time must be within the event dates',
      path: ['endTime'],
    });
}

export type ScheduleItemFormValues = z.infer<
  ReturnType<typeof buildScheduleItemFormSchema>
>;
