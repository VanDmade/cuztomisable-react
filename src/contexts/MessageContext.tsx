// src/contexts/MessageContext.tsx
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type MessageKind = 'success' | 'danger' | 'warning' | 'info';

export type Banner = {
    text: string;
    type: MessageKind;
} | null;

type MessageCtx = {
    banner: Banner;
    showMessage: (text: string, type?: MessageKind) => void;
    clearMessage: () => void;
};

const Ctx = createContext<MessageCtx | null>(null);

export function MessageProvider({ children }: { children: React.ReactNode }) {
    const [banner, setBanner] = useState<Banner>(null);

    const showMessage = useCallback((text: string, type: MessageKind = 'info') => {
        setBanner({ text, type });
    }, []);

    const clearMessage = useCallback(() => {
        setBanner(null);
    }, []);

    const value = useMemo(
        () => ({ banner, showMessage, clearMessage }),
        [banner, showMessage, clearMessage]
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMessage() {
    const ctx = useContext(Ctx);
    if (!ctx) {
        throw new Error('useMessage must be used within MessageProvider');
    }
    return ctx;
}
