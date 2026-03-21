// src/contexts/PasswordContext.tsx
import React, { createContext, useContext, useMemo } from 'react';
import {
    finalize as finalizeResetService,
    request as requestResetService,
    resend as resendResetService,
    verify as verifyResetService,
    type PasswordResetFinalizeResponse,
    type PasswordResetRequestResponse,
    type PasswordResetResendResponse,
    type PasswordResetVerifyResponse,
} from '../services/password.service';

type PasswordCtx = {
    request: (username: string) => Promise<PasswordResetRequestResponse>;
    finalize: (token: string, code: string, password: string) => Promise<PasswordResetFinalizeResponse>;
    verify: (token: string, code: string) => Promise<PasswordResetVerifyResponse>;
    resend: (token: string) => Promise<PasswordResetResendResponse>;
};

const Ctx = createContext<PasswordCtx | null>(null);

export function PasswordProvider({ children }: { children: React.ReactNode }) {
    const request = async (username: string) => {
        return await requestResetService(username);
    };
    const finalize = async (token: string, code: string, password: string) => {
        return await finalizeResetService(token, { code, password });
    };
    const verify = async (token: string, code: string) => {
        return await verifyResetService(token, code);
    };
    const resend = async (token: string) => {
        return await resendResetService(token);
    };
    const value = useMemo(() => ({ request, finalize, verify, resend }), []);
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePassword() {
    const ctx = useContext(Ctx);
    if (!ctx) {
        throw new Error('usePassword must be used within PasswordProvider');
    }
    return ctx;
}