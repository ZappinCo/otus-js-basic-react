import { renderHook, act } from '@testing-library/react';
import { useInput } from './useInput';

describe('useInput', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('возвращает начальное значение', () => {
        const { result } = renderHook(() => useInput('initial'));
        
        expect(result.current.value).toBe('initial');
        expect(result.current.debouncedValue).toBe('initial');
    });

    it('возвращает пустую строку по умолчанию', () => {
        const { result } = renderHook(() => useInput());
        
        expect(result.current.value).toBe('');
        expect(result.current.debouncedValue).toBe('');
    });

    it('обновляет value сразу при изменении', () => {
        const { result } = renderHook(() => useInput());
        
        act(() => {
            result.current.onChange({ target: { value: 'test' } } as any);
        });
        
        expect(result.current.value).toBe('test');
    });

    it('обновляет debouncedValue с задержкой', () => {
        const { result } = renderHook(() => useInput());
        
        act(() => {
            result.current.onChange({ target: { value: 'test' } } as any);
        });
        
        expect(result.current.debouncedValue).toBe('');
        
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        
        expect(result.current.debouncedValue).toBe('test');
    });

    it('сбрасывает таймер при новом вводе', () => {
        const { result } = renderHook(() => useInput());
        
        act(() => {
            result.current.onChange({ target: { value: 'first' } } as any);
            vi.advanceTimersByTime(300);
            result.current.onChange({ target: { value: 'second' } } as any);
            vi.advanceTimersByTime(1000);
        });
        
        expect(result.current.debouncedValue).toBe('second');
    });
});