// src/hooks/useNavigationHistory.ts
import { usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';

export function useNavigationHistory() {
    const pathname = usePathname();
    const lastPath = useRef<string | null>(null);
    // Update history when path changes
    useEffect(() => {
        if (pathname !== lastPath.current) {
            lastPath.current = pathname;
        }
    }, [pathname]);
    return {
        pathname,
        lastPath: lastPath.current,
    };
}
