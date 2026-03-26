// src/hooks/useAsyncAction.ts
import { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { useMessage } from '../contexts/MessageContext';
import { useBusy } from '../hooks/useBusy';
import { formatErrorResponse } from '../utils/formatters';

type Errors = Record<string, string | undefined> | null;

export function useAsyncAction(throwError = false) {
    const [busy, setBusy] = useBusy();
    const { banner, showMessage, clearMessage } = useMessage();
    const [errors, setErrors] = useState<Errors>(null);
    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            return busy ? true : false;
        });
        return () => sub.remove();
    }, [busy]);

    const runAction = useCallback(async (fn: () => Promise<void>, delay: number = 0) => {
        clearMessage();
        setErrors(null);
        setBusy(true);
        try {
            await fn();
        } catch (e: any) {
            console.log(e);
            const { message: msgText, errors: fieldErrors } = formatErrorResponse(e);
            showMessage(msgText, 'danger');
            setErrors(fieldErrors);
            if (throwError) {
                throw e;
            }
        } finally {
            setTimeout(() => {
                setBusy(false);
            }, delay);
        }
    }, [clearMessage, setBusy, showMessage]);
    const clearErrors = useCallback(() => {
        clearMessage();
        setErrors(null);
    }, [clearMessage]);
    return {
        busy,
        errors,
        runAction,
        clearErrors,
        setErrors,
        // Expose banner if you still want it for local inline Message usage:
        banner,
    };
}
