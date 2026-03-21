// data/timezones.ts
export const TIME_ZONES = [
  // US / North America
  { code: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { code: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { code: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { code: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { code: 'America/Phoenix', label: 'Arizona Time' },
  { code: 'America/Anchorage', label: 'Alaska Time' },
  { code: 'Pacific/Honolulu', label: 'Hawaii Time' },
  // Europe
  { code: 'Europe/London', label: 'UK Time' },
  { code: 'Europe/Dublin', label: 'Ireland Time' },
  { code: 'Europe/Paris', label: 'Central Europe Time' },
  { code: 'Europe/Berlin', label: 'Central Europe Time (Germany)' },
  { code: 'Europe/Madrid', label: 'Central Europe Time (Spain)' },
  { code: 'Europe/Rome', label: 'Central Europe Time (Italy)' },
  // Americas (other)
  { code: 'America/Toronto', label: 'Eastern Time (Canada)' },
  { code: 'America/Vancouver', label: 'Pacific Time (Canada)' },
  { code: 'America/Mexico_City', label: 'Mexico City Time' },
  { code: 'America/Sao_Paulo', label: 'Brasília Time' },
  // Asia / Pacific
  { code: 'Asia/Dubai', label: 'Gulf Time (Dubai)' },
  { code: 'Asia/Kolkata', label: 'India Standard Time' },
  { code: 'Asia/Bangkok', label: 'Indochina Time' },
  { code: 'Asia/Shanghai', label: 'China Standard Time' },
  { code: 'Asia/Tokyo', label: 'Japan Standard Time' },
  { code: 'Asia/Seoul', label: 'Korea Standard Time' },
  { code: 'Australia/Sydney', label: 'Australia Eastern Time (Sydney)' },
  { code: 'Pacific/Auckland', label: 'New Zealand Time' },
] as const;