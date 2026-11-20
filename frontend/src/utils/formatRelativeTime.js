const UNITS = [
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
];
const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export function formatRelativeTime(isoDate, now = Date.now()) {
  const seconds = Math.round((new Date(isoDate).getTime() - now) / 1000);
  const [unit, size] = UNITS.find(([, unitSeconds]) => Math.abs(seconds) >= unitSeconds) ?? UNITS.at(-1);
  return formatter.format(Math.round(seconds / size), unit);
}
