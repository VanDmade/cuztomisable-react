// src/hooks/useMessage.ts
import { useState } from 'react';

export function useMessage() {
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'danger' | 'warning' | 'info' } | null>(null);
    const showMessage = (text: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info') => setMessage({ text, type });
    const clearMessage = () => setMessage(null);
    return { message, showMessage, clearMessage };
}
