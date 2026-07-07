import { z } from 'zod';

export const eventFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    location: z.string().optional(),
    profileImageUrl: z
      .string()
      .url('Must be a valid URL')
      .optional()
      .or(z.literal('')),
    coverImageUrl: z
      .string()
      .url('Must be a valid URL')
      .optional()
      .or(z.literal('')),
    pass: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1'),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: 'Start date must be before end date',
    path: ['endDate'],
  });

export type EventFormValues = z.infer<typeof eventFormSchema>;
