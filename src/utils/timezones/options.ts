// utils/timezones/options.ts
import { TIME_ZONES } from '../../data/timezones';
import { getUtcOffset } from './helper';

export const buildTimeZoneOptions = () => {
  const now = new Date();
  return TIME_ZONES.map((tz) => {
    const offset = getUtcOffset(tz.code, now);
    return {
      label: tz.label,
      description: `${offset} — ${tz.code}`,
      rightText: offset,
      selectedText: tz.label,
      value: tz.code,
    };
  });
};
