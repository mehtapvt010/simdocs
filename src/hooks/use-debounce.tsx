import { useCallback, useRef } from "react";

export function useDebounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    callback: T,
    delay: number=500
){
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    return useCallback((...args: Parameters<T>) => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        timeout.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);
}
