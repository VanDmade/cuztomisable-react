// src/components/form/Header.tsx
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
    theme: ReturnType<typeof import('../../theme/theme').makeTheme>;
    title: string;
    subtitle?: string;
    logoSource?: ImageSourcePropType;
    containerStyle?: ViewStyle | ViewStyle[];
};

export const FormHeader: React.FC<Props> = ({
    theme,
    title,
    subtitle,
    logoSource,
    containerStyle,
}) => {
    return (
        <View style={[styles.headerRow, theme.utils.mbsm, containerStyle]}>
            {logoSource && (
                <Image
                    source={logoSource}
                    style={styles.logo}
                    resizeMode="contain" />
            )}
            <View style={styles.headerTextWrapper}>
                <Text style={theme.typography.variants.title}>{title}</Text>
                {subtitle ? (
                    <Text style={theme.typography.variants.subtitle}>{subtitle}</Text>
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 48,
        height: 48,
        marginRight: 12,
    },
    headerTextWrapper: {
        flexShrink: 1,
    },
});
