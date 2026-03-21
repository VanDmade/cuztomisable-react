// src/app/index.tsx

import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useOnboarding } from '../hooks/useOnboarding';

export default function Index() {
    const { theme } = useTheme();
    const { loading: authLoading, signedIn } = useAuth();
    const { loading: obLoading, onboardingComplete } = useOnboarding();
    const booting = authLoading || obLoading;

    useEffect(() => {
        if (!booting) {
            setTimeout(() => SplashScreen.hideAsync().catch(() => {}), 500);
        }
    }, [booting]);

    if (booting) {
        return (
            <View style={[theme.styles.flex, theme.styles.background, theme.styles.fullCenter]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    if (!onboardingComplete) {
        return <Redirect href="/(onboarding)" />;
    }
    if (!signedIn) {
        return <Redirect href="/(auth)/login" />;
    }
    return <Redirect href="/(tabs)/drinks" />;
}
