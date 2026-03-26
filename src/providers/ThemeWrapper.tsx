// cuztomisable/providers/ThemeWrapper.tsx

import React, { useMemo } from 'react';
import { Appearance } from 'react-native';
import { useConfig } from './ConfigProvider';
import { ThemeProvider } from './ThemeProvider';

type Props = {
    children: React.ReactNode;
};

export const ThemeWrapper = ({ children }: Props) => {
    const config = useConfig();
    // Get system theme (light/dark)
    const systemTheme = Appearance.getColorScheme();
    const mode = useMemo<'light' | 'dark'>(() => {
        if (config.followSystemTheme) {
        return (systemTheme as 'light' | 'dark') || 'light';
        }
        return config.defaultTheme;
    }, [config.followSystemTheme, config.defaultTheme, systemTheme]);
    const overrides = useMemo(() => {
        return {
        layout: {
            base: config.base,
        },
        };
    }, [config.base]);

    return (
        <ThemeProvider mode={mode} overrides={overrides}>
            {children}
        </ThemeProvider>
    );
};