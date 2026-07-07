import { describe, expect, it } from 'vitest';
import { eventFormSchema } from './event.schema';

const validPayload = {
  name: 'Conference',
  description: 'A great conference',
  startDate: '2026-08-01T09:00:00.000Z',
  endDate: '2026-08-02T09:00:00.000Z',
  capacity: 100,
};

describe('eventFormSchema', () => {
  it('accepts a valid payload', () => {
    const result = eventFormSchema.safeParse(validPayload);

    expect(result.success).toBe(true);
  });

  it('accepts a payload without a description', () => {
    const result = eventFormSchema.safeParse({
      ...validPayload,
      description: undefined,
    });

    expect(result.success).toBe(true);
  });

  it('rejects a missing name with the right message', () => {
    const result = eventFormSchema.safeParse({ ...validPayload, name: '' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name is required');
    }
  });

  it('rejects a missing start date with the right message', () => {
    const result = eventFormSchema.safeParse({
      ...validPayload,
      startDate: '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Start date is required');
    }
  });

  it('rejects a missing end date with the right message', () => {
    const result = eventFormSchema.safeParse({
      ...validPayload,
      endDate: '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('End date is required');
    }
  });

  it('rejects a capacity below 1 with the right message', () => {
    const result = eventFormSchema.safeParse({ ...validPayload, capacity: 0 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Capacity must be at least 1',
      );
    }
  });

  it('rejects a start date that is after the end date, flagging endDate', () => {
    const result = eventFormSchema.safeParse({
      ...validPayload,
      startDate: '2026-08-03T09:00:00.000Z',
      endDate: '2026-08-02T09:00:00.000Z',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Start date must be before end date',
      );
      expect(result.error.issues[0].path).toEqual(['endDate']);
    }
  });
});
