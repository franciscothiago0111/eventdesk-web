import { EventImage } from '@/shared/types/event';
import { getGalleryImages } from '@/shared/utils/event-images';

interface EventGalleryGridProps {
  images: EventImage[];
}

export function EventGalleryGrid({ images }: EventGalleryGridProps) {
  const galleryImages = getGalleryImages(images);
  if (galleryImages.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-neutral-950">Gallery</h2>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {galleryImages.map((image) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={image.id}
            src={image.url}
            alt={image.caption ?? ''}
            className="aspect-square w-full rounded-lg object-cover"
          />
        ))}
      </div>
    </div>
  );
}
