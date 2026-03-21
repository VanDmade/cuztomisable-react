// src/app/(settings)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { TopNav } from '../../components/TopNav';
import { SettingsProvider } from '../../contexts/SettingsContext';
import { useTheme } from '../../contexts/ThemeContext';
import { images as themeImages } from '../../theme/images';

export default function SettingsLayout({ logoSource, backImageSource, profileImageSource }: { logoSource?: any, backImageSource?: any, profileImageSource?: any }) {
    const { theme } = useTheme();

    return (
        <SettingsProvider>
            <View style={[theme.styles.flex, theme.styles.background]}>
                <TopNav
                    title="Settings"
                    back
                    logoSource={logoSource || themeImages.logo}
                    backImageSource={backImageSource || themeImages.back}
                    profileImageSource={profileImageSource || themeImages.profile}
                />
                <View style={theme.styles.flex}>
                    <Stack
                        key={theme.mode}
                        screenOptions={{
                            headerShown: false,
                            animation: 'fade',
                            animationDuration: 250,
                            contentStyle: { backgroundColor: theme.colors.background },
                        }}/>
                </View>
            </View>
        </SettingsProvider>
    );
}
