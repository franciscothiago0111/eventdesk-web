'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Clock, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ScheduleItem } from '@/shared/types/event';
import {
  buildScheduleItemFormSchema,
  ScheduleItemFormValues,
} from '../_schemas/schedule.schema';
import {
  useCreateScheduleItem,
  useDeleteScheduleItem,
  useUpdateScheduleItem,
} from '../_hooks/use-schedule';

interface ScheduleSectionProps {
  eventId: string;
  schedule: ScheduleItem[];
  eventStartDate: string;
  eventEndDate: string;
}

function formatDay(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(new Date(value));
}

function toDateTimeLocal(isoDate: string): string {
  const date = new Date(isoDate);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function ScheduleSection({
  eventId,
  schedule,
  eventStartDate,
  eventEndDate,
}: ScheduleSectionProps) {
  const [editingItem, setEditingItem] = useState<ScheduleItem | null | 'new'>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const createItem = useCreateScheduleItem(eventId);
  const updateItem = useUpdateScheduleItem(eventId);
  const deleteItem = useDeleteScheduleItem(eventId);

  const isModalOpen = editingItem !== null;
  const editingExisting = editingItem !== null && editingItem !== 'new' ? editingItem : null;

  const minDateTimeLocal = toDateTimeLocal(eventStartDate);
  const maxDateTimeLocal = toDateTimeLocal(eventEndDate);

  const scheduleItemFormSchema = useMemo(
    () => buildScheduleItemFormSchema(eventStartDate, eventEndDate),
    [eventStartDate, eventEndDate],
  );

  const sortedSchedule = useMemo(
    () =>
      [...schedule].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      ),
    [schedule],
  );

  const groupedByDay = useMemo(() => {
    const groups = new Map<string, ScheduleItem[]>();
    for (const item of sortedSchedule) {
      const key = new Date(item.startTime).toDateString();
      const group = groups.get(key);
      if (group) {
        group.push(item);
      } else {
        groups.set(key, [item]);
      }
    }
    return Array.from(groups.entries());
  }, [sortedSchedule]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScheduleItemFormValues>({
    resolver: zodResolver(scheduleItemFormSchema),
  });

  const openCreateModal = () => {
    reset({ title: '', description: '', startTime: '', endTime: '' });
    setEditingItem('new');
  };

  const openEditModal = (item: ScheduleItem) => {
    reset({
      title: item.title,
      description: item.description ?? '',
      startTime: toDateTimeLocal(item.startTime),
      endTime: toDateTimeLocal(item.endTime),
    });
    setEditingItem(item);
  };

  const submit = (values: ScheduleItemFormValues) => {
    const payload = {
      title: values.title,
      description: values.description,
      startTime: new Date(values.startTime).toISOString(),
      endTime: new Date(values.endTime).toISOString(),
    };

    if (editingExisting) {
      updateItem.mutate(
        { itemId: editingExisting.id, payload },
        {
          onSuccess: () => setEditingItem(null),
          onError: () => toast.error('Could not update the schedule item'),
        },
      );
    } else {
      createItem.mutate(payload, {
        onSuccess: () => setEditingItem(null),
        onError: () => toast.error('Could not create the schedule item'),
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-950">Schedule</h2>
        <Button
          type="button"
          variant="secondary"
          leftIcon={<Plus className="size-4" />}
          onClick={openCreateModal}
        >
          Add item
        </Button>
      </div>

      {schedule.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
          No schedule items yet.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {groupedByDay.map(([day, items]) => (
            <div key={day} className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {formatDay(items[0].startTime)}
              </span>
              <ol className="flex flex-col gap-2 border-l-2 border-neutral-200 pl-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="relative rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
                  >
                    <span className="absolute -left-5.25 top-5 size-2.5 rounded-full bg-secondary-main" />
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                          <Clock className="size-3.5" />
                          <span>
                            {formatTime(item.startTime)} – {formatTime(item.endTime)}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-neutral-950">{item.title}</p>
                        {item.description && (
                          <p className="text-sm text-neutral-500">{item.description}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          aria-label="Edit schedule item"
                          onClick={() => openEditModal(item)}
                          className="text-neutral-500 hover:text-neutral-900"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete schedule item"
                          onClick={() => setItemToDelete(item.id)}
                          className="text-neutral-500 hover:text-feedback-error-main"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setEditingItem(null)}
        title={editingExisting ? 'Edit schedule item' : 'Add schedule item'}
        footer={
          <>
            <Button variant="secondary" className="w-full" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button
              className="w-full"
              isLoading={createItem.isPending || updateItem.isPending}
              onClick={handleSubmit(submit)}
            >
              Save
            </Button>
          </>
        }
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
          <Input label="Title" placeholder="Opening keynote" error={errors.title?.message} {...register('title')} />
          <Input
            label="Description"
            hasOptionalLabel
            placeholder="Welcome remarks and agenda overview"
            error={errors.description?.message}
            {...register('description')}
          />
          <Input
            type="datetime-local"
            label="Start time"
            hint={`Must be between ${formatDay(eventStartDate)} and ${formatDay(eventEndDate)}`}
            min={minDateTimeLocal}
            max={maxDateTimeLocal}
            error={errors.startTime?.message}
            {...register('startTime')}
          />
          <Input
            type="datetime-local"
            label="End time"
            min={minDateTimeLocal}
            max={maxDateTimeLocal}
            error={errors.endTime?.message}
            {...register('endTime')}
          />
        </form>
      </Modal>

      <ConfirmModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={async () => {
          if (!itemToDelete) return;
          await deleteItem.mutateAsync(itemToDelete, {
            onError: () => toast.error('Could not delete the schedule item'),
          });
          setItemToDelete(null);
        }}
        title="Delete schedule item"
        message="This item will be permanently removed from the schedule."
        confirmText="Delete"
        isLoading={deleteItem.isPending}
      />
    </div>
  );
}
