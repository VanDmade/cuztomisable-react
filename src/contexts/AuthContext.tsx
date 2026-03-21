// src/contexts/AuthContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
    finalizeMfa as finalizeMfaService,
    getAccessToken,
    getUser,
    login as loginService,
    logout as logoutService,
    register as registerService,
    sendMfaCode as sendMfaService,
    verifyMfaToken as verifyMfaService,
    type FinalizeMfaResponse,
    type RegisterResponse,
    type SendMfaCodeResponse,
    type VerifyMfaTokenResponse
} from '../services/auth.service';

type LoginResult = {
    message: string;
    requiresMfa: boolean;
    token?: string;
};

type AuthCtx = {
    loading: boolean;
    signedIn: boolean;
    user: any | null;
    refreshUser: () => Promise<void>;
    login: (username: string, password: string) => Promise<LoginResult>;
    register: (name: string, email: string, phone: string, password: string) => Promise<RegisterResponse>;
    verifyMfaToken: (token: string) => Promise<VerifyMfaTokenResponse>;
    sendMfaCode: (token: string, type: string) => Promise<SendMfaCodeResponse>;
    finalizeMfa: (token: string, code: string) => Promise<FinalizeMfaResponse>;
    logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [signedIn, setSignedIn] = useState(false);
    const [user, setUser] = useState<any | null>(null);

    const refreshUser = useCallback(async () => {
        const storedUser = await getUser();
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    // Restore tokens on app start
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const storedAccess = await getAccessToken();
                if (!alive) {
                    return;
                }
                if (storedAccess) {
                    setSignedIn(true);
                    await refreshUser();
                } else {
                    setSignedIn(false);
                    setUser(null);
                }
            } finally {
                if (alive) {
                    setLoading(false);
                }
            }
        })();
        return () => {
            alive = false;
        };
    }, [refreshUser]);

    const login = async (username: string, password: string): Promise<LoginResult> => {
        setLoading(true);
        try {
            const data = await loginService(username, password);
            // If MFA is required, we do NOT have access/refresh tokens yet
            if (data.multi_factor_authentication) {
                return {
                    message: data.message,
                    requiresMfa: true,
                    token: data.token,
                };
            }
            setSignedIn(true);
            await refreshUser();
            return {
                message: data.message,
                requiresMfa: false,
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (
        name: string,
        email: string,
        phone: string,
        password: string
    ): Promise<RegisterResponse> => {
        setLoading(true);
        try {
            return await registerService({ name, email, phone, password });
        } finally {
            setLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        setLoading(true);
        try {
            await logoutService();
            setSignedIn(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const verifyMfaToken = async (token: string): Promise<VerifyMfaTokenResponse> => {
        setLoading(true);
        try {
            return await verifyMfaService(token);
        } finally {
            setLoading(false);
        }
    };

    const sendMfaCode = async (token: string, type: string): Promise<SendMfaCodeResponse> => {
        setLoading(true);
        try {
            return await sendMfaService(token, type);
        } finally {
            setLoading(false);
        }
    };

    const finalizeMfa = async (token: string, code: string): Promise<FinalizeMfaResponse> => {
        setLoading(true);
        try {
            const data = await finalizeMfaService(token, code);
            setSignedIn(true);
            await refreshUser();
            return data;
        } finally {
            setLoading(false);
        }
    };

    const value = useMemo(
        () => ({
            loading,
            signedIn,
            user,
            refreshUser,
            login,
            register,
            logout,
            verifyMfaToken,
            sendMfaCode,
            finalizeMfa,
        }),
        [loading, signedIn, user],
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
    const ctx = useContext(Ctx);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
}
