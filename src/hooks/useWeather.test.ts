import { renderHook, act, waitFor } from '@testing-library/react';
import { HttpService } from '../services/httpService';

vi.mock('../utils/parseWeatherApiResponse', () => ({
    parseWeatherApiResponse: vi.fn((result) => ({
        success: true,
        city: result.data?.city?.name || 'Moscow',
        list: result.data?.list?.map((item: any) => ({
            dt: item.dt_txt,
            temp: item.main.temp,
            description: item.weather?.[0]?.description || ''
        })) || []
    }))
}));

const mockGet = vi.fn();
HttpService.prototype.get = mockGet;

import { useWeather } from './useWeather';

describe('useWeather', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('возвращает начальное состояние', () => {
        const { result } = renderHook(() => useWeather());
        
        expect(result.current.weatherData).toBeNull();
        expect(result.current.historyData).toBeNull();
        expect(result.current.error).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it('получает погоду по городу', async () => {
        const mockResponse = {
            list: [
                { 
                    dt_txt: '2024-01-15 12:00:00',
                    main: { temp: 25, temp_min: 18, pressure: 1013, humidity: 65 },
                    weather: [{ description: 'clear', icon: '01d' }],
                    wind: { speed: 5 }
                }
            ],
            city: { name: 'Moscow' }
        };
        
        mockGet.mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useWeather());
        
        await act(async () => {
            await result.current.fetchByCity('Moscow');
        });
        
        expect(mockGet).toHaveBeenCalledWith(expect.stringContaining('q=Moscow'));
        
        await waitFor(() => {
            expect(result.current.weatherData).not.toBeNull();
        });
    });

    it('обрабатывает ошибку при получении погоды', async () => {
        mockGet.mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useWeather());
        
        await act(async () => {
            try {
                await result.current.fetchByCity('InvalidCity');
            } catch (e) {
            }
        });
        
        expect(result.current.error).not.toBeNull();
    });
});