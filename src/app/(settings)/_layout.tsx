// src/app/(settings)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { TopNav } from '../../components/TopNav';
import { SettingsProvider } from '../../contexts/SettingsContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function SettingsLayout() {
    const { theme } = useTheme();

    return (
        <SettingsProvider>
            <View style={[theme.styles.flex, theme.styles.background]}>
                <TopNav title="Settings" back />
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
