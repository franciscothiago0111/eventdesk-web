'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { eventFormSchema, EventFormValues } from '../_schemas/event.schema';

type EventFormInput = z.input<typeof eventFormSchema>;

function toDateTimeLocal(isoDate: string): string {
  const date = new Date(isoDate);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export interface EventFormDefaults {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  capacity: number;
}

interface EventFormProps {
  defaultValues?: EventFormDefaults;
  isSubmitting: boolean;
  onSubmit: (values: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    capacity: number;
  }) => void;
  submitLabel: string;
}

export function EventForm({
  defaultValues,
  isSubmitting,
  onSubmit,
  submitLabel,
}: EventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormInput, unknown, EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          description: defaultValues.description,
          startDate: toDateTimeLocal(defaultValues.startDate),
          endDate: toDateTimeLocal(defaultValues.endDate),
          capacity: defaultValues.capacity,
        }
      : undefined,
  });

  const submit = (values: EventFormValues) => {
    onSubmit({
      name: values.name,
      description: values.description,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      capacity: values.capacity,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-col gap-4 w-full max-w-lg"
    >
      <Input
        label="Name"
        placeholder="Annual Conference"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Description"
        hasOptionalLabel
        placeholder="A short description for attendees"
        error={errors.description?.message}
        {...register('description')}
      />
      <Input
        type="datetime-local"
        label="Start date"
        error={errors.startDate?.message}
        {...register('startDate')}
      />
      <Input
        type="datetime-local"
        label="End date"
        error={errors.endDate?.message}
        {...register('endDate')}
      />
      <Input
        type="number"
        min={1}
        label="Capacity"
        error={errors.capacity?.message}
        {...register('capacity')}
      />
      <Button type="submit" isLoading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
