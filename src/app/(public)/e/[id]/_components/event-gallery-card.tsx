import { Card } from '@/components/ui/Card';
import { EventImage } from '@/shared/types/event';
import { getGalleryImages } from '@/shared/utils/event-images';

interface EventGalleryCardProps {
  images: EventImage[];
}

export function EventGalleryCard({ images }: EventGalleryCardProps) {
  const galleryImages = getGalleryImages(images);
  if (galleryImages.length === 0) return null;

  return (
    <Card title="Gallery" variant="bordered" padding="md">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
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
    </Card>
  );
}
