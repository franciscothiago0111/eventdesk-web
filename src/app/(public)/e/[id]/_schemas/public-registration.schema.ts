import { z } from 'zod';

export function buildPublicRegistrationSchema(requiresPass: boolean) {
  return z
    .object({
      attendeeName: z.string().min(1, 'Name is required'),
      attendeeEmail: z.string().email('Enter a valid email'),
      pass: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (requiresPass && !data.pass?.length) {
        ctx.addIssue({
          code: 'custom',
          path: ['pass'],
          message: 'Access pass is required',
        });
      }
    });
}

export type PublicRegistrationValues = z.infer<
  ReturnType<typeof buildPublicRegistrationSchema>
>;
