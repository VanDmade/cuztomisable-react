// cuztomisable/providers/ThemeProvider.tsx

import React, { createContext, useContext, useMemo } from 'react';
import { createTheme, Theme, ThemeOverrides } from '../theme/theme';

type ThemeProviderProps = {
    mode: 'light' | 'dark';
    overrides?: ThemeOverrides;
    children: React.ReactNode;
};

const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider = ({
    mode,
    overrides = {},
    children,
}: ThemeProviderProps) => {
    const theme = useMemo(() => {
        return createTheme(mode, overrides);
    }, [mode, overrides]);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): Theme => {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return ctx;
};