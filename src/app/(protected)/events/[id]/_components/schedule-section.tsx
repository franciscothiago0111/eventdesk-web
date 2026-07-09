'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableEmpty,
  TableHead,
  TableHeadCell,
  TableRow,
  TableScrollArea,
} from '@/components/ui/Table';
import { ScheduleItem } from '@/shared/types/event';
import {
  scheduleItemFormSchema,
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
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function toDateTimeLocal(isoDate: string): string {
  const date = new Date(isoDate);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function ScheduleSection({ eventId, schedule }: ScheduleSectionProps) {
  const [editingItem, setEditingItem] = useState<ScheduleItem | null | 'new'>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const createItem = useCreateScheduleItem(eventId);
  const updateItem = useUpdateScheduleItem(eventId);
  const deleteItem = useDeleteScheduleItem(eventId);

  const isModalOpen = editingItem !== null;
  const editingExisting = editingItem !== null && editingItem !== 'new' ? editingItem : null;

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

      <TableContainer>
        <TableScrollArea>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Title</TableHeadCell>
                <TableHeadCell>Starts</TableHeadCell>
                <TableHeadCell>Ends</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedule.length === 0 ? (
                <TableEmpty colSpan={4} message="No schedule items yet." />
              ) : (
                schedule.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{formatTime(item.startTime)}</TableCell>
                    <TableCell>{formatTime(item.endTime)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableScrollArea>
      </TableContainer>

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
            error={errors.startTime?.message}
            {...register('startTime')}
          />
          <Input
            type="datetime-local"
            label="End time"
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
