// src/hooks/useFirstLaunch.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const KEY = 'hasLaunched';

export function useFirstLaunch() {
    const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);
    useEffect(() => {
        (async () => {
            try {
                const v = await AsyncStorage.getItem(KEY);
                if (v === null) {
                    await AsyncStorage.setItem(KEY, 'true');
                    setFirstLaunch(true);
                } else {
                    setFirstLaunch(false);
                }
            } catch {
                setFirstLaunch(false);
            }
        })();
    }, []);
    return firstLaunch; // null | true | false
}