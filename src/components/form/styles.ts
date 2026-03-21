// src/components/form/styles.ts
import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/theme';

export const makeFormStyles = (theme: Theme) => {
    const danger = theme.colors.danger ?? '#D32F2F';
    return StyleSheet.create({
        wrapper: {
            width: '100%',
            marginBottom: 8,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 6,
            color: theme.colors.text,
        },
        inlineLabel: {
            fontSize: 15,
            fontWeight: '500',
            color: theme.colors.text,
        },
        helper: {
            marginTop: 2,
            fontSize: 12,
            color: theme.colors.muted ?? '#777',
        },
        error: {
            marginTop: 4,
            fontSize: 12,
            color: danger,
        },
        errorContainer: {
            minHeight: 18,
        },
        errorBorder: {
            borderColor: danger,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        rowSpaceBetween: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        input: {
            fontSize: theme.typography.sizes.xs,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 10,
            padding: 16,
            color: theme.colors.text,
            backgroundColor: theme.colors.background,
        },
        inputDisabled: {
            backgroundColor: theme.colors.white,
            color: theme.colors.muted,
        },
        chevron: {
            marginLeft: 8,
            fontSize: 12,
            color: theme.colors.text,
        },
        divider: {
            width: 1,
            alignSelf: 'stretch',
            marginHorizontal: 4,
        },
        chip: {
            borderRadius: 16,
            paddingHorizontal: 10,
            paddingVertical: 6,
            marginRight: 8,
            marginBottom: 8,
        },
        chipText: {
            fontSize: 12,
            fontWeight: '600',
        },
        chipRemove: {
            marginLeft: 6,
            fontWeight: '700',
        },
    });
};
