// src/hooks/useCountdown.ts
import { useEffect, useRef, useState } from 'react';

export function useCountdown(seconds: number, autoStart = true) {
    const [timeLeft, setTimeLeft] = useState(seconds);
    const [active, setActive] = useState(autoStart);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!active) {
            return;
        }
        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(intervalRef.current!);
    }, [active]);

    const reset = (newSeconds?: number) => {
        clearInterval(intervalRef.current!);
        setTimeLeft(newSeconds ?? seconds);
        setActive(true);
    };

    const stop = () => setActive(false);

    return { timeLeft, active, reset, stop, isDone: timeLeft === 0 };
}
