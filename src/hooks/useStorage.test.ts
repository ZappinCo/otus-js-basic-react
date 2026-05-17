import { renderHook, act, waitFor } from '@testing-library/react';
import { useStorage } from './useStorage';

describe('useStorage', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('возвращает начальное состояние', () => {
        const { result } = renderHook(() => useStorage());
        
        expect(result.current.city).toBe('');
        expect(result.current.searchHistory).toEqual([]);
    });

    it('сохраняет город', () => {
        const { result } = renderHook(() => useStorage());
        
        act(() => {
            result.current.saveCity('Moscow');
        });
        
        expect(result.current.city).toBe('Moscow');
        expect(result.current.searchHistory).toEqual(['Moscow']);
    });

    it('не сохраняет пустой город', () => {
        const { result } = renderHook(() => useStorage());
        
        act(() => {
            result.current.saveCity('');
        });
        
        expect(result.current.city).toBe('');
        expect(result.current.searchHistory).toEqual([]);
    });

    it('сохраняет историю поиска с ограничением 10 элементов', () => {
        const { result } = renderHook(() => useStorage());
        
        act(() => {
            for (let i = 1; i <= 15; i++) {
                result.current.saveCity(`City${i}`);
            }
        });
        
        expect(result.current.searchHistory.length).toBe(10);
        expect(result.current.searchHistory[0]).toBe('City15');
        expect(result.current.searchHistory[9]).toBe('City6');
    });

    it('не создает дубликаты в истории', () => {
        const { result } = renderHook(() => useStorage());
        
        act(() => {
            result.current.saveCity('Moscow');
            result.current.saveCity('London');
            result.current.saveCity('Moscow');
        });
        
        expect(result.current.searchHistory).toEqual(['Moscow', 'London']);
        expect(result.current.searchHistory.length).toBe(2);
    });
});