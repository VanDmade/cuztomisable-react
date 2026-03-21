// src/contexts/SettingsContext.tsx
import React, { createContext, useContext, useMemo, useState } from 'react';
import {
    changePassword as changePasswordService,
    get as getUserService,
    toggleTwoFactor as updateTwoFactorService,
    update as updateUserService,
    type ChangePasswordResponse,
    type GetUserResponse,
    type SaveProfileArgs,
    type ToggleTwoFactorResponse,
    type UpdateProfileResponse,
} from '../services/user.service';

type SettingsCtx = {
    loading: boolean;
    getProfile: () => Promise<GetUserResponse>;
    saveProfile: (payload: SaveProfileArgs) => Promise<UpdateProfileResponse>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<ChangePasswordResponse>;
    updateTwoFactor: (enabled: boolean) => Promise<ToggleTwoFactorResponse>;
};

const Ctx = createContext<SettingsCtx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);

    const getProfile = async (): Promise<GetUserResponse> => {
        setLoading(true);
        try {
            return await getUserService();
        } finally {
            setLoading(false);
        }
    };

    const saveProfile = async (payload: SaveProfileArgs): Promise<UpdateProfileResponse> => {
        setLoading(true);
        try {
            return await updateUserService(payload);
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (
        currentPassword: string,
        newPassword: string
    ): Promise<ChangePasswordResponse> => {
        setLoading(true);
        try {
            return await changePasswordService(currentPassword, newPassword);
        } finally {
            setLoading(false);
        }
    };

    const updateTwoFactor = async (enabled: boolean): Promise<ToggleTwoFactorResponse> => {
        setLoading(true);
        try {
            return await updateTwoFactorService(enabled);
        } finally {
            setLoading(false);
        }
    };

    const value = useMemo(
        () => ({ loading, getProfile, saveProfile, changePassword, updateTwoFactor }),
        [loading],
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
    const ctx = useContext(Ctx);
    if (!ctx) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return ctx;
}
