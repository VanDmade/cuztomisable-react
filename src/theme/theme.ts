// src/theme/theme.ts
import { StyleSheet } from 'react-native';
import { AppConfig, ThemeMode } from '../app.config';
import { getColors } from './colors';
import { spacing, utils } from './spacing';
import { getTypography } from './typography';

export const makeTheme = (mode: ThemeMode) => {
    const colors = getColors(mode);
    const typography = getTypography(mode);
    const radius = AppConfig.layout.radius;
    const styles = StyleSheet.create({
        widthFull: {
            width: '100%',
        },
        heightFull: {
            height: '100%',
        },
        form: {
            marginTop: 16,
            marginBottom: 12,
        },
        container: {
            justifyContent: 'flex-start',
        },
        screen: {
            flex: 1,
            justifyContent: 'flex-start',
        },
        wrapper: {
            width: '100%',
            marginBottom: 4,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 6,
        },
        input: {
            fontSize: typography.sizes.xs,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            padding: 16,
            color: colors.text,
            backgroundColor: colors.background,
        },
        inputDisabled: {
            backgroundColor: colors.white,
            color: colors.muted,
        },
        button: {
            backgroundColor: colors.primary,
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: 'center',
        },
        disabledButton: {
            backgroundColor: '#B0BEC5',
            opacity: 0.6,
        },
        buttonText: {
            color: colors.background,
            fontWeight: typography.weights.bold,
            fontSize: typography.sizes.sm,
        },
        mutedText: {
            color: colors.muted,
        },
        image: {
            width: '80%',
            height: 260,
            marginBottom: 24,
            alignSelf: 'center',
            marginTop: 0,
        },
        backdrop: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        chevron: {
            marginLeft: 8,
            fontSize: 12,
            color: colors.text,
        },
        backdropHitbox: {
            ...StyleSheet.absoluteFillObject,
        },
        background: {
            backgroundColor: colors.background,
        },
        textCenter: { textAlign: 'center' },
        alignCenter: { alignItems: 'center' },
        alignSelfCenter: { alignSelf: 'center' },
        justifyCenter: { justifyContent: 'center' },
        fullCenter: {
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
        },
        textRight: { textAlign: 'right' },
        alignRight: { alignItems: 'flex-end' },
        alignSelfRight: { alignSelf: 'flex-end' },
        justifyRight: { justifyContent: 'flex-end' },
        fullRight: {
            textAlign: 'right',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
        },
        textLeft: { textAlign: 'left' },
        alignLeft: { alignItems: 'flex-start' },
        alignSelfLeft: { alignSelf: 'flex-start' },
        justifyLeft: { justifyContent: 'flex-start' },
        fullLeft: {
            textAlign: 'left',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
        },
        flex: {
            flex: 1,
        },
        positionAbsolute: {
            position: 'absolute',
        },
        positionRelative: {
            position: 'relative',
        },
        row: {
            flexDirection: 'row',
        },
        rowSpaceBetween: {
            justifyContent: 'space-between',
        },
        rowSpaceEvenly: {
            justifyContent: 'space-evenly',
        },
        rowFlexStart: {
            justifyContent: 'flex-start',
        },
        rowJustifyContentCenter: {
            justifyContent: 'center',
        },
        rowSelected: {
            backgroundColor: 'rgba(0,0,0,0.1)',
        },
        rowLeft: {
            flexShrink: 1,
        },
        rowLabel: {
            fontSize: 16,
            fontWeight: '500',
            color: '#111',
        },
        rowDesc: {
            fontSize: 13,
            color: '#666',
            marginTop: 2,
        },
        rowRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginLeft: 12,
        },
        rowRightText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#111',
        },
        errorBorder: {
            borderColor: colors.danger || '#D32F2F',
        },
        errorContainer: {
            minHeight: 18,
        },
        divider: {
            width: 1,
            alignSelf: 'stretch',
            marginHorizontal: 4,
        },
    });
    return {
        mode,
        colors,
        spacing,
        radius,
        typography,
        styles,
        utils,
    } as const;
};

export type Theme = ReturnType<typeof makeTheme>;
