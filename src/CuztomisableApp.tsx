import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

import { Message } from './components/ui/Message';
import { AuthProvider } from './contexts/AuthContext';
import { MessageProvider } from './contexts/MessageContext';
import { AppProvider } from './providers/AppProvider';
import { useTheme } from './providers/ThemeProvider';

function AppShell() {
    const { color, styles, mode } = useTheme();

    useEffect(() => {
        NavigationBar.setButtonStyleAsync(
            mode === 'dark' ? 'light' : 'dark'
        ).catch(() => {});
    }, [mode, color.background]);

    return (
        <View style={[styles.flex, { backgroundColor: color.background }]}>
            <StatusBar
                style={mode === 'dark' ? 'light' : 'dark'}
                backgroundColor={color.background}
            />

            <Stack
                key={mode}
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    animationDuration: 250,
                    contentStyle: { backgroundColor: color.background },
                }}
            />

            <Message />
        </View>
    );
}

export function CuztomisableApp({ config = {}, theme }: any) {
    const [fontsLoaded] = useFonts({ ...MaterialCommunityIcons.font });

    if (!fontsLoaded) {
        return <Text>Loading fonts...</Text>;
    }

    return (
        <AppProvider config={config} theme={theme}>
            <MessageProvider>
                <AuthProvider>
                    <AppShell />
                </AuthProvider>
            </MessageProvider>
        </AppProvider>
    );
}