// src/theme/colors.ts
import { AppConfig, ThemeMode } from '../app.config';

export const getColors = (mode: ThemeMode) => {
  return AppConfig.colors[mode ?? 'light'];
};

export type Colors = ReturnType<typeof getColors>;