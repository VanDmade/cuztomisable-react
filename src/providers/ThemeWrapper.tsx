// cuztomisable/providers/ThemeWrapper.tsx

import React, { useMemo } from 'react';
import { useConfig } from './ConfigProvider';
import { ThemeProvider } from './ThemeProvider';

type Props = {
    children: React.ReactNode;
};

export const ThemeWrapper = ({ children }: Props) => {
    const config = useConfig();

    const overrides = useMemo(() => {
        return {
            layout: {
                base: config.base,
            },
            ...config.theme,
        };
    }, [config.base, config.theme]);

    return (
        <ThemeProvider overrides={overrides}>
            {children}
        </ThemeProvider>
    );
};