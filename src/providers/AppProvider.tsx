// providers/AppProvider.tsx
import React, { ReactNode } from 'react';
import { ConfigProvider } from './ConfigProvider';
import { ThemeWrapper } from './ThemeWrapper';

type AppProviderProps = {
    config: any; // Replace 'any' with a more specific type if available
    children: ReactNode;
};

export const AppProvider = ({ config, children }: AppProviderProps) => {
    return (
        <ConfigProvider config={config}>
            <ThemeWrapper>{children}</ThemeWrapper>
        </ConfigProvider>
    );
};