'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EventImage, EventImageType } from '@/shared/types/event';
import { getGalleryImages, getImageByType } from '@/shared/utils/event-images';
import {
  useDeleteEventImage,
  useUploadEventImage,
} from '../_hooks/use-event-images';

interface ImagesSectionProps {
  eventId: string;
  images: EventImage[];
}

function ImageSlot({
  label,
  type,
  image,
  eventId,
}: {
  label: string;
  type: EventImageType;
  image: EventImage | null;
  eventId: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadImage = useUploadEventImage(eventId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadImage.mutate(
      { file, type },
      {
        onError: () => toast.error(`Could not upload the ${label.toLowerCase()} image`),
      },
    );
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-neutral-950">{label}</span>
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-lg bg-neutral-100">
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.url} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <Button
          type="button"
          variant="secondary"
          leftIcon={<Upload className="size-4" />}
          isLoading={uploadImage.isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          {image ? 'Replace' : 'Upload'}
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

export function ImagesSection({ eventId, images }: ImagesSectionProps) {
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadImage = useUploadEventImage(eventId);
  const deleteImage = useDeleteEventImage(eventId);

  const profileImage = getImageByType(images, 'PROFILE');
  const coverImage = getImageByType(images, 'COVER');
  const galleryImages = getGalleryImages(images);

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadImage.mutate(
      { file, type: 'GALLERY' },
      { onError: () => toast.error('Could not upload the image') },
    );
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-neutral-950">Images</h2>

      <div className="flex flex-wrap gap-8">
        <ImageSlot label="Profile" type="PROFILE" image={profileImage} eventId={eventId} />
        <ImageSlot label="Cover" type="COVER" image={coverImage} eventId={eventId} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-neutral-950">Gallery</span>
          <Button
            type="button"
            variant="secondary"
            leftIcon={<Upload className="size-4" />}
            isLoading={uploadImage.isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            Add photo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleGalleryFileChange}
          />
        </div>

        {galleryImages.length === 0 ? (
          <p className="text-sm text-neutral-500">No gallery photos yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {galleryImages.map((image) => (
              <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => setImageToDelete(image.id)}
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={imageToDelete !== null}
        onClose={() => setImageToDelete(null)}
        onConfirm={async () => {
          if (!imageToDelete) return;
          await deleteImage.mutateAsync(imageToDelete, {
            onError: () => toast.error('Could not delete the image'),
          });
          setImageToDelete(null);
        }}
        title="Delete photo"
        message="This photo will be permanently removed from the gallery."
        confirmText="Delete"
        isLoading={deleteImage.isPending}
      />
    </div>
  );
}
