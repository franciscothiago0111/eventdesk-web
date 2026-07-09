import { EventImage, EventImageType } from '@/shared/types/event';

export function getImageByType(images: EventImage[], type: EventImageType) {
  return images.find((image) => image.type === type) ?? null;
}

export function getGalleryImages(images: EventImage[]) {
  return images.filter((image) => image.type === 'GALLERY');
}
