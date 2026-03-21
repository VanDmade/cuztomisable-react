import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Message } from '../components';
import { AuthProvider } from '../contexts/AuthContext';
import { MessageProvider } from '../contexts/MessageContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

function AppShell() {
    const { theme, effectiveAppearance } = useTheme();

    useEffect(() => {
        NavigationBar.setButtonStyleAsync(effectiveAppearance === 'dark' ? 'light' : 'dark').catch(() => { });
    }, [effectiveAppearance, theme.colors.background]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <StatusBar
                style={effectiveAppearance === 'dark' ? 'light' : 'dark'}
                backgroundColor={theme.colors.background}
            />
            <Stack
                key={effectiveAppearance}
                screenOptions={{
                    header: () => null, // Forcefully hide header in all generated layouts
                    headerShown: false,
                    animation: 'fade',
                    animationDuration: 250,
                    contentStyle: { backgroundColor: theme.colors.background },
                }}
            />
            <Message />
        </View>
    );
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({ ...MaterialCommunityIcons.font });
    if (!fontsLoaded) {
        return <Text>Loading fonts...</Text>;
    }
    return (
        <ThemeProvider>
            <MessageProvider>
                <AuthProvider>
                    <AppShell />
                </AuthProvider>
            </MessageProvider>
        </ThemeProvider>
    );
}
