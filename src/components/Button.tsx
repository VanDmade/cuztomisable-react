// ...existing code...
export { Button };
// src/components/Button.tsx
    import React, { useMemo } from 'react';
    import {
        ActivityIndicator,
        GestureResponderEvent,
        Pressable,
        PressableProps,
        StyleProp,
        Text,
        TextStyle,
        View,
        ViewStyle,
    } from 'react-native';
    import { AppConfig } from '../app.config';
    import { makeTheme } from '../theme/theme';

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'text';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type ButtonIntent =
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'ternary'
    | 'danger'
    | 'success'
    | 'info'
    | 'warning';

export type ThemeColors = {
    primary: string;
    secondary: string;
    accent: string;
    ternary: string;
    danger: string;
    success: string;
    info: string;
    warning: string;
    light: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    white: string;
    border: string;
    link: string;
};

type ButtonColors = {
    /** Solid background (solid variant) */
    background?: string;
    /** Text/icon color */
    foreground?: string;
    /** Border color (outline variant) */
    border?: string;
    /** Overlay shown while pressed (all variants) */
    pressedBackground?: string;
    /** Disabled state background (solid) */
    disabledBackground?: string;
    /** Disabled state text/icon color (all) */
    disabledForeground?: string;
};

export type ButtonProps = Omit<PressableProps, 'style' | 'children' | 'onPress'> & {
    /** Text label (ignored if children provided) */
    title?: string;

    /** Optional left / right content (icons, etc.) */
    left?: React.ReactNode;
    right?: React.ReactNode;

    /** If provided, replaces the label row entirely */
    children?: React.ReactNode;

    /** Visual styling */
    variant?: ButtonVariant;

    /** Semantic color role */
    intent?: ButtonIntent;

    /** Theme colors (optional; defaults to app config theme) */
    themeColors?: ThemeColors;

    /** Size preset */
    size?: ButtonSize;

    /** Radius for the container */
    radius?: number;

    /** Full-width button */
    fullWidth?: boolean; // use this to make the button span the parent's width

    /** Disable interactions */
    disabled?: boolean;

    /** Loading state (disables interactions + shows spinner) */
    loading?: boolean;

    /** Spinner color override (defaults to computed foreground) */
    spinnerColor?: string;

    /** Overrides (wins over intent+theme) */
    colors?: ButtonColors;

    /** Padding override (if you don�t want size presets) */
    paddingHorizontal?: number;
    paddingVertical?: number;

    /** Gap between left/content/right */
    gap?: number;

    /** Alignment for content row */
    align?: 'left' | 'center' | 'right';

    /** Text options */
    textStyle?: StyleProp<TextStyle>;
    textNumberOfLines?: number;
    textAllowFontScaling?: boolean;

    /** Outer wrapper style */
    containerStyle?: StyleProp<ViewStyle>;

    /** Inner pressable style */
    buttonStyle?: StyleProp<ViewStyle>;

    /** Optional shadow toggle + styles */
    shadow?: boolean;
    shadowStyle?: StyleProp<ViewStyle>;

    /** Minimum dimensions */
    minWidth?: number;
    minHeight?: number;

    /** Hit slop convenience */
    hitSlopPadding?: number;

    /** Press handler (ignored when disabled/loading) */
    onPress?: (event: GestureResponderEvent) => void;
};

// derive default colors from app config theme
const DEFAULT_THEME_COLORS: ThemeColors = makeTheme(AppConfig.defaultTheme).colors as ThemeColors;

const SIZE_PRESETS: Record<ButtonSize, { px: number; py: number; fontSize: number; minHeight: number }> = {
    xs: { px: 10, py: 6, fontSize: 12, minHeight: 32 },
    sm: { px: 12, py: 8, fontSize: 14, minHeight: 36 },
    md: { px: 14, py: 10, fontSize: 16, minHeight: 42 },
    lg: { px: 16, py: 12, fontSize: 18, minHeight: 48 },
    xl: { px: 18, py: 14, fontSize: 20, minHeight: 56 },
};

function isNumber(v: unknown): v is number {
    return typeof v === 'number' && Number.isFinite(v);
}

function resolveIntentColors(theme: ThemeColors, intent: ButtonIntent, variant: ButtonVariant) {
    const intentColor = theme[intent];
    if (variant === 'solid') {
        return {
            background: intentColor,
            foreground: theme.white,
            border: intentColor,
            pressedBackground: 'rgba(0,0,0,0.10)',
            disabledBackground: theme.border,
            disabledForeground: theme.muted,
        } satisfies Required<ButtonColors>;
    }
    if (variant === 'outline') {
        return {
            background: 'transparent',
            foreground: intentColor,
            border: intentColor,
            pressedBackground: 'rgba(0,0,0,0.06)',
            disabledBackground: 'transparent',
            disabledForeground: theme.muted,
        } satisfies Required<ButtonColors>;
    }
    if (variant === 'text') {
        return {
            background: 'transparent',
            foreground: intentColor,
            border: 'transparent',
            pressedBackground: 'rgba(0,0,0,0.04)',
            disabledBackground: 'transparent',
            disabledForeground: theme.muted,
        } satisfies Required<ButtonColors>;
    }
    // ghost
    return {
        background: 'transparent',
        foreground: intentColor,
        border: 'transparent',
        pressedBackground: 'rgba(0,0,0,0.06)',
        disabledBackground: 'transparent',
        disabledForeground: theme.muted,
    } satisfies Required<ButtonColors>;
}

export default function Button({
    title,
    left,
    right,
    children,
    variant = 'solid',
    intent = 'primary',
    themeColors,
    size = 'md',
    radius = 14,
    fullWidth = false,
    disabled = false,
    loading = false,
    spinnerColor,
    colors,
    paddingHorizontal,
    paddingVertical,
    gap = 10,
    align = 'center',
    textStyle,
    textNumberOfLines = 1,
    textAllowFontScaling = true,
    containerStyle,
    buttonStyle,
    shadow = false,
    shadowStyle,
    minWidth,
    minHeight,
    hitSlopPadding = 8,
    onPress,
    ...pressableProps
}: ButtonProps) {
    const theme = themeColors ?? DEFAULT_THEME_COLORS;
    const preset = SIZE_PRESETS[size];

    const computed = useMemo(() => {
        const base = resolveIntentColors(theme, intent, variant);

        const merged: Required<ButtonColors> = {
            background: colors?.background ?? base.background,
            foreground: colors?.foreground ?? base.foreground,
            border: colors?.border ?? base.border,
            pressedBackground: colors?.pressedBackground ?? base.pressedBackground,
            disabledBackground: colors?.disabledBackground ?? base.disabledBackground,
            disabledForeground: colors?.disabledForeground ?? base.disabledForeground,
        };

        const isDisabled = disabled || loading;

        if (variant === 'solid') {
            return {
                backgroundColor: isDisabled ? merged.disabledBackground : merged.background,
                borderColor: 'transparent',
                borderWidth: 0,
                foregroundColor: isDisabled ? merged.disabledForeground : merged.foreground,
                pressedOverlay: merged.pressedBackground,
            };
        }

        // outline/text/ghost all render like text-ish controls but with different foreground/pressed tokens
        return {
            backgroundColor: 'transparent',
            borderColor: merged.border,
            borderWidth: variant === 'outline' ? 1 : 0,
            foregroundColor: isDisabled ? merged.disabledForeground : merged.foreground,
            pressedOverlay: merged.pressedBackground,
        };
    }, [theme, intent, variant, colors, disabled, loading]);

    const effectiveOnPress = (e: GestureResponderEvent) => {
        if (disabled || loading) return;
        onPress?.(e);
    };

    const justifyContent: ViewStyle['justifyContent'] =
        align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

    const hitSlop =
        hitSlopPadding > 0
            ? { top: hitSlopPadding, bottom: hitSlopPadding, left: hitSlopPadding, right: hitSlopPadding }
            : undefined;

    const wantFull = fullWidth;

    return (
        <View style={containerStyle}>
            <Pressable
                {...pressableProps}
                hitSlop={hitSlop}
                accessibilityRole="button"
                accessibilityState={{ disabled: disabled || loading }}
                onPress={effectiveOnPress}
                style={({ pressed }) => [
                    {
                        width: wantFull ? '100%' : undefined,
                        minWidth: isNumber(minWidth) ? minWidth : undefined,
                        minHeight: isNumber(minHeight) ? minHeight : preset.minHeight,
                        borderRadius: radius,
                        backgroundColor: computed.backgroundColor,
                        borderColor: computed.borderColor,
                        borderWidth: computed.borderWidth,
                        overflow: 'hidden',
                    },
                    shadow
                        ? [
                            {
                                elevation: 2,
                                shadowOpacity: 0.15,
                                shadowRadius: 6,
                                shadowOffset: { width: 0, height: 2 },
                            },
                            shadowStyle,
                        ]
                        : null,
                    buttonStyle,
                ]}>
                {({ pressed }) => (
                    <>
                        {/* pressed overlay */}
                        {pressed && !(disabled || loading) ? (
                            <View
                                pointerEvents="none"
                                style={{
                                    ...ABSOLUTE_FILL,
                                    backgroundColor: computed.pressedOverlay,
                                }}
                            />
                        ) : null}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent,
                                paddingHorizontal: isNumber(paddingHorizontal) ? paddingHorizontal : (variant === 'text' ? 0 : preset.px),
                                paddingVertical: isNumber(paddingVertical) ? paddingVertical : (variant === 'text' ? 8 : preset.py),
                                width: wantFull ? '100%' : undefined,
                                gap,
                            }}>
                            {left ? <View style={{ alignItems: 'center' }}>{left}</View> : null}
                            {children ? (
                                children
                            ) : (
                                <Text
                                    allowFontScaling={textAllowFontScaling}
                                    numberOfLines={textNumberOfLines}
                                    style={[
                                        {
                                            color: computed.foregroundColor,
                                            fontSize: preset.fontSize,
                                            fontWeight: '600',
                                        },
                                        textStyle,
                                    ]}>
                                    {title ?? ''}
                                </Text>
                            )}
                            {right ? <View style={{ alignItems: 'center' }}>{right}</View> : null}
                            {loading ? (
                                <View style={{ marginLeft: 8 }}>
                                    <ActivityIndicator size="small" color={spinnerColor ?? computed.foregroundColor} />
                                </View>
                            ) : null}
                        </View>
                    </>
                )}
            </Pressable>
        </View>
    );
}

const ABSOLUTE_FILL: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
};