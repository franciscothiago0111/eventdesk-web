import { describe, expect, it } from 'vitest';
import { buildPublicRegistrationSchema } from './public-registration.schema';

describe('buildPublicRegistrationSchema', () => {
  it('accepts a valid attendee when no pass is required', () => {
    const schema = buildPublicRegistrationSchema(false);
    const result = schema.safeParse({
      attendeeName: 'Jane Doe',
      attendeeEmail: 'jane@example.com',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a missing pass when one is required', () => {
    const schema = buildPublicRegistrationSchema(true);
    const result = schema.safeParse({
      attendeeName: 'Jane Doe',
      attendeeEmail: 'jane@example.com',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Access pass is required',
      );
    }
  });

  it('accepts a valid pass when one is required', () => {
    const schema = buildPublicRegistrationSchema(true);
    const result = schema.safeParse({
      attendeeName: 'Jane Doe',
      attendeeEmail: 'jane@example.com',
      pass: 'let-me-in',
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const schema = buildPublicRegistrationSchema(false);
    const result = schema.safeParse({
      attendeeName: 'Jane Doe',
      attendeeEmail: 'not-an-email',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Enter a valid email');
    }
  });
});
