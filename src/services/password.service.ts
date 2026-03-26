// src/services/password.service.ts
import { getApi as api } from '../api/api';

// Define response types
export type PasswordResetRequestResponse = {
    message: string;
    token: string;
};

export type PasswordResetVerifyResponse = {
    message: string;
    valid: boolean;
};

export type PasswordResetFinalizeResponse = {
    message: string;
};

export type PasswordResetResendResponse = {
    message: string;
};

export async function request(username: string): Promise<PasswordResetRequestResponse> {
    const { data } = await api().post('/password/forgot', { username });
    // Validate response shape
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from server');
    }
    if (!data.token) {
        throw new Error('Server did not return a reset token');
    }
    return {
        message: data.message ?? 'Check your email for a reset link',
        token: data.token,
    };
}

export async function verify(token: string, code: string): Promise<PasswordResetVerifyResponse> {
    if (code.trim() === '') {
        // The user has not sent in a code
        code = 'shame';
    }
    const { data } = await api().get(
        `/password/forgot/${encodeURIComponent(token)}/verify/${encodeURIComponent(code)}`
    );
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from server');
    }
    return {
        message: data.message ?? 'Verification complete',
        valid: data.valid ?? false,
    };
}

export async function resend(token: string): Promise<PasswordResetResendResponse> {
    const { data } = await api().get(`/password/forgot/${encodeURIComponent(token)}/send`);
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from server');
    }
    return {
        message: data.message ?? 'Reset code resent',
    };
}

export async function finalize(
    token: string,
    payload: { code: string; password: string }
): Promise<PasswordResetFinalizeResponse> {
    const { data } = await api().post(`/password/forgot/${encodeURIComponent(token)}`, payload);
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from server');
    }
    return {
        message: data.message ?? 'Password reset complete',
    };
}