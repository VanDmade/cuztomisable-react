// src/components/OnboardingSlide.tsx
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { AppConfig } from '../app.config';
import { makeTheme } from '../theme/theme';
const theme = makeTheme(AppConfig.defaultTheme);

export type OnboardingSlideProps = {
    image: ImageSourcePropType;
    title: string;
    subtitle?: string | null;
    description: string;
};

export function OnboardingSlide({
    image,
    title,
    subtitle,
    description,
}: OnboardingSlideProps) {
    const hasSubtitle = !!subtitle && subtitle.trim().length > 0;
    console.log('asdfasdfasdf');
    console.log(image);
    return (
        <View
            style={[theme.styles.container, theme.styles.rowFlexStart, styles.container]}
            accessible
            accessibilityRole="header">
            <Image source={image} style={[styles.image, theme.utils.mblg]} resizeMode="contain" />
            <Text style={{ color: 'red', fontSize: 10, marginBottom: 8 }}>{JSON.stringify(image)}</Text>
            <Text style={[theme.typography.variants.title, theme.styles.textCenter]} accessibilityRole="header">
                {title}
            </Text>
            {hasSubtitle && (
                <Text style={[theme.typography.variants.subtitle, theme.styles.textCenter]} accessibilityHint="Onboarding subtitle">
                    {subtitle}
                </Text>
            )}
            <Text style={[theme.typography.variants.body, theme.styles.textCenter, theme.utils.mtmd]} accessibilityHint="Onboarding description">
                {description}
            </Text>
        </View>
    );
}

export default OnboardingSlide;

const styles = StyleSheet.create({
    container: {
        paddingTop: 120,
        paddingHorizontal: 40,
    },
    image: {
        width: '100%',
        height: 260,
    },
});