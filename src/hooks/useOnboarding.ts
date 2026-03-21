// src/hooks/useOnboarding.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export const LAUNCHED = 'hasLaunched';
export const ONBOARDING_COMPLETE = 'onboardingComplete';

export function useOnboarding() {
    const [loading, setLoading] = useState(true);
    const [hasLaunched, setHasLaunched] = useState(false);
    const [onboardingComplete, setOnboardingComplete] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const [l, c] = await Promise.all([
                AsyncStorage.getItem(LAUNCHED),
                AsyncStorage.getItem(ONBOARDING_COMPLETE),
            ]);
            const launched = l === 'true';
            const complete = c === 'true';
            if (!launched) {
                await AsyncStorage.setItem(LAUNCHED, 'true');
            }
            setHasLaunched(true);
            setOnboardingComplete(complete);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const markComplete = async () => {
        await AsyncStorage.setItem(ONBOARDING_COMPLETE, 'true');
        setOnboardingComplete(true);
    };
    const resetOnboarding = async () => {
        await Promise.all([
            AsyncStorage.removeItem(LAUNCHED),
            AsyncStorage.removeItem(ONBOARDING_COMPLETE),
        ]);
        setHasLaunched(false);
        setOnboardingComplete(false);
    };
    return { loading, hasLaunched, onboardingComplete, markComplete, resetOnboarding, refresh };
}
