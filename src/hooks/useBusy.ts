// src/hooks/useBusy.ts
import { useState } from 'react';

export function useBusy(delay = 1000) {
    const [busy, setBusyState] = useState(false);
    const setBusy = (val: boolean) => {
        if (!val) {
            setTimeout(() => setBusyState(false), delay);
        } else {
            setBusyState(true);
        }
    };
    return [busy, setBusy] as const;
}
