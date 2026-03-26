// src/theme/spacing.ts
// Default base value for spacing
const defaultBase = 8;

export interface Layout {
    spacing: {
        none: number;
        xxs: number;
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
        screenPadding: number;
    };
    radius: {
        sm: number;
        md: number;
        lg: number;
        pill: number;
        [key: string]: number;
    };
}

export function getLayout(
    overrides: { base?: number; radius?: Partial<Layout['radius']> } = {}
): Layout {
    const base = overrides.base ?? defaultBase;

    return {
        spacing: {
            none: 0,
            xxs: base / 3,
            xs: base / 2,
            sm: base,
            md: base * 2,
            lg: base * 3,
            xl: base * 5,
            xxl: base * 10,
            screenPadding: 20,
        },
        radius: {
            sm: 4,
            md: 8,
            lg: 16,
            pill: 9999,
            ...(overrides.radius || {}),
        },
    };
}

// Keep for backward compatibility if needed
export const layout = getLayout();

export function makeSpacingUtils(layout: Layout) {
    const utils: Record<string, object> = {};

    const sides = {
        m: 'margin',
        p: 'padding',
    };

    const directions = {
        '': '',
        t: 'Top',
        b: 'Bottom',
        l: 'Left',
        r: 'Right',
        x: ['Left', 'Right'],
        y: ['Top', 'Bottom'],
    };

    Object.entries(sides).forEach(([short, prop]) => {
        Object.entries(directions).forEach(([dirKey, dirValue]) => {
            Object.entries(layout.spacing).forEach(([key, val]) => {
                const className = `${short}${dirKey}${key}`;

                if (Array.isArray(dirValue)) {
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

const circleSizes = [
    16, 20, 24, 28, 32, 40, 48, 64, 80, 96,
    128, 160, 192, 256, 320, 384, 512, 640,
    768, 896, 1024,
];

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