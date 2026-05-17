import { useState, useCallback, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";

export const useInput = (initValue: string = "") => {
    const delay = 1000;
    const [value, setValue] = useState(initValue);
    const [debouncedValue, setDebouncedValue] = useState(initValue);
    const timeoutId = useRef<number | null>(null);


    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (timeoutId.current)
            clearTimeout(timeoutId.current);

        timeoutId.current = setTimeout(() => {
            setDebouncedValue(newValue);
        }, delay);
    }, [delay]);

    useEffect(() => {
        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, []);

    return {
        value,
        debouncedValue,
        setValue: setValue,
        onChange: handleChange,
    }
}