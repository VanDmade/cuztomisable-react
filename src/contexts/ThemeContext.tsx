// cuztomisable/contexts/ThemeContext.tsx
import * as SecureStore from 'expo-secure-store';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { makeTheme } from '../theme/theme';

type Appearance = 'default' | 'light' | 'dark';

type ThemeContextValue = {
    appearance: Appearance;
    effectiveAppearance: 'light' | 'dark';
    theme: ReturnType<typeof makeTheme>;
    setAppearance: (value: Appearance) => Promise<void>;
};

const THEME_KEY = 'appearance_setting';

const ThemeCtx = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemScheme = useColorScheme(); // 'light' | 'dark' | null
    const [appearance, setAppearanceState] = useState<Appearance>('default');

    // Load stored preference
    useEffect(() => {
        (async () => {
            const stored = await SecureStore.getItemAsync(THEME_KEY);
            if (stored === 'light' || stored === 'dark' || stored === 'default') {
                setAppearanceState(stored);
            }
        })();
    }, []);

    const setAppearance = useCallback(async (value: Appearance) => {
        setAppearanceState(value);
        await SecureStore.setItemAsync(THEME_KEY, value);
    }, []);

    // Decide what theme we actually use (system vs override)
    const effectiveAppearance: 'light' | 'dark' = useMemo(() => {
        if (appearance === 'default') {
            return (systemScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
        }
        return appearance;
    }, [appearance, systemScheme]);

    const theme = useMemo(() => makeTheme(effectiveAppearance), [effectiveAppearance]);

    const value = useMemo<ThemeContextValue>(() => {
        return {
            appearance,
            effectiveAppearance,
            theme,
            setAppearance,
        };
    }, [appearance, effectiveAppearance, theme]);

    return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeCtx);
    if (!ctx) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return ctx;
}
