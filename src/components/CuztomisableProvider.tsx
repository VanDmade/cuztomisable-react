// cuztomisable/components/CuztomisableProvider.tsx
import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { MessageProvider } from '../contexts/MessageContext';
import { PasswordProvider } from '../contexts/PasswordContext';
import { SettingsProvider } from '../contexts/SettingsContext';
import { ThemeProvider } from '../contexts/ThemeContext';

interface CuztomisableProviderProps {
  children: React.ReactNode;
}

export function CuztomisableProvider({ children }: CuztomisableProviderProps) {
    return (
        <ThemeProvider>
            <MessageProvider>
                <AuthProvider>
                    <PasswordProvider>
                        <SettingsProvider>
                            {children}
                        </SettingsProvider>
                    </PasswordProvider>
                </AuthProvider>
            </MessageProvider>
        </ThemeProvider>
    );
}
