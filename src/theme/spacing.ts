// src/theme/spacing.ts
import { AppConfig } from '../app.config';

const base = AppConfig.spacing.base ?? 8;
export const spacing = {
  none: 0,
  xxs: base / 3,
  xs: base / 2,
  sm: base,
  md: base * 2,
  lg: base * 3,
  xl: base * 5,
  xxl: base * 10,
  screenPadding: AppConfig.spacing.screenPadding ?? 20,
};

export function makeSpacingUtils() {
  const utils: Record<string, object> = {};
  const sides = {
    m: 'margin',
    p: 'padding',
  };
  const directions = {
    '': '', // All sides
    t: 'Top',
    b: 'Bottom',
    l: 'Left',
    r: 'Right',
    x: ['Left', 'Right'],
    y: ['Top', 'Bottom'],
  };
  Object.entries(sides).forEach(([short, prop]) => {
    Object.entries(directions).forEach(([dirKey, dirValue]) => {
      Object.entries(spacing).forEach(([key, val]) => {
        const className = `${short}${dirKey}${key}`; // e.g., mlmd, pyxl
        if (Array.isArray(dirValue)) {
          // horizontal or vertical
          utils[className] = {
            [`${prop}${dirValue[0]}`]: val,
            [`${prop}${dirValue[1]}`]: val,
          };
        } else {
          utils[className] = {
            [`${prop}${dirValue}`]: val,
          };
        }
      });
    });
  });
  return utils;
}

const circleSizes = [16, 20, 24, 28, 32, 40, 48, 64];

export function makeCircleUtils() {
  const utils: Record<string, object> = {};
  circleSizes.forEach((size) => {
    utils[`circle${size}`] = {
      width: size,
      height: size,
      borderRadius: size / 2,
    };
  });
  return utils;
}

// Export combined utils
export const utils = {
  ...makeSpacingUtils(),
  ...makeCircleUtils(),
};
