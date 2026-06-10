/** IST offset for portfolio / Kerala publish dates in VideoObject JSON-LD. */
const PUBLISH_TZ = '+05:30';

/** "Feb 4, 2024" → "2024-02-04T12:00:00+05:30" */
export function videoUploadDateIso(dateLabel: string): string {
  const parsed = Date.parse(dateLabel);
  if (Number.isNaN(parsed)) return dateLabel;

  const d = new Date(parsed);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}T12:00:00${PUBLISH_TZ}`;
}

/** "0:43" → "PT43S", "7:09" → "PT7M9S", "1:05:30" → "PT1H5M30S" */
export function videoDurationIso(display: string): string {
  const segments = display.split(':').map((part) => parseInt(part, 10));
  if (segments.some((n) => Number.isNaN(n))) return display;

  if (segments.length === 2) {
    const [minutes, seconds] = segments;
    if (minutes === 0) return `PT${seconds}S`;
    if (seconds === 0) return `PT${minutes}M`;
    return `PT${minutes}M${seconds}S`;
  }

  if (segments.length === 3) {
    const [hours, minutes, seconds] = segments;
    return `PT${hours}H${minutes}M${seconds}S`;
  }

  return display;
}
