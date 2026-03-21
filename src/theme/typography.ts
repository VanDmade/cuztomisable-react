// src/theme/typography.ts
import { AppConfig, ThemeMode } from '../app.config';
import { getColors } from './colors';

export const getTypography = (mode: ThemeMode) => {
  const c = getColors(mode);
  const t = AppConfig.typography;
  return {
    fontFamily: t.fontFamily,
    sizes: t.sizes,
    weights: t.weights,
    variants: {
      title: {
        fontSize: t.sizes.lg,
        fontWeight: t.weights.bold,
        color: c.text,
      },
      subtitle: {
        fontSize: t.sizes.sm,
        color: c.muted,
      },
      body: {
        fontSize: t.sizes.md,
        fontWeight: t.weights.regular,
        color: c.text,
      },
      caption: {
        fontSize: t.sizes.xs,
        fontWeight: t.weights.regular,
        color: c.muted,
      },
      muted: {
        fontSize: t.sizes.xs,
        color: c.muted,
      },
      link: {
        fontSize: t.sizes.xs,
        color: c.link,
        fontWeight: t.weights.medium,
      },
      error: {
        fontSize: t.sizes.xxs,
        color: c.danger
      },
      placeholder: {
        color: c.muted,
        fontWeight: '400',
      }
    },
  } as const;
};

export type Typography = ReturnType<typeof getTypography>;
