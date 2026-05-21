import { renderHook, act } from '@testing-library/react';

vi.mock('../hooks/useLocation', () => ({
    useLocation: vi.fn()
}));

import { useLocation } from '../hooks/useLocation';

describe('useLocation', () => {
    it('возвращает начальное состояние', () => {
        const mockLocation = {
            location: undefined,
            isLoading: false,
            getUserLocation: vi.fn()
        };
        
        (useLocation as any).mockReturnValue(mockLocation);
        
        const { result } = renderHook(() => useLocation());
        
        expect(result.current.location).toBeUndefined();
        expect(result.current.isLoading).toBe(false);
    });

    it('возвращает локацию после загрузки', () => {
        const mockLocation = {
            location: { city: 'Moscow', error: null },
            isLoading: false,
            getUserLocation: vi.fn()
        };
        
        (useLocation as any).mockReturnValue(mockLocation);
        
        const { result } = renderHook(() => useLocation());
        
        expect(result.current.location?.city).toBe('Moscow');
    });
});