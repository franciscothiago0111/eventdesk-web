export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Turns `IN_PROGRESS` into `In Progress`. */
export function formatEnumLabel(value: string): string {
  if (!value) return 'Unknown';
  return value
    .split('_')
    .map((word) => capitalize(word.toLowerCase()))
    .join(' ');
}
